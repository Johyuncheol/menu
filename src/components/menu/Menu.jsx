import React, { useEffect } from "react";
import { useState, useRef } from "react";
import styles from "./Menu.module.css";
import { useDispatch } from "react-redux";
import { deleteMenu } from "../../redux/reducers/menu";
import { updateMenu } from "../../redux/reducers/menu";
import { useLocation } from "react-router-dom";

const Menu = ({ data, deleteFnc, updateFnc }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [Toggle,setToggle] = useState(data.toggle);
  const [isUpdate, setIsUpdate] = useState(false);
  const [list, setList] = useState(Array.isArray(data.sub) ? data.sub : []);
  console.log(data.sub)
  const [newMenu, setNewMenu] = useState({
    // 추가할 메뉴
    id: data.id,
    title: data.title,
    sub: data.sub,
    toggle: data.toggle,
    admin: data.admin,
  });

  useEffect(() => {
    setList(data.sub);
    setNewMenu({
      // 추가할 메뉴
      id: data.id,
      title: data.title,
      sub: data.sub,
      toggle: data.toggle,
      admin: data.admin,
    });
    setToggle(data.toggle)
  }, [data, location]);

  const ClickToggleHandler = () => {
    setIsOpen(!isOpen);
  };

  const dragItem = useRef(); // 드래그할 아이템의 인덱스
  const dragOverItem = useRef(); // 드랍할 위치의 아이템의 인덱스

  // 드래그 시작될 때 실행
  const dragStart = (e, position) => {
    dragItem.current = position;
    console.log(e.target.innerHTML);
  };

  // 드래그중인 대상이 위로 포개졌을 때
  const dragEnter = (e, position) => {
    dragOverItem.current = position;
    console.log(e.target.innerHTML);
  };

  // 드랍 (커서 뗐을 때)
  const drop = (e) => {
    const newList = [...list];
    const dragItemValue = newList[dragItem.current];
    newList.splice(dragItem.current, 1);
    newList.splice(dragOverItem.current, 0, dragItemValue);
    dragItem.current = null;
    dragOverItem.current = null;
    setList(newList);
  };

  // 삭제 동작 함수
  const deleteClickHandler = () => {
    dispatch(
      deleteMenu(data.admin === "admin" ? "adminMenu" : "generalMenu", data.id)
    );

    deleteFnc(location.pathname, data.id);
  };

  // 수정 동작 함수
  const updateClickHandler = (id) => {
    if (isUpdate) {
      dispatch(
        updateMenu(
          newMenu.admin === "admin" ? "adminMenu" : "generalMenu",
          id,
          newMenu
        )
      );

      updateFnc(location.pathname, newMenu);
    }

    setIsUpdate(!isUpdate);
  };

  const inputChangeHandler = (e, type, index) => {
    if (type === "title") {
      setNewMenu({ ...newMenu, title: e.target.value });
    }
    if (type === "sub") {
      const newSub = [...newMenu.sub];
      newSub[index] = e.target.value;
      setNewMenu({ ...newMenu, sub: newSub });
    }
  };

  return (
    <ul className={`${styles.MenuUl}`}>
      <div className={styles.flex}>
        <li className={styles.MainLi} onClick={() => ClickToggleHandler()}>
          {isUpdate ? (
            <input
              type="text"
              value={newMenu.title}
              onChange={(e) => inputChangeHandler(e, "title", 0)}
            />
          ) : (
            <span> {data.title}</span>
          )}

          {Boolean(Toggle) && (
            <span
              className={` ${isOpen ? styles.icon_close : styles.icon_open}`}
            >
              &lt;
            </span>
          )}
        </li>

        <div className={styles.options}>
          <button onClick={() => updateClickHandler(data.id)}>
            {isUpdate ? "완료" : "수정"}
          </button>
          <button onClick={() => deleteClickHandler()}>삭제</button>
        </div>
      </div>
      {Boolean(Toggle) && isOpen && list.length !==0 && (
        <>
          {list.map((item, index) => {
            return (
              <div key={index}>
                {isUpdate ? (
                  <input
                    type="text"
                    value={newMenu.sub[index]}
                    onChange={(e) => inputChangeHandler(e, "sub", index)}
                  />
                ) : (
                  <li
                    className={styles.sub}
                    key={index}
                    draggable
                    onDragStart={(e) => dragStart(e, index)}
                    onDragEnter={(e) => dragEnter(e, index)}
                    onDragEnd={drop}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    {item}
                  </li>
                )}
              </div>
            );
          })}
        </>
      )}
    </ul>
  );
};

export default Menu;
