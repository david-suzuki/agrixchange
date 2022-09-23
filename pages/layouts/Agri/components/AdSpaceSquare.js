import React, { useContext, Fragment } from "react";
import Slider from "react-slick";
import { Row, Col, Media } from "reactstrap";
import { Slider3 } from "../../../../services/script";
import { AuthContext } from "../../../../helpers/auth/AuthContext";
import getConfig from 'next/config';
import { useRouter } from "next/router";

const { publicRuntimeConfig } = getConfig();
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`;

const AdSpaceSquare = ({ caption, description, premiumAdverts }) => {
  const router = useRouter()

  const authContext = useContext(AuthContext)
  const isAuth = authContext.isAuthenticated
  const onAuthModalsTriggered = authContext.onAuthModalsTriggered
  const onTarget = authContext.onTarget

  const onPremiumAdClicked= (advert) => {
    if (!isAuth) {
      onTarget(`/seller/detail/${advert.userISbb_agrix_usersID}`)
      onAuthModalsTriggered("login")
      return
    }
    router.push(`/seller/detail/${advert.userISbb_agrix_usersID}`)
  } 

  return (
    <section className="small-section slick-15 pt-0 produce ml-3">
      <h4 className="section-title">{caption} {description}</h4>
      {
        premiumAdverts.length < 4 ?
        <Row>
          {premiumAdverts.map(advert => (
            <Col md="4" key={advert._id}>
              <a className="linkCursor" onClick={()=>onPremiumAdClicked(advert)}>
                <div className="classic-effect d-flex justify-content-center">
                  <Media 
                    src={contentsUrl + advert.advert_image01ISfile} 
                    className="img-fluid-ads" 
                    alt="" 
                    height="280px"
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
          {premiumAdverts.map(advert => (
              <Col md="12" key={advert._id}>
                <a className="linkCursor" onClick={()=>onPremiumAdClicked(advert)}>
                  <div className="classic-effect thumbnail">
                    <Media 
                      src={contentsUrl + advert.advert_image01ISfile} 
                      className="img-fluid-ads" 
                      alt=""
                      height="280px"
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
export default AdSpaceSquare;
