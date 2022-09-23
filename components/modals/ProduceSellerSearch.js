import React, { useEffect, useState } from "react";
import {
  Modal,
  Row,
  Col,
  Media,
  ModalBody,
  Input,
  FormGroup,
  Form,
} from "reactstrap";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`;

const ProduceSellerSearch = ({ isShow, onToggle, sellers, sellerProduces }) => {
  const [produceSellers, setProduceSellers] = useState([]);
  const [initSellers, setInitSellers] = useState([]);

  useEffect(() => {
    const categorySellers = [];
    for (let sellerProduce of sellerProduces) {
      const seller = sellers.find(
        (s) => s.numeric_id === sellerProduce.userISbb_agrix_usersID
      );
      const categorySeller = categorySellers.find(
        (cs) => cs.numeric_id === seller.numeric_id
      );
      if (!categorySeller) categorySellers.push(seller);
    }

    setProduceSellers(categorySellers);
    setInitSellers(categorySellers);
  }, [sellers, sellerProduces]);

  const onSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      const searchText = event.target.value;
      const newSellers = initSellers.filter(
        (seller) =>
          seller.first_name.toLowerCase().includes(searchText.toLowerCase()) ||
          seller.last_name.toLowerCase().includes(searchText.toLowerCase())
      );
      setProduceSellers(newSellers);
    }
  };

  return (
    <Modal centered isOpen={isShow} toggle={onToggle} className="modal-lg">
      <ModalBody className="p-4">
        <Row className="my-2">
          <Col md="1" onClick={onToggle}>
            <span
              style={{
                fontSize: 18,
                marginTop: 5,
                cursor: "pointer",
              }}
            >
              <i className="fa fa-arrow-left" aria-hidden="true"></i>
            </span>
          </Col>
          <Col
            md={{
              offset: 3,
              size: 4,
            }}
          >
            <div className="d-flex">
              <Input
                type="search"
                className="form-control"
                onKeyDown={onSearchKeyDown}
              />
              <div
                style={{
                  fontSize: 18,
                  marginLeft: 5,
                  marginTop: 5,
                  cursor: "pointer",
                }}
              >
                <i className="fa fa-search" aria-hidden="true"></i>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="mt-4" style={{ maxHeight: 400, overflowY: "auto" }}>
          {produceSellers.map((seller) => {
            const imgUrl = seller.companylogoISfile
              ? contentsUrl + "" + seller.companylogoISfile
              : "/assets/images/empty-search1.jpg";

            const countryName = seller.countryISbb_agrix_countriesID_data
              ? seller.countryISbb_agrix_countriesID_data.name
              : "";
            const regionName = seller.regionISbb_agrix_countriesID_data
              ? seller.regionISbb_agrix_countriesID_data.name
              : "";
            const cityName = seller.cityISbb_agrix_countriesID_data
              ? seller.cityISbb_agrix_countriesID_data.name
              : "";

            return (
              <Col md="4" className="mb-2" key={seller.numeric_id}>
                <div className={`collection-banner`}>
                  <div className="img-part">
                    {imgUrl ? (
                      <Media
                        src={imgUrl}
                        className="img-fluid-ads blur-up lazyload bg-img"
                        alt=""
                        height="200px"
                        width="200px"
                        style={{ objectFit: "cover", borderRadius: 7 }}
                      />
                    ) : (
                      <Media
                        src="/assets/images/empty-search1.jpg"
                        className="img-fluid-ads blur-up lazyload bg-img"
                        alt=""
                        height="200px"
                        width="200px"
                        style={{ objectFit: "cover", borderRadius: 7 }}
                      />
                    )}
                  </div>
                </div>
                <div className="ourseller-info">
                  <h5 style={{ fontSize: 18 }}>{seller.company}</h5>
                  <h6 className="ml-2">
                    {seller.first_name + " " + seller.last_name}
                  </h6>
                  <h6 className="ml-2">
                    {countryName + " " + regionName + " " + cityName}
                  </h6>
                </div>
              </Col>
            );
          })}
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default ProduceSellerSearch;
