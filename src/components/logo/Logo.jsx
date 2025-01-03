import styles from './Logo.module.css';
import logo from '../../assets/logo.png';

export default function Logo() {
  return (
    <div className={styles.logo}>
      <div className={styles.logoImg}>
        <img src={logo} alt="" />
      </div>
      <div className={styles.logoText}>
        FormBot
      </div>
    </div>
  )
}
