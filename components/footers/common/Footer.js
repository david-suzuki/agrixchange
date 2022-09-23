import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Button,
  Collapse,
} from "reactstrap";
import LogoImage from "../../headers/common/logo";

const MasterFooter = ({footerClass}) => {
  const [isOpen, setIsOpen] = useState();
  const [collapse, setCollapse] = useState(0);
  const width = window.innerWidth < 750;
  useEffect(() => {
    const changeCollapse = () => {
      if (window.innerWidth < 750) {
        setCollapse(0);
        setIsOpen(false);
      } else setIsOpen(true);
    };

    window.addEventListener("resize", changeCollapse);

    return () => {
      window.removeEventListener('resize', changeCollapse)
    }

  }, []);
  return (
    <div>
      <footer>
        <section className={footerClass}>
          <Container fluid="">
            <div className="main-footer text-center">
              <div className="footer-contant">
                <ul>
                  <li>
                    <Link href={`/privacy`}>
                      <a>Privacy Policy</a>
                    </Link>
                  </li>
                  <li>
                    <Link href={`/terms`}>
                      <a>Terms of Use</a>
                    </Link>
                  </li>
                  <li>
                    <Link href={`/contact`}>
                      <a>Contact</a>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="footer-end">
                <p><i className="fa fa-copyright" aria-hidden="true"></i> 2021 Agrixchange. All Rights Reserved <small>(V1.35)</small></p>
              </div>
              <div className="footer-social">
                <ul>
                  <li>
                    <a href="https://www.facebook.com" target="_blank">
                      <i
                          className="fa fa-facebook-square"
                          aria-hidden="true"
                      ></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://twitter.com" target="_blank">
                      <i className="fa fa-twitter" aria-hidden="true"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.instagram.com" target="_blank">
                      <i
                          className="fa fa-linkedin-square"
                          aria-hidden="true"
                      ></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </Container>
        </section>
      </footer>
    </div>
  );
};
export default MasterFooter;
