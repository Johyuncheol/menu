import React, { useEffect, useRef, useState } from "react";
import styles from "./Add.module.css";
import { useDispatch } from "react-redux";
import { addMenu } from "../../redux/reducers/menu";
import { addMenuAPI } from "../../api/menu";
import { useLocation } from "react-router-dom";

const AddForm = ({ path, fetchData }) => {
  const [sub, setSub] = useState(false); // 하위메뉴 여부
  const [newMenu, setNewMenu] = useState({
    title: "",
    sub: [""],
    toggle: false,
    admin: "admin",
  });
  const location = useLocation();
  const adminState = useRef();

  useEffect(() => {
    adminState.current = "admin";
  }, []);

  const dispatch = useDispatch();

  const handleSubInputChange = (index, value) => {
    const newSubInputs = [...newMenu.sub];
    newSubInputs[index] = value;
    setNewMenu({ ...newMenu, sub: newSubInputs });
  };

  const addSubInputHandler = () => {
    setNewMenu({ ...newMenu, sub: [...newMenu.sub, ""] });
  };

  const handleTitleChange = (e) => {
    setNewMenu({ ...newMenu, title: e.target.value });
  };

  const handleAdminChange = (e) => {
    adminState.current = e.target.value;
    setNewMenu({ ...newMenu, admin: e.target.value });
  };

  const handleToggleChange = (e) => {
    const toggleValue = e.target.value === "true";
    setSub(toggleValue);
    setNewMenu({
      ...newMenu,
      toggle: toggleValue,
    });
  };

  const saveMenu = async(e) => {
    e.preventDefault();

    if (newMenu.title === "") return alert("메뉴제목을 입력해주세요");
    const subNull = newMenu.sub.findIndex((item) => item === "");
    if (newMenu.toggle === true && (newMenu.sub.length === 0 || !subNull))
      return alert("하위 메뉴를 입력해주세요");

    if (adminState.current === "admin") {
      dispatch(addMenu("adminMenu", newMenu));
    } else {
      dispatch(addMenu("generalMenu", newMenu));
    }

    await addMenuAPI(location.pathname, newMenu);
    await fetchData();

    setNewMenu({
      title: "",
      sub: [""],
      toggle: newMenu.toggle,
      admin: adminState.current,
    });
  };

  return (
    <form className={styles.addForm} onSubmit={saveMenu}>
      <span>메뉴 추가</span>

      <div>
        <label htmlFor="authType">메뉴 타입: </label>
        <select
          onChange={handleAdminChange}
          value={newMenu.admin}
          id="authType"
        >
          <option value="admin">관리자 메뉴</option>
          <option value="general">일반 메뉴</option>
        </select>
      </div>

      <div>
        <label htmlFor="menuName">메뉴 이름: </label>
        <input
          type="text"
          placeholder="메뉴 이름"
          value={newMenu.title}
          onChange={handleTitleChange}
          id="menuName"
        />
      </div>

      <div>
        <label htmlFor="menuType">토글 타입: </label>
        <select onChange={handleToggleChange} value={newMenu.toggle}>
          <option value={false}>토글(하위메뉴)없음</option>
          <option value={true}>토글(하위메뉴)있음</option>
        </select>
      </div>

      {sub && (
        <>
          {newMenu.sub.map((input, index) => (
            <div key={index} className={styles.subInputContainer}>
              <input
                type="text"
                placeholder="하위 메뉴 이름"
                value={input}
                onChange={(e) => handleSubInputChange(index, e.target.value)}
              />
            </div>
          ))}
          <button type="button" onClick={addSubInputHandler}>
            +
          </button>
        </>
      )}
      <button type="submit">저장하기</button>
    </form>
  );
};

export default AddForm;
