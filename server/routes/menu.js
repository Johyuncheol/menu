const express = require("express");
const router = express.Router();
const db = require("../db");

// 테이블이 존재하는지 확인하고, 없으면 생성하는 함수
const ensureTableExists = async (category) => {
  try {
    const [rows] = await db.query("SHOW TABLES LIKE ?", [category]);
    if (rows.length === 0) {
      // 테이블이 존재하지 않으면 새로 생성
      const createTableQuery = `
        CREATE TABLE ?? (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          sub JSON,
          toggle TINYINT(1) NOT NULL,
          admin ENUM('admin', 'general') NOT NULL
        )
      `;
      await db.query(createTableQuery, [category]);
      console.log(`Table ${category} created successfully.`);
    }
  } catch (error) {
    console.error("테이블 확인 또는 생성 중 오류 발생:", error);
    throw error; // 호출자에게 오류 전파
  }
};

// POST 요청 핸들러
router.post("/:category", async (req, res) => {
  const category = req.params.category;
  const addItem = req.body.newData;

  console.log(`Category: ${category}, AddItem: ${addItem.admin}`);

  // toggle 값을 1 또는 0으로 변환
  const validToggle =
    addItem.toggle === true ||
    addItem.toggle === "true" ||
    addItem.toggle === 1 ||
    addItem.toggle === "1"
      ? 1
      : 0;

  try {
    // 테이블 존재 확인
    await ensureTableExists(category);

    // 새로운 항목을 테이블에 추가
    const query = `INSERT INTO ${category} (title, sub, toggle, admin) VALUES (?, ?, ?, ?)`;
    const [result] = await db.query(query, [
      addItem.title,
      JSON.stringify(addItem.sub),
      validToggle,
      addItem.admin,
    ]);

    console.log(result);
    res.status(200).json({ message: "아이템이 성공적으로 추가되었습니다" });
  } catch (error) {
    console.error("데이터 추가 중 오류 발생:", error);
    res.status(500).json({ error: "데이터 추가에 실패했습니다" });
  }
});

// GET 요청 핸들러
router.get("/:category", async (req, res) => {
  const category = req.params.category;
  console.log(`Category: ${category}`);
  try {
    // 테이블 존재 확인
    await ensureTableExists(category);

    // 테이블에서 데이터 조회
    const [rows] = await db.query("SELECT * FROM ??", [category]);
    const menuData = {
      adminMenu: rows.filter((item) => item.admin === "admin"),
      generalMenu: rows.filter((item) => item.admin === "general"),
    };

    console.log(menuData); // 쿼리 결과 로그
    res.status(200).json(menuData);
  } catch (error) {
    console.error("데이터 조회 중 오류 발생:", error);
    res.status(500).json({ error: "데이터 조회에 실패했습니다" });
  }
});

// DELETE 요청 핸들러
router.delete("/:category", async (req, res) => {
  const category = req.params.category;
  const deleteItemID = req.body.id;

  console.log(`Category: ${category}, DeleteItemID: ${deleteItemID}`);

  try {
    // 테이블 존재 확인
    await ensureTableExists(category);

    // 특정 ID의 항목 삭제
    const [result] = await db.query("DELETE FROM ?? WHERE id = ?", [
      category,
      deleteItemID,
    ]);
    console.log(result);

    res.status(200).json({ message: "아이템이 성공적으로 삭제되었습니다" });
  } catch (error) {
    console.error("데이터 삭제 중 오류 발생:", error);
    res.status(500).json({ error: "데이터 삭제에 실패했습니다" });
  }
});

// PUT 요청 핸들러 (아이템 업데이트)
router.put("/:category", async (req, res) => {
  const category = req.params.category;
  const { id, title, sub, toggle, admin } = req.body.newData;

  // 'toggle' 값을 정수형 0 또는 1로 변환
  const validToggle =
    toggle === true || toggle === "true" || toggle === 1 || toggle === "1"
      ? 1
      : 0;

  try {
    // 테이블 존재 확인
    await ensureTableExists(category);

    // 항목 업데이트
    const query = `
      UPDATE ${category}
      SET title = ?, sub = ?, toggle = ?, admin = ?
      WHERE id = ?;
    `;
    const [result] = await db.query(query, [
      title,
      JSON.stringify(sub),
      validToggle,
      admin,
      id,
    ]);

    res.status(200).json({ message: "아이템이 성공적으로 업데이트되었습니다" });
  } catch (error) {
    console.error("아이템 업데이트 중 오류 발생:", error);
    res.status(500).json({ error: "아이템 업데이트에 실패했습니다" });
  }
});

// 메뉴 순서 변경
router.put("/:category/reorder", async (req, res) => {
  const category = req.params.category;
  const { updatedData } = req.body;

  console.log("Updated Data:", updatedData);

  try {
    // 테이블 존재 확인
    await ensureTableExists(category);

    // 기존 데이터 삭제 후 재삽입
    const [result] = await db.query("DELETE FROM ??", [category]);

    for (const item of updatedData) {
      console.log(item);
      // 테이블에 항목 재삽입
      const query = `INSERT INTO ${category} (title, sub, toggle, admin) VALUES (?, ?, ?, ?)`;
      await db.query(query, [
        item.title,
        JSON.stringify(item.sub),
        item.toggle,
        item.admin,
      ]);
    }

    res.status(200).json({ message: "메뉴 순서가 성공적으로 변경되었습니다" });
  } catch (error) {
    console.error("메뉴 순서 변경 중 오류 발생:", error);
    res.status(500).json({ error: "메뉴 순서 변경에 실패했습니다" });
  }
});

module.exports = router;
