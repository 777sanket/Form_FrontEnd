import ShareBtn from "../ShareBtn/ShareBtn";
import ThemeChanger from "../ThemeChanger/ThemeChanger";
import styles from "./navBar.module.css";
import Menu from "../Menu/Menu";
// import { Link } from 'react-router-dom'

export default function Navbar({
  openModal,
  isModalOpen,
  currentFolder,
  setCurrentFolder,
  setHighlightedFolder,
  sharedDashboards,
  switchDashboard,
  currentDashboardOwner,
}) {
  // if (location.pathname === "/workspace") {
  //   return null;
  // }
  return (
    <div className={styles.navbarContainer}>
      {/* <Link to="/workspace" className={styles.navbarLogo}>WorkSpace</Link> */}
      <div className={styles.Menu_Tab}>
        <Menu
          currentFolder={currentFolder}
          setCurrentFolder={setCurrentFolder}
          setHighlightedFolder={setHighlightedFolder}
          sharedDashboards={sharedDashboards}
          switchDashboard={switchDashboard}
          currentDashboardOwner={currentDashboardOwner}
        />
      </div>

      <div className={styles.Theme_Changer}>
        <ThemeChanger />
      </div>

      <div className={styles.Share_Btn}>
        <ShareBtn openModal={openModal} isDisabled={isModalOpen} />
      </div>
    </div>
  );
}
