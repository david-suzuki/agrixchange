import React, { useEffect, useState, useContext } from "react";
import getConfig from "next/config";
import Chart from "react-google-charts";
import { Col, Row, Modal, ModalHeader, ModalBody } from "reactstrap";
import { AuthContext } from "../../helpers/auth/AuthContext";
import PriceLineGraph from "../../pages/layouts/Agri/components/PriceLineGraph";
import SeasonalPieChart from "../../pages/layouts/Agri/components/SeasonalPieChart";

const { publicRuntimeConfig } = getConfig();
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`;

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center",
};

const ProduceDetailsModal = ({
  modal,
  onToggle,
  selectedProduce,
  selectedPrice,
  pricingLogs,
  usersProduce,
  onFollowClicked,
}) => {
  const authContext = useContext(AuthContext);
  const user = authContext.user;

  const [companyName, setCompanyName] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [locationName, setLocationName] = useState("");
  const [typeName, setTypeName] = useState("");
  const [sizeName, setSizeName] = useState("");
  const [packagingName, setPackagingName] = useState("");
  const [farmingName, setFarmingName] = useState("");
  const [seasonName, setSeasonName] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [favouriteId, setFavouriteId] = useState("");
  const [lineChartData, setLineChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [idForGraph, setIdForGraph] = useState("");

  useEffect(() => {
    if (selectedProduce) {
      setInitValues(selectedProduce);
      setLoading(false);
      setIdForGraph(selectedProduce.numeric_id);
    }
  }, [selectedProduce]);

  const setInitValues = (selectedProduce) => {
    let company_name = "";
    let seller_name = "";
    let country_name = "";
    let region_name = "";
    let city_name = "";
    if (selectedProduce.seller) {
      company_name = selectedProduce.seller.company ?? "";
      country_name = selectedProduce.seller.countryISbb_agrix_countriesID_data
        ? selectedProduce.seller.countryISbb_agrix_countriesID_data.name
        : "";
      region_name = selectedProduce.seller.regionISbb_agrix_countriesID_data
        ? selectedProduce.seller.regionISbb_agrix_countriesID_data.name
        : "";
      city_name = selectedProduce.seller.cityISbb_agrix_countriesID_data
        ? selectedProduce.seller.cityISbb_agrix_countriesID_data.name
        : "";
      seller_name =
        (selectedProduce.seller.first_name ?? "") +
        " " +
        (selectedProduce.seller.last_name ?? "");
    }

    const type_name =
      selectedProduce.produce_typeISbb_agrix_produce_typesID_data
        ? selectedProduce.produce_typeISbb_agrix_produce_typesID_data.name
        : "";
    const size_name = selectedProduce.sizeISbb_agrix_produce_sizesID_data
      ? selectedProduce.sizeISbb_agrix_produce_sizesID_data.name
      : "";
    const packaging_name =
      selectedProduce.packagingISbb_agrix_produce_packagingID_data
        ? selectedProduce.packagingISbb_agrix_produce_packagingID_data.name
        : "";
    const farming_name =
      selectedProduce.farming_methodISbb_agrix_produce_farming_methodID_data
        ? selectedProduce.farming_methodISbb_agrix_produce_farming_methodID_data
            .name
        : "";
    const season_name = selectedProduce.produce_storage_season
      ? JSON.parse(selectedProduce.produce_storage_season).join(",")
      : "";

    setCompanyName(company_name);
    setSellerName(seller_name);
    setLocationName(country_name + region_name + city_name);
    setTypeName(type_name);
    setSizeName(size_name);
    setPackagingName(packaging_name);
    setFarmingName(farming_name);
    setSeasonName(season_name);
    setImgUrl(contentsUrl + selectedProduce.produce_imageISfile);
    setFavouriteId(selectedProduce.favourite_id);
  };

  return (
    <Modal centered isOpen={modal} toggle={onToggle} className="modal-lg">
      <ModalHeader toggle={onToggle}>Produce</ModalHeader>
      <ModalBody className="mx-5">
        <section className="ratio_45 section-b-space">
          <Row>
            <Col>
              <img
                src={imgUrl}
                className="img-fluid-ads"
                style={{
                  objectFit: "cover",
                  width: "100%",
                  maxHeight: "350px",
                  borderRadius: 10,
                }}
              />
            </Col>
          </Row>
          <div className="buyer-info mt-3">
            {user.role === "buyer" && (
              <div
                style={
                  favouriteId
                    ? { color: "#85be00", float: "right" }
                    : { color: "gray", float: "right" }
                }
              >
                {loading ? (
                  <div
                    style={{
                      marginTop: 10,
                      textAlign: "center",
                    }}
                  >
                    <span
                      className="spinner-border text-success"
                      style={{ width: 50, height: 50 }}
                    ></span>
                  </div>
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      marginTop: 10,
                      marginRight: 10,
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      setLoading(true);
                      onFollowClicked(e, selectedProduce);
                    }}
                  >
                    <i
                      className="fa fa-star"
                      aria-hidden="true"
                      style={{ fontSize: 52 }}
                    ></i>
                    <br />
                    <span style={{ fontSize: 20 }}>
                      {favouriteId ? "Unfollow" : "Follow"}
                    </span>
                  </div>
                )}
              </div>
            )}

            <h5>{companyName}</h5>
            <h5>{sellerName}</h5>
            <h5>{locationName}</h5>
            <h5>$ Price: {selectedPrice}</h5>
            <h6>Type: {typeName}</h6>
            <h6>Size: {sizeName}</h6>
            <h6>Packaging: {packagingName}</h6>
            <h6>Farming Method: {farmingName}</h6>
            <h6>Season: {seasonName}</h6>
          </div>
          <div>
            <PriceLineGraph
              numeric_id={idForGraph}
              pricelogs={pricingLogs}
              graphTitle="Line Graph Showing Price Changes Over 12 Months"
            />
          </div>
          <div>
            <SeasonalPieChart
              numeric_id={idForGraph}
              usersProduce={usersProduce}
              graphTitle="Produce Seasonal Chart"
            />
          </div>
        </section>
      </ModalBody>
    </Modal>
  );
};

export default ProduceDetailsModal;
