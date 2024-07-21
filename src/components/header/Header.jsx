import React from "react";
import styles from "./Header.module.css";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate= useNavigate();
  return (
    <header className={styles.header}>
      <div className={styles.title}>Consult</div>
      <nav className={styles.nav}>
        <ul>
          <li>
            <button onClick={()=>navigate("/ad")}>광고</button>
          </li>
          <li>
            <button onClick={()=>navigate("/cs")}>cs</button>
          </li>
          <li>
            <button onClick={()=>navigate("/admin")}>어드민</button>
          </li>
          <li>
            <button onClick={()=>navigate("/management")}>경영</button>
          </li>
          <li>
            <button onClick={()=>navigate("/fnb")}>F&d</button>
          </li>
          <li>
            <button onClick={()=>navigate("/tf")}>TF</button>
          </li>
          <li>
            <button onClick={()=>navigate("/convention")}>협약</button>
          </li>
          <li>
            <button onClick={()=>navigate("/ezdent")}>이지덴트</button>
          </li>
          <li>
            <button onClick={()=>navigate("/hospital")}>병원</button>
          </li>
        </ul>
      </nav>
      <div>로그아웃</div>
    </header>
  );
};

export default Header;
