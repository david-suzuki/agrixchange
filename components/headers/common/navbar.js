import React, { useState, useEffect, useContext } from "react";
import { MENUITEMS } from "../../constant/menu";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { AuthContext } from "../../../helpers/auth/AuthContext";
import ProduceModal from "../../modals/ProduceModal";

const NavBar = () => {
  const { t } = useTranslation();

  const authContext = useContext(AuthContext);
  const onAuthModalsTriggered = authContext.onAuthModalsTriggered;
  const isAuthenticated = authContext.isAuthenticated;
  const user = authContext.user;
  const onTarget = authContext.onTarget

  const [navClose, setNavClose] = useState({ right: "0px" });
  const [isProduceModal, setIsProduceModal] = useState(false)
  const router = useRouter();

  useEffect(() => {
    if (window.innerWidth < 750) {
      setNavClose({ right: "-410px" });
    }
    if (window.innerWidth < 1199) {
      setNavClose({ right: "-300px" });
    }
  }, []);

  const openNav = () => {
    setNavClose({ right: "0px" });
  };

  const closeNav = () => {
    setNavClose({ right: "-410px" });
  };
  // eslint-disable-next-line

  const [activeNavIndex, setActiveNavIndex] = useState(0)

  useEffect(() => {
    let currentPath = router.asPath;
    MENUITEMS.find((item, index) => {
      if (item.path && item.path === currentPath) {
        setActiveNavIndex(index)
      }
    })
  }, []);

  const openMblNav = (menu) => {
    if ( menu.title === "MEMBERSHIP PLANS" ) {
      if (isAuthenticated) {
        if (user.role === "seller") {
          router.push({
            pathname: '/seller/account',
            query: { active: "plan" },
          })
        } else if (user.role === "buyer") {
          router.push({
            pathname: '/buyer/account',
            query: { active: "plan" },
          })
        }
      } else {
        onTarget({
          pathname: '/account',
          query: { active: "plan" },
        })
        onAuthModalsTriggered("user_type")
      }
    } else if ( menu.title === "PRODUCE" ) {
      setIsProduceModal(true)
    } else if ( menu.title === "REPORTS" ) {
      if (!isAuthenticated) {
        onTarget(menu.path)
        onAuthModalsTriggered("login")
      }
      else {
        router.push(menu.path)
      }
    } else {
      router.push(menu.path)
    }
  };

  return (
      <div className="main-navbar">
        <div id="mainnav">
          <div className="toggle-nav" onClick={openNav.bind(this)}>
            <i className="fa fa-bars sidebar-bar"></i>
          </div>
          <ul className="nav-menu" style={navClose}>
            <li className="back-btn" onClick={closeNav.bind(this)}>
              <div className="mobile-back text-right">
                <span>Back navbar</span>
                <i className="fa fa-angle-right pl-2" aria-hidden="true"></i>
              </div>
            </li>
            {MENUITEMS.map((menuItem, i) => {
              return (
                <li
                  key={i}
                >
                  <a className={`nav-link ${i === activeNavIndex ? "active" : ""}`} onClick={() => openMblNav(menuItem)}>
                    {" "}
                    {t(menuItem.title)}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <ProduceModal 
          isShow={isProduceModal}
          onToggle={(val)=>setIsProduceModal(val)}
        />
      </div>
  );
};

export default NavBar;
