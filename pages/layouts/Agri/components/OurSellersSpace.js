import React, { Fragment, useContext, useState } from "react";
import { Container, Col, Row, Media } from "reactstrap";
import getConfig from 'next/config';
import { AuthContext } from "../../../../helpers/auth/AuthContext";
import { useRouter } from "next/router";

const { publicRuntimeConfig } = getConfig();
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`;

const MasterCollection = ({ sellerId, img, title, company, location }) => {
  const router = useRouter()

  const authContext = useContext(AuthContext)
  const isAuth = authContext.isAuthenticated
  const onAuthModalsTriggered = authContext.onAuthModalsTriggered
  const onTarget = authContext.onTarget

  const onSellerClicked = () => {
    if (!isAuth) {
      onTarget(`/seller/detail/${sellerId}`)
      onAuthModalsTriggered("login")
      return
    }
    router.push(`/seller/detail/${sellerId}`)
  }
  
  return (
    <Col md="3" style={{ marginBottom: 40 }}>
      <a className="linkCursor" onClick={onSellerClicked}>
        <div className={`collection-banner`}>
          <div className="img-part">
            {
              img ? 
              <Media
                src={img}
                className="img-fluid-ads"
                width="260"
                height="180"
                style={{ objectFit: "cover", borderRadius: 7 }}
              /> :
              <Media
                src="/assets/images/empty-search1.jpg"
                className="img-fluid-ads" 
                width="260"
                height="180"
                style={{ objectFit: "cover", borderRadius: 7 }}
              />
            }
          </div>
        </div>
        <div className="ourseller-info">
          <h5 style={{ fontSize: 20 }}>{company}</h5>
          <h6 className="ml-2">{title}</h6>
          <h6 className="ml-2">{location}</h6>
        </div>
      </a>
    </Col>
  );
};

const OurSellersSpace = ({sellers}) => {
  return (
    <Fragment>
      <section className="ratio_45 section-b-space mx-3">
        <Container>
          <h4 className="section-title pt-3 pb-3">Our Sellers</h4>
          <Row>
              {
                sellers.map(seller => {
                  const imgUrl = seller.companylogoISfile ? 
                    contentsUrl + '' + seller.companylogoISfile : "/assets/images/empty-search1.jpg"

                  const countryName = seller.countryISbb_agrix_countriesID_data ? seller.countryISbb_agrix_countriesID_data.name : ""
                  const regionName = seller.regionISbb_agrix_countriesID_data ? seller.regionISbb_agrix_countriesID_data.name : ""
                  const cityName = seller.cityISbb_agrix_countriesID_data ? seller.cityISbb_agrix_countriesID_data.name : ""

                  return (
                    <MasterCollection
                      key={seller._id}
                      sellerId={seller.numeric_id}
                      img={imgUrl}
                      title={seller.first_name + " " + seller.last_name}
                      company={seller.company ?? ""}
                      location={countryName + " " + regionName + " " + cityName}
                    />
                  )
                })
              }
          </Row>
        </Container>
      </section>
    </Fragment>
  );
};

export default OurSellersSpace;
