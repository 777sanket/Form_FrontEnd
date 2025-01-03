import Logo from "../../components/logo/Logo";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./homePage.module.css";
import homeSemiCircle from "../../assets/homeSemiCircle.png";
import homeTriangle from "../../assets/homeTriangle.png";
import leftCircle from "../../assets/leftCircle.png";
import rightCircle from "../../assets/rightCircle.png";
import Container from "../../assets/Container.png";
import hyperlink from "../../assets/hyperLink.png";
export default function HomePage() {
  return (
    <>
      <div className={styles.home}>
        <div className={styles.navbar}>
          <div className={styles.logo}>
            <Logo />
          </div>
          <div className={styles.navLinks}>
            <div className={styles.signInn}>
              <Link to="/login">Sign In</Link>
            </div>
            <div className={styles.createBot1}>
              <Link to="/login">Creat a FormBot</Link>
            </div>
          </div>
        </div>

        <div className={styles.main}>
          <div className={styles.leftImg}>
            <img src={homeTriangle} alt="" />
          </div>
          <div className={styles.content}>
            <div className={styles.topContent}>
              Build advanced chatbots visually
            </div>
            <div className={styles.bottomContent}>
              Typebot gives you powerful blocks to create unique chat
              experiences. Embed them anywhere on your web/mobile apps and start
              collecting results like magic.
            </div>
            <Link to="/login">
              <button>Create a FormBot for free</button>
            </Link>
          </div>
          <div className={styles.rightImg}>
            <img src={homeSemiCircle} alt="" />
          </div>
        </div>

        <div className={styles.imgContainer}>
          <div className={styles.leftCircle}>
            <img src={leftCircle} alt="" />
          </div>
          <div className={styles.rightCircle}>
            <img src={rightCircle} alt="" />
          </div>
          <div className={styles.mainImg}>
            <img src={Container} alt="" />
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.container}>
            <div className={styles.div1}>
              <Logo />
            </div>
            <div className={styles.div2}> Product</div>
            <div className={styles.div3}> Community</div>
            <div className={styles.div4}> Company</div>
            <div className={styles.div5}>
              Made with ❤️ by
              <div className={styles.cuvetteLink}> @cuvette </div>
            </div>
            <div className={styles.div6}>
              <span className={styles.gridItem}>
                Status <img src={hyperlink} alt="status icon" />
              </span>
            </div>
            <div className={styles.div7}>
              <span className={styles.gridItem}>
                Documentation <img src={hyperlink} alt="status icon" />
              </span>
            </div>
            <div className={styles.div8}>
              <span className={styles.gridItem}>
                Roadmap <img src={hyperlink} alt="status icon" />
              </span>
            </div>
            <div className={styles.div9}>
              <span className={styles.gridItem}>
                Pricing <img src={hyperlink} alt="status icon" />
              </span>
            </div>
            <div className={styles.div10}>
              <span className={styles.gridItem}>
                Discord <img src={hyperlink} alt="status icon" />
              </span>
            </div>
            <div className={styles.div11}>
              <span className={styles.gridItem}>
                GitHub Repository <img src={hyperlink} alt="status icon" />
              </span>
            </div>
            <div className={styles.div12}>
              <span className={styles.gridItem}>
                Twitter <img src={hyperlink} alt="status icon" />
              </span>
            </div>
            <div className={styles.div13}>
              <span className={styles.gridItem}>
                LinkedIn <img src={hyperlink} alt="status icon" />
              </span>
            </div>
            <div className={styles.div14}>
              <span className={styles.gridItem}>
                OSS Friends <img src={hyperlink} alt="status icon" />
              </span>
            </div>
            <div className={styles.div15}>
              <span className={styles.gridItem}>
                About <img src={hyperlink} alt="status icon" />
              </span>
            </div>
            <div className={styles.div16}>
              <span className={styles.gridItem}>
                Contact <img src={hyperlink} alt="status icon" />
              </span>
            </div>
            <div className={styles.div17}>
              <span className={styles.gridItem}>
                Terms of service <img src={hyperlink} alt="status icon" />
              </span>
            </div>
            <div className={styles.div18}>
              <span className={styles.gridItem}>
                Privacy Policy <img src={hyperlink} alt="status icon" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
