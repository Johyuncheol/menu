import React, { useState, useRef, useEffect } from "react";
import Profile from "../profile/Profile";
import Menu from "../menu/Menu";
import styles from "./aside.module.css";
import { useSelector, useDispatch } from "react-redux";
import { drageMenu } from "../../redux/reducers/menu";
import {
  fetchMenuAPI,
  deleteMenuAPI,
  updateMenuAPI,
  drageMenuAPI,
} from "../../api/menu";

const Aside = (path) => {
  const dragItem = useRef(); // 드래그할 아이템의 인덱스
  const dragOverItem = useRef(); // 드랍할 위치의 아이템의 인덱스
  const dispatch = useDispatch();
  /*   const { adminMenu, generalMenu } = useSelector((state) => state.menu); */

  const [menuData, setMenuData] = useState({});

  const fetchData = async () => {
    if (!path.path) return;
    const res = await fetchMenuAPI(path.path);

    if (res) {
      setMenuData(res);
    }
  };

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

  //드래그 순서변경 함수
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
  const drop = async() => {
    const dragItemIndex = dragItem.current.position;
    const dragOverItemIndex = dragOverItem.current.position;
    const dragItemType = dragItem.current.menuType;
    const dragOverItemType = dragOverItem.current.menuType;

    // 같은 메뉴 카테고리에서 이동시
    if (dragItemType === dragOverItemType) {
      const ItemList =
        dragItemType === "adminMenu"
          ? [...menuData.adminMenu]
          : [...menuData.generalMenu];

      const dragItemValue = ItemList[dragItemIndex];

      ItemList.splice(dragItemIndex, 1); // 드래그한 아이템을 삭제
      ItemList.splice(dragOverItemIndex, 0, dragItemValue); // 새로운 위치에 아이템 추가
     
      await reorderMenu(path.path, ItemList);

      dispatch(drageMenu(dragItemType, ItemList));
    } else {
      // 다른 카테고리로 이동시
      const dragItemList =
        dragItemType === "adminMenu"
          ? [...menuData.adminMenu]
          : [...menuData.generalMenu];
      const dragOverItemList =
        dragOverItemType === "adminMenu"
          ? [...menuData.adminMenu]
          : [...menuData.generalMenu];

      const dragItemValue = dragItemList[dragItemIndex];

      dragItemList.splice(dragItemIndex, 1); // 드래그한 아이템을 삭제
      dragOverItemList.splice(dragOverItemIndex, 0, dragItemValue); // 새로운 위치에 아이템 추가

      if (dragOverItemType === "adminMenu") {
        dispatch(drageMenu("adminMenu", dragOverItemList));
        dispatch(drageMenu("generalMenu", dragItemList));


        await reorderMenu(path.path, dragOverItemList);
        await reorderMenu(path.path, dragItemList);


      } else if (dragOverItemType === "generalMenu") {
        dispatch(drageMenu("adminMenu", dragItemList));
        dispatch(drageMenu("generalMenu", dragOverItemList));

        await reorderMenu(path.path, dragItemList);
        await reorderMenu(path.path, dragOverItemList);
      }
    }

    dragItem.current = null;
    dragOverItem.current = null;
  };

  return (
    <aside className={styles.aside}>
      <Profile />

      <div className={styles.menuLable}>관리자 메뉴</div>
      {menuData.adminMenu &&
        menuData.adminMenu.map((item, idx) => (
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
      {menuData.generalMenu &&
        menuData.generalMenu.map((item, idx) => (
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
