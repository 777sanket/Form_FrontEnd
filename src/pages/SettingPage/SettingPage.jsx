import styles from "./SettingPage.module.css";
import LogoutImg from "../../assets/Logout.png";

export default function SettingPage() {
  return (
    <div className={styles.settingPageContainer}>
      <div className={styles.formContainer}>
        <div className={styles.textHead}>Settings</div>
        <form action="">
          <input type="text" className={styles.inpName} placeholder="Name" />
          <input
            type="text"
            className={styles.inpName2}
            placeholder="Update Email"
          />
          <input
            type="text"
            className={styles.inpName2}
            placeholder="Old Password"
          />
          <input
            type="text"
            className={styles.inpName2}
            placeholder="New Password"
          />
          <button className={styles.saveBtn}>Update</button>
        </form>
      </div>
      <div className={styles.logoutContainer}>
        <img src={LogoutImg} alt="logout" />
        <span>Log out</span>
      </div>
    </div>
  );
}
