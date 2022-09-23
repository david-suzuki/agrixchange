import React, { useEffect, useState } from "react";
import NavBar from "./common/navbar";
import TopBar from "./common/topbar";
import TopMenu from "./seller/topmenu";
import { Media, Container, Row, Col } from "reactstrap";
import LogoImage from "./common/logo";
import SearchHeader from "./seller/searchHeader";
import SearchOverlay from "../modals/SearchOverlayModal";

const Header = ({ logoName, headerClass, role }) => {
  const [searchModalShow, setSearchModalShow] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    setTimeout(function () {
      document.querySelectorAll(".loader-wrapper").style = "display:none";
    }, 2000);
  }, []);

  const openSearch = () => {
    document.getElementById("search-overlay").style.display = "block";
  };

  const onSearched = (searchText) => {
    setSearchText(searchText);
    setSearchModalShow(true);
  };

  return (
    <div className="page-main-header">
      <header id="sticky" className={`${headerClass}`}>
        <div className="mobile-fix-option"></div>
        <div className="mx-4 mt-3">
          {role === "free" ? (
            <TopBar />
          ) : (
            <TopMenu topClass="top-header" role={role} />
          )}
        </div>
        <Container>
          <Row>
            <Col xs={12} md={12}>
              <div className="main-menu border-section border-top-0 border-bottom-0">
                <div className="menu-left">
                  <div className="navbar">
                    <LogoImage logo={logoName} />
                  </div>
                </div>
                <div className="main-nav-center">
                  <NavBar />
                </div>
                <div className="menu-right pull-right">
                  <div>
                    <div className="icon-nav">
                      <ul className="nav-menus open">
                        <li className="onhover-div">
                          <SearchHeader onSearch={onSearched} />
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </header>
      <SearchOverlay
        isShow={searchModalShow}
        onToggle={() => setSearchModalShow(!searchModalShow)}
        searchText={searchText}
      />
    </div>
  );
};

export default Header;
