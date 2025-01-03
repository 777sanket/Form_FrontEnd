import poly from '../../assets/poly.png';
import elip1 from '../../assets/Ellipse1.png';
import elip2 from '../../assets/Ellipse2.png';
import arrow from '../../assets/arrow_back.png';
import { Link } from 'react-router-dom';
import styles from './bg.module.css';


export default function bg() {

  return (
    <div  className={styles.bg}>
      <div className={styles.back_Arrow}> 
        <Link to="/">
          <img src={arrow} alt="" />
        </Link>
      </div>
      <div className={styles.polygon}>
        <img src={poly} alt="" />
      </div>
      <div className={styles.ellipse1}>
        <img src={elip1} alt="" />
      </div>
      <div className={styles.ellipse2}>
        <img src={elip2} alt="" />
      </div>
    </div>
  )
}
