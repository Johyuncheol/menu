import React from "react";
import { useState } from "react";
import styles from "./Menu.module.css";

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [Toggle, setToggle] = useState(true);

  const ClickToggleHandler = () => {
    setIsOpen(!isOpen);
  };

  return (
    <ul className={`${styles.MenuUl}`}>
      <li className={styles.EndEnd} onClick={() => ClickToggleHandler()}>
        <span> 첫 제목</span>
        <span>{Toggle ? (isOpen ? "v" : "<") : ""}</span>
      </li>
      {Toggle && isOpen && (
        <>
          <li className={styles.sub}>하위 제목</li>
          <li>하위 제목</li>
          <li>하위 제목</li>
          <li>하위 제목</li>
          <li>하위 제목</li>
          <li>하위 제목</li>
          <li>하위 제목</li>
        </>
      )}
    </ul>
  );
};

export default Menu;
