import React, { useContext } from "react";
import Slider from "react-slick";
import { Slider3 } from "../../../../services/script";
import { Media, Container, Row, Col } from "reactstrap";
import { AuthContext } from "../../../../helpers/auth/AuthContext";
import getConfig from 'next/config';
import { useRouter } from "next/router";

const { publicRuntimeConfig } = getConfig();
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`;

const AdSpaceSmall = ({ caption, description, sectionClass, planAdverts, rowNum }) => {
  const router = useRouter()

  const authContext = useContext(AuthContext)
  const isAuth = authContext.isAuthenticated
  const onAuthModalsTriggered = authContext.onAuthModalsTriggered
  const onTarget = authContext.onTarget

  const onAdClicked= (advert) => {
    if (!isAuth) {
      onTarget(`/seller/detail/${advert.userISbb_agrix_usersID}`)
      onAuthModalsTriggered("login")
      return
    }
    router.push(`/seller/detail/${advert.userISbb_agrix_usersID}`)
  }

  return (
    <section className={sectionClass}>
      <h4 className="section-title">{caption} {description}</h4>
      {
        planAdverts.length < 4 ?
        <Row>
          {planAdverts.map(advert => (
            <Col md="4" key={advert._id}>
              <a className="linkCursor" onClick={()=>onPremiumAdClicked(advert)}>
                <div className="classic-effect d-flex justify-content-center">
                  <Media 
                    src={contentsUrl + advert.advert_image01ISfile} 
                    className="img-fluid-ads" 
                    alt="" 
                    height="220px"
                    width="280px"
                    style={{ objectFit: "cover" }} 
                  />
                  <span></span>
                </div>
              </a>
            </Col>
          ))}
        </Row> :
        <Slider {...Slider3} className="slide-3">
          {planAdverts.map(advert => (
              <Col md="12" key={advert._id}>
                <a className="linkCursor" onClick={()=>onAdClicked(advert)}>
                  <div className="classic-effect">
                    <Media 
                      src={contentsUrl + advert.advert_image01ISfile} 
                      className="img-fluid-ads" 
                      height="220px"
                      width="280px"  
                      style={{ objectFit: "cover" }}
                    />
                    <span></span>
                  </div>
                </a>
              </Col>
          ))}
        </Slider>
      }
      
    </section>
  );
};
export default AdSpaceSmall;
