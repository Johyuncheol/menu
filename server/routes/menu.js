const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/:category", async (req, res) => {
  const category = req.params.category;
  const addItem = req.body.newData;

  console.log(`Category: ${category}, AddItem: ${addItem.admin}`);

  const validToggle =
    addItem.toggle === true ||
    addItem.toggle === "true" ||
    addItem.toggle === 1 ||
    addItem.toggle === "1"
      ? 1
      : 0;

  try {
    // 테이블 이름과 데이터 값을 안전하게 바인딩
    const query = `INSERT INTO ${category} ( title, sub, toggle, admin) VALUES ( ?, ?, ?, ?)`;
    const [result] = await db.query(query, [
      addItem.title,
      JSON.stringify(addItem.sub),
      validToggle,
      addItem.admin,
    ]);

    console.log(result);

    res.status(200).json({ message: "Item Add successfully" });
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json({ error: "Failed to delete data" });
  }
});

router.get("/:category", async (req, res) => {
  const category = req.params.category;
  console.log(`Category: ${category}`);
  try {
    // 테이블에서 모든 데이터 조회
    const [rows] = await db.query(`SELECT * FROM ??`, [category]);
    //mysql용 
/*     const menuData = {
      adminMenu: rows.filter((item) => item.admin === "admin"),
      generalMenu: rows.filter((item) => item.admin === "general"),
    }; */

    //mariaDB용 
    const menuData = {
      adminMenu: rows
        .filter((item) => item.admin === "admin")
        .map((item) => ({
          ...item,
          sub: JSON.parse(item.sub) // sub 문자열을 배열로 변환
        })),
      generalMenu: rows
        .filter((item) => item.admin === "general")
        .map((item) => ({
          ...item,
          sub: JSON.parse(item.sub) // sub 문자열을 배열로 변환
        })),
    };

    console.log(menuData); // 쿼리 결과 로그
    res.status(200).json(menuData);
  } catch (error) {
    console.error("데이터 조회 중 오류 발생:", error);
    res.status(500).json({ error: "데이터 조회 실패" });
  }
});

router.delete("/:category", async (req, res) => {
  const category = req.params.category;
  const deleteItemID = req.body.id;

  console.log(`Category: ${category}, DeleteItemID: ${deleteItemID}`);

  try {
    // 테이블 이름과 데이터 값을 안전하게 바인딩
    const [result] = await db.query("DELETE FROM ?? WHERE id = ?", [
      category,
      deleteItemID,
    ]);
    console.log(result);

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json({ error: "Failed to delete data" });
  }
});

router.delete("/:category", async (req, res) => {
  const category = req.params.category;
  const deleteItemID = req.body.id;

  console.log(`Category: ${category}, DeleteItemID: ${deleteItemID}`);

  try {
    // 테이블 이름과 데이터 값을 안전하게 바인딩
    const [result] = await db.query("DELETE FROM ?? WHERE id = ?", [
      category,
      deleteItemID,
    ]);
    console.log(result);

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json({ error: "Failed to delete data" });
  }
});

router.put("/:category", async (req, res) => {
  const category = req.params.category;
  const { id, title, sub, toggle, admin } = req.body.newData;

  // 'toggle' 값을 정수형 0 또는 1로 변환
  const validToggle =
    toggle === true || toggle === "true" || toggle === 1 || toggle === "1"
      ? 1
      : 0;

  try {
    // SQL 쿼리 작성
    const query = `
      UPDATE ${category}
      SET title = ?, sub = ?, toggle = ?, admin = ?
      WHERE id = ?;
    `;

    // 데이터베이스 쿼리 실행
    const [result] = await db.query(query, [
      title,
      JSON.stringify(sub),
      validToggle,
      admin,
      id,
    ]);

    res.status(200).json({ message: "Item updated successfully" });
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ error: "Failed to update item" });
  }
});

// 메뉴 순서 변경
router.put("/:category/reorder", async (req, res) => {
  const category = req.params.category;
  const { updatedData } = req.body;

  console.log("Updated Data:", updatedData);

  try {
    const [result] = await db.query(`DELETE FROM ${category}`);

    for (const item of updatedData) {
      console.log(item);
      // 테이블의 각 항목을 ID를 기준으로 업데이트
      const query = `INSERT INTO ${category} ( title, sub, toggle, admin) VALUES ( ?, ?, ?, ?)`;
      const [result] = await db.query(query, [
        item.title,
        JSON.stringify(item.sub),
        item.toggle,
        item.admin,
      ]);
    }

    res.status(200).json({ message: "Menu reordered successfully" });
  } catch (error) {
    console.error("Error reordering menu:", error);
    res.status(500).json({ error: "Failed to reorder menu" });
  }
});

module.exports = router;
