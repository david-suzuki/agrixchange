import React, { Fragment, useContext } from "react";
import Slider from "react-slick";
import { Media, Container, Row, Col } from "reactstrap";
import { Slider4 } from "../../../../services/script";
import { AuthContext } from "../../../../helpers/auth/AuthContext";
import getConfig from 'next/config';
import { useRouter } from "next/router";

const { publicRuntimeConfig } = getConfig();
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`;

const AdSpace = ({planAdverts}) => {
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
    <Fragment>
      <section className="blog-bg section-b-space ad-space slick-15  mx-3">
        <Container>
          <h4 className="section-title">Ad Space</h4>
          <Row>
          {
            planAdverts.length < 5 ?
            <Fragment>
              {planAdverts.map(advert => (
                <Col md="3" key={advert._id} className="mb-1">
                  <a className="linkCursor" onClick={()=>onAdClicked(advert)}>
                    <div className="classic-effect d-flex justify-content-center">
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
            </Fragment> :
            <Col md="12">
              <Slider {...Slider4} className="slide-4">
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
            </Col>
          }
          </Row>
        </Container>
      </section>
    </Fragment>
  );
};
export default AdSpace;
