import React, { useContext } from "react";
import { Col, Row, Media } from "reactstrap";
import getConfig from 'next/config';
import { useRouter } from "next/router";
import { AuthContext } from "../../../../helpers/auth/AuthContext";

const { publicRuntimeConfig } = getConfig();
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`;

const MasterCollection = ({ sellerId, img, title, company, location, link }) => {
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
    <Col md="3" className="mb-2">
      <a className="linkCursor" onClick={onSellerClicked}>
        <div className={`collection-banner`}>
          <div className="img-part">
            {
              img ? 
              <Media
                src={img}
                className="img-fluid-ads blur-up lazyload bg-img"
                alt=""
                height="200px"
                width="200px"
                style={{ objectFit: "cover", borderRadius: 7 }} 
              /> :
              <Media
                src="/assets/images/empty-search1.jpg"
                className="img-fluid-ads blur-up lazyload bg-img"
                alt=""
                height="200px"
                width="200px"
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

const SellersSpaceSmall = ({ caption, description, sectionClass, sellers, sellerProduces }) => {

  const categorySellers = []
  for (let sellerProduce of sellerProduces) {
    const seller = sellers.find(s=>s.numeric_id === sellerProduce.userISbb_agrix_usersID)
    const categorySeller = categorySellers.find(cs=>cs.numeric_id === seller.numeric_id)
    if (!categorySeller)
      categorySellers.push(seller)
  }
  
  return (
      <div>
        <section className={sectionClass}>
            <h4 className="section-title pt-3 pb-3">{caption} {description}</h4>
            <Row className="partition3">
              {categorySellers.map(seller => {
                const imgUrl = seller.companylogoISfile ? contentsUrl + '' + seller.companylogoISfile : "/assets/images/empty-search1.jpg"
                
                const countryName = seller.countryISbb_agrix_countriesID_data ? seller.countryISbb_agrix_countriesID_data.name : ""
                const regionName = seller.regionISbb_agrix_countriesID_data ? seller.regionISbb_agrix_countriesID_data.name : ""
                const cityName = seller.cityISbb_agrix_countriesID_data ? seller.cityISbb_agrix_countriesID_data.name : ""
                
                return (
                  <MasterCollection
                    key={seller._id}
                    sellerId={seller.numeric_id}
                    img={imgUrl}
                    link={seller.website_url}
                    title={seller.first_name + " " + seller.last_name}
                    company={seller.company}
                    location={countryName + " " + regionName + " " + cityName}
                  />
                );
              })}
            </Row>
        </section>
      </div>
  );
};

export default SellersSpaceSmall;
