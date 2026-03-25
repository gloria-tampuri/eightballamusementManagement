import React from "react";
import Login from "../../components/Login/Login";
import styles from "../styles/loginPage.module.css";

export default function LoginPage() {
  return (
    <div className={styles.loginPageContainer}>
      <div className={styles.loginContent}>
        <div className={styles.loginHeader}>
          <h1>🎱 Eight Ball Amusement</h1>
          <p>Administrative Dashboard</p>
        </div>
        <Login />
        <div className={styles.loginFooter}>
          <p>© 2026 Eight Ball Amusement. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
