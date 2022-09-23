import React, { Fragment, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SELLERMENUITEMS } from "../../constant/menu";
import { BUYERMENUITEMS } from "../../constant/menu";
import { HelpCircle } from "react-feather";
import UserPermission from "../../modals/UserPermission";
import { AuthContext } from "../../../helpers/auth/AuthContext";

const Sidebar = ({ role, display }) => {
  const router = useRouter();
  let mainMenuItems = SELLERMENUITEMS;

  const authContext = useContext(AuthContext);
  const user = authContext.user;

  if (role == "buyer") mainMenuItems = BUYERMENUITEMS;

  const [mainmenu, setMainMenu] = useState(mainMenuItems);

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const currentUrl = window.location.pathname;
    mainmenu.map((items) => {
      mainMenu.filter((Items) => {
        if (Items.path === currentUrl) setNavActive(Items);
        if (!Items.children) return false;
        Items.children.filter((subItems) => {
          if (subItems.path === currentUrl) setNavActive(subItems);
          if (!subItems.children) return false;
          subItems.children.filter((subSubItems) => {
            if (subSubItems.path === currentUrl) {
              setNavActive(subSubItems);
              return true;
            } else {
              return false;
            }
          });
          return subItems;
        });
        return Items;
      });
      return items;
    });
    return () => {
      setMainMenu(mainMenuItems);
    };
  });

  const setNavActive = (item) => {
    mainMenuItems.filter((menuItem) => {
      if (menuItem !== item) menuItem.active = false;
      if (menuItem.children && menuItem.children.includes(item))
        menuItem.active = true;
      if (menuItem.children) {
        menuItem.children.filter((submenuItems) => {
          if (submenuItems !== item) {
            submenuItems.active = false;
          }
          if (submenuItems.children) {
            submenuItems.children.map(
              (childItem) => (childItem.active = false)
            );
            if (submenuItems.children.includes(item)) {
              submenuItems.active = true;
              menuItem.active = true;
            }
          }
          return false;
        });
      }
      return false;
    });
    item.active = !item.active;
    setMainMenu(mainMenuItems);
  };

  const onMenuItemClicked = (item) => {
    setNavActive(item);
    if (item.title === "Buyer Report") {
      // if user's membership is blue plan
      if (user.membershipISbb_agrix_membership_typesID === "3") {
        setMessage(
          "This page is only for Platinum, Diamond and Gold Users, please upgrade your subscription to view."
        );
        setShowRoleModal(!showRoleModal);
      } else router.push(item.path);
    } else if (item.title === "My Reports") {
      // if user's membership is blue plan and gold plan
      if (
        user.membershipISbb_agrix_membership_typesID === "2" ||
        user.membershipISbb_agrix_membership_typesID === "3"
      ) {
        setMessage(
          "Your membership does not allow you to view this feature. Please upgrade to continue"
        );
        setShowRoleModal(!showRoleModal);
      } else router.push(item.path);
    } else {
      router.push(item.path);
    }
  };

  const mainMenu = mainmenu.map((menuItem, i) => (
    <li className={`${menuItem.active ? "active" : ""}`} key={i}>
      {menuItem.sidebartitle ? (
        <div className="sidebar-title">{menuItem.sidebartitle}</div>
      ) : (
        ""
      )}
      {menuItem.type === "sub" ? (
        <a
          className="sidebar-header linkCursor"
          href="#javaScript"
          onClick={() => setNavActive(menuItem)}
        >
          <menuItem.icon />
          <span>{menuItem.title}</span>
          <i className="fa fa-angle-right pull-right"></i>
        </a>
      ) : (
        ""
      )}
      {menuItem.type === "link" ? (
        <a
          className={`sidebar-header linkCursor ${
            menuItem.active ? "active" : ""
          }`}
          onClick={() => onMenuItemClicked(menuItem)}
        >
          <menuItem.icon />
          <span>{menuItem.title}</span>
          {menuItem.children ? (
            <i className="fa fa-angle-right pull-right"></i>
          ) : (
            ""
          )}
        </a>
      ) : (
        ""
      )}
      {menuItem.children ? (
        <ul
          className={`sidebar-submenu ${menuItem.active ? "menu-open" : ""}`}
          style={
            menuItem.active
              ? { opacity: 1, transition: "opacity 500ms ease-in" }
              : {}
          }
        >
          {menuItem.children.map((childrenItem, index) => (
            <li
              key={index}
              className={
                childrenItem.children
                  ? childrenItem.active
                    ? "active"
                    : ""
                  : ""
              }
            >
              {childrenItem.type === "sub" ? (
                <a
                  href="#javaScript"
                  onClick={() => setNavActive(childrenItem)}
                >
                  <i className="fa fa-circle"></i>
                  {childrenItem.title}{" "}
                  <i className="fa fa-angle-right pull-right"></i>
                </a>
              ) : (
                ""
              )}

              {childrenItem.type === "link" ? (
                <a
                  to={`${process.env.PUBLIC_URL}${childrenItem.path}`}
                  className={`${
                    childrenItem.active ? "active" : ""
                  } linkCursor`}
                  onClick={() => setNavActive(childrenItem)}
                >
                  <i className="fa fa-circle"></i>
                  {childrenItem.title}{" "}
                </a>
              ) : (
                ""
              )}
              {childrenItem.children ? (
                <ul
                  className={`sidebar-submenu ${
                    childrenItem.active ? "menu-open" : "active"
                  }`}
                >
                  {childrenItem.children.map((childrenSubItem, key) => (
                    <li
                      className={childrenSubItem.active ? "active" : ""}
                      key={key}
                    >
                      {childrenSubItem.type === "link" ? (
                        <a
                          to={`${process.env.PUBLIC_URL}${childrenSubItem.path}`}
                          className={childrenSubItem.active ? "active" : ""}
                          onClick={() => setNavActive(childrenSubItem)}
                        >
                          <i className="fa fa-circle"></i>
                          {childrenSubItem.title}
                        </a>
                      ) : (
                        ""
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                ""
              )}
            </li>
          ))}
        </ul>
      ) : (
        ""
      )}
    </li>
  ));

  return (
    <Fragment>
      <div className={display ? "page-sidebar" : "page-sidebar open"}>
        <div className="sidebar custom-scrollbar">
          <ul className="sidebar-menu">{mainMenu}</ul>
          <ul className="sidebar-menu">
            <li>
              <a className="sidebar-header linkCursor" href="/seller">
                <HelpCircle />
                Support
              </a>
            </li>
          </ul>
        </div>
      </div>
      <UserPermission
        modal={showRoleModal}
        onToggle={(showRoleModal) => setShowRoleModal(!showRoleModal)}
        message={message}
        isBack={true}
      />
    </Fragment>
  );
};

export default Sidebar;
