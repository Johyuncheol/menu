import React, { useRef, useEffect } from "react";
import Profile from "../profile/Profile";
import Menu from "../menu/Menu";
import styles from "./aside.module.css";
import {
  deleteMenuAPI,
  updateMenuAPI,
  drageMenuAPI,
} from "../../api/menu";

const Aside = ({ data, path, fetchData }) => {
  const dragItem = useRef(); // 드래그할 아이템의 인덱스
  const dragOverItem = useRef(); // 드랍할 위치의 아이템의 인덱스

  // 삭제 동작 함수
  const deleteData = async (path, id) => {
    await deleteMenuAPI(path, id);
    fetchData();
  };

  // 수정 동작 함수
  const updateData = async (path, updateData) => {
    await updateMenuAPI(path, updateData);
    fetchData();
  };

  // 드래그 순서변경 함수
  const reorderMenu = async (path, updatedData) => {
    await drageMenuAPI(path, updatedData);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [path]);

  // 드래그 시작
  const dragStart = (e, position, menuType) => {
    dragItem.current = { position, menuType };
    console.log(e.target.innerHTML);
  };

  // 드래그해서 포갰을 때
  const dragEnter = (e, position, menuType) => {
    dragOverItem.current = { position, menuType };
    console.log(e.target.innerHTML);
  };

  // 드랍
  const drop = async () => {
    const dragItemIndex = dragItem.current.position;
    const dragOverItemIndex = dragOverItem.current.position;
    const dragItemType = dragItem.current.menuType;
    const dragOverItemType = dragOverItem.current.menuType;

    if (dragItemType === dragOverItemType) {
      const ItemList =
        dragItemType === "adminMenu"
          ? [...data.adminMenu]
          : [...data.generalMenu];

      const dragItemValue = ItemList[dragItemIndex];

      ItemList.splice(dragItemIndex, 1); // 드래그한 아이템을 삭제
      ItemList.splice(dragOverItemIndex, 0, dragItemValue); // 새로운 위치에 아이템 추가

      const newData =
        dragItemType === "adminMenu"
          ? [...ItemList, ...data.generalMenu]
          : [...ItemList, ...data.adminMenu];

      await reorderMenu(path, newData);
    } else {
      const dragItemList =
        dragItemType === "adminMenu"
          ? [...data.adminMenu]
          : [...data.generalMenu];
      const dragOverItemList =
        dragOverItemType === "adminMenu"
          ? [...data.adminMenu]
          : [...data.generalMenu];

      const dragItemValue = dragItemList[dragItemIndex];
      dragItemList.splice(dragItemIndex, 1); // 드래그한 아이템을 삭제

      dragItemValue.admin =
        dragOverItemType === "adminMenu" ? "admin" : "general";
      dragOverItemList.splice(dragOverItemIndex, 0, dragItemValue); // 새로운 위치에 아이템 추가

      const NewDataList =
        dragOverItemType === "adminMenu"
          ? [...dragOverItemList, ...dragItemList]
          : [...dragItemList, ...dragOverItemList];

      await reorderMenu(path, NewDataList);
    }

    dragItem.current = null;
    dragOverItem.current = null;
  };

  return (
    <aside className={styles.aside}>
      <Profile />

      <div className={styles.menuLable}>관리자 메뉴</div>
      {data.adminMenu &&
        data.adminMenu.map((item, idx) => (
          <div
            key={idx}
            draggable
            onDragStart={(e) => dragStart(e, idx, "adminMenu")}
            onDragEnter={(e) => dragEnter(e, idx, "adminMenu")}
            onDragEnd={() => drop()}
            onDragOver={(e) => e.preventDefault()}
          >
            <Menu data={item} deleteFnc={deleteData} updateFnc={updateData} />
          </div>
        ))}

      <div className={styles.menuLable}>일반 메뉴</div>
      {data.generalMenu &&
        data.generalMenu.map((item, idx) => (
          <div
            key={idx}
            draggable
            onDragStart={(e) => dragStart(e, idx, "generalMenu")}
            onDragEnter={(e) => dragEnter(e, idx, "generalMenu")}
            onDragEnd={() => drop()}
            onDragOver={(e) => e.preventDefault()}
          >
            <Menu data={item} deleteFnc={deleteData} updateFnc={updateData} />
          </div>
        ))}
    </aside>
  );
};

export default Aside;
