import React from "react";
import styles from "./Profile.module.css";

const Profile = () => {
  return (
    <section className={styles.profile}>
      <div className={styles.circle} />

      <div className={styles.userInfo}>
        <span>이름 직무</span>
        <span>로그인 중입니다</span>
      </div>
    </section>
  );
};

export default Profile;
