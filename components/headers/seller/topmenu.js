import React, { Fragment, useEffect, useState } from "react";
import SearchHeader from "./searchHeader";
import UserMenu from "./usermenu";
import Notification from "../../../pages/layouts/Agri/components/modals/NotificationModal";
import { AlignLeft, Bell, MessageSquare, MoreHorizontal } from "react-feather";

const TopMenu = ({ role }) => {
  useEffect(() => {
    setTimeout(function () {
      document.querySelectorAll(".loader-wrapper").style = "display:none";
    }, 2000);
  }, []);

  const [sidebar, setSidebar] = useState(false);
  const [rightSidebar, setRightSidebar] = useState(true);
  const [navMenus, setNavMenus] = useState(false);

  const [showNotificationModal, setNotificationModal] = useState(false);
  const notifications = () => setNotificationModal(!showNotificationModal);

  const openNav = () => {
    var openmyslide = document.getElementById("mySidenav");
    if (openmyslide) {
      openmyslide.classList.add("open-side");
    }
  };
  const openSearch = () => {
    document.getElementById("search-overlay").style.display = "block";
  };

  const toggle = () => {
    setNavMenus((prevState) => ({
      navMenus: !prevState.navMenus,
    }));

    if (navMenus.navMenus) {
      console.log("TRUE=", navMenus);
      document.querySelector(".nav-menus").classList.remove("hide");
      document.querySelector(".nav-menus").classList.add("open");
    } else {
      console.log("FALSE=", navMenus);
      document.querySelector(".nav-menus").classList.remove("open");
      document.querySelector(".nav-menus").classList.add("hide");
    }
  };

  const showRightSidebar = () => {
    if (rightSidebar) {
      setRightSidebar(false);
      document.querySelector(".right-sidebar").classList.add("show");
    } else {
      setRightSidebar(true);
      document.querySelector(".right-sidebar").classList.remove("show");
    }
  };

  const openCloseSidebar = (e) => {
    e.preventDefault();
    if (sidebar) {
      setSidebar(false);
      document.querySelector(".page-main-header").classList.add("open");
      document.querySelector(".page-sidebar").classList.add("open");
    } else {
      setSidebar(true);
      document.querySelector(".page-main-header").classList.remove("open");
      document.querySelector(".page-sidebar").classList.remove("open");
    }
  };

  return (
    <Fragment>
      {/* open */}
      <div className=" ">
        <div className="main-header-right row">
          <div className="main-header-left d-lg-none">
            <div className="logo-wrapper">
              <a href="index.html"></a>
            </div>
          </div>
          <div className="mobile-sidebar">
            <div className="media-body text-right switch-sm">
              <label className="switch">
                <a onClick={openCloseSidebar} style={{ cursor: "pointer" }}>
                  <AlignLeft />
                </a>
              </label>
            </div>
          </div>
          <div className="nav-right col">
            <ul className={"nav-menus " + (navMenus ? "open" : "hide")}>
              <li>
                <a className="linkCursor" onClick={showRightSidebar}>
                  <MessageSquare />
                  <span className="dot"></span>
                </a>
              </li>
              <li className="onhover-dropdown">
                <a className="linkCursor" onClick={notifications}>
                  <Bell />
                  <span className="badge badge-pill badge-primary pull-right notification-badge">
                    3
                  </span>
                  <span className="dot"></span>
                </a>
              </li>
              <UserMenu role={role} />
            </ul>
            <div
              className="d-lg-none mobile-toggle"
              onClick={() => toggle()}
              style={{ marginLeft: 120, marginTop: 20 }}
            >
              <MoreHorizontal />
            </div>
          </div>
        </div>
      </div>
      <Notification modal={showNotificationModal} toggle={notifications} />
    </Fragment>
  );
};

export default TopMenu;
