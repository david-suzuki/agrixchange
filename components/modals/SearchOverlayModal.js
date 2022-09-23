import React, { useEffect, useContext, useState, Fragment } from "react";
import getConfig from "next/config";
import {
  Modal,
  ModalBody,
  Row,
  Col,
  Label,
  Container,
  Media,
} from "reactstrap";
import { getFormClient } from "../../services/constants";
import { post } from "../../services/axios";
import { useRouter } from "next/router";
import { AuthContext } from "../../helpers/auth/AuthContext";
import BuyerReportDetail from "./BuyerReportSeller";
import UserPermission from "./UserPermission";

const { publicRuntimeConfig } = getConfig();
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`;
const apiUrl = `${publicRuntimeConfig.API_URL}`;

const SearchOverlay = ({ isShow, onToggle, searchText }) => {
  const router = useRouter();

  const authContext = useContext(AuthContext);
  const isAuth = authContext.isAuthenticated;
  const onAuthModalsTriggered = authContext.onAuthModalsTriggered;
  const onTarget = authContext.onTarget;

  const [sellers, setSellers] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [produces, setProduces] = useState([]);
  const [categoryIds, setCategoryIds] = useState([]);
  const [subCategoryIds, setSubCategoryIds] = useState([]);
  const [noResult, setNoResult] = useState(false);

  const [showBuyerModal, setShowBuyerModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState({});

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getProduceTypes = async () => {
      let formData = getFormClient();
      formData.append("api_method", "list_produce_types");
      try {
        const response = await post(apiUrl, formData);
        if (response.data.message === "SUCCESS") {
          const result = response.data.list;

          const categories = result.filter(
            (item) => item.refers_toISbb_agrix_produce_typesID === null
          );
          const categoryIds = categories.map((category) => category.numeric_id);
          setCategoryIds(categoryIds);

          let subCategories = [];
          for (let catId of categoryIds) {
            const subCats = result.filter(
              (item) => item.refers_toISbb_agrix_produce_typesID === catId
            );
            subCategories = [...subCategories, ...subCats];
          }
          const subCategoryIds = subCategories.map((sub) => sub.numeric_id);
          setSubCategoryIds(subCategoryIds);
        } else if (response.data.error) {
          alert(response.data.message);
        }
      } catch (err) {
        alert(err.toString());
      }
    };

    getProduceTypes();
  }, []);

  useEffect(() => {
    const getSearchResult = async () => {
      let formData = getFormClient();
      formData.append("api_method", "search");
      formData.append("search_text", searchText);
      try {
        setLoading(true);
        const response = await post(apiUrl, formData);
        setLoading(false);
        if (response.data.message === "SUCCESS") {
          const result = response.data.results;
          if (
            result.sellers.length === 0 &&
            result.buyers.length === 0 &&
            result.produce_types.length === 0
          ) {
            setNoResult(true);
          } else {
            setSellers(result.sellers);
            setBuyers(result.buyers);
            setProduces(result.produce_types);
          }
        }
      } catch (err) {
        alert(err.toString());
      }
    };

    if (isShow) getSearchResult();
  }, [searchText, isShow]);

  const onSellerClicked = (seller) => {
    onSearchClosed();
    if (!isAuth) {
      onTarget(`/seller/detail/${seller.numeric_id}`);
      onAuthModalsTriggered("login");
      return;
    }
    router.push(`/seller/detail/${seller.numeric_id}`);
  };

  const onBuyerClicked = (buyer) => {
    onSearchClosed();
    if (!isAuth) {
      onAuthModalsTriggered("login");
      return;
    }
    setSelectedBuyer(buyer);
    setShowBuyerModal(true);
  };

  const onProduceClicked = (produce) => {
    onSearchClosed();
    if (!isAuth) {
      if (categoryIds.includes(produce.numeric_id))
        onTarget(`/produce/${produce.numeric_id}`);
      else if (subCategoryIds.includes(produce.numeric_id))
        onTarget(`/produce-sub/${produce.numeric_id}`);

      onAuthModalsTriggered("login");
      return;
    }

    if (categoryIds.includes(produce.numeric_id))
      router.push(`/produce/${produce.numeric_id}`);
    else if (subCategoryIds.includes(produce.numeric_id))
      router.push(`/produce-sub/${produce.numeric_id}`);
  };

  const onSearchClosed = () => {
    onToggle();
    setNoResult(false);
    setSellers([]);
    setBuyers([]);
    setProduces([]);
    setLoading(false);
  };

  const onUserLimited = () => {
    setShowBuyerModal(false);
    setShowRoleModal(true);
  };

  return (
    <Fragment>
      <Modal isOpen={isShow} toggle={onSearchClosed} size="lg" centered>
        <ModalBody className="p-3">
          <Row>
            <Col md="1">
              <div
                style={{ fontSize: 18, cursor: "pointer" }}
                onClick={onSearchClosed}
              >
                <i className="fa fa-arrow-left" aria-hidden="true"></i>
              </div>
            </Col>
            <Col
              md={{
                offset: 4,
                size: 4,
              }}
            >
              <Label style={{ fontSize: 18, fontWeight: "bold" }}>
                Search Result
              </Label>
            </Col>
          </Row>
          {loading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ minHeight: 200 }}
            >
              <span
                className="spinner-border text-success"
                style={{ fontSize: 22, width: 50, height: 50 }}
              ></span>
            </div>
          ) : (
            <Container
              style={{
                maxHeight: "500px",
                overflow: "auto",
              }}
            >
              {noResult && (
                <div className="d-flex justify-content-center my-5">
                  <h3 className="font-weight-bold">
                    Sorry, there is no result.
                  </h3>
                </div>
              )}
              <Fragment>
                {sellers.length > 0 && (
                  <div className="mt-3">
                    <Label style={{ fontSize: 18, fontWeight: "bold" }}>
                      Sellers
                    </Label>
                    <Row>
                      {sellers.map((seller) => (
                        <Col md="3" key={seller.numeric_id}>
                          <a
                            onClick={() => onSellerClicked(seller)}
                            style={{ cursor: "pointer" }}
                          >
                            <Media
                              src={
                                seller.companylogoISfile
                                  ? contentsUrl + seller.companylogoISfile
                                  : ""
                              }
                              className="img-fluid-ads"
                              alt=""
                              style={{
                                objectFit: "cover",
                                width: "90%",
                                height: "120px",
                                borderRadius: "5px",
                              }}
                            />
                            <Label>{seller.company}</Label>
                          </a>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}
              </Fragment>
              <Fragment>
                {buyers.length > 0 && (
                  <div className="mt-3">
                    <Label style={{ fontSize: 18, fontWeight: "bold" }}>
                      Buyers
                    </Label>
                    <Row>
                      {buyers.map((buyer) => (
                        <Col md="3" key={buyer.numeric_id}>
                          <a
                            onClick={() => onBuyerClicked(buyer)}
                            style={{ cursor: "pointer" }}
                          >
                            <Media
                              src={
                                buyer.companylogoISfile
                                  ? contentsUrl + buyer.companylogoISfile
                                  : ""
                              }
                              className="img-fluid-ads"
                              alt=""
                              style={{
                                objectFit: "cover",
                                width: "90%",
                                height: "120px",
                                borderRadius: "5px",
                              }}
                            />
                            <Label>{buyer.company}</Label>
                          </a>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}
              </Fragment>
              <Fragment>
                {produces.length > 0 && (
                  <div className="mt-3">
                    <Label style={{ fontSize: 18, fontWeight: "bold" }}>
                      Produces
                    </Label>
                    <Row>
                      {produces.map(
                        (produce) =>
                          (categoryIds.includes(produce.numeric_id) ||
                            subCategoryIds.includes(produce.numeric_id)) && (
                            <Col md="3" key={produce.numeric_id}>
                              <a
                                onClick={() => onProduceClicked(produce)}
                                style={{ cursor: "pointer" }}
                              >
                                <Media
                                  src={
                                    produce.main_produce_image01ISfile
                                      ? contentsUrl +
                                        produce.main_produce_image01ISfile
                                      : ""
                                  }
                                  className="img-fluid-ads"
                                  alt=""
                                  style={{
                                    objectFit: "cover",
                                    width: "90%",
                                    height: "120px",
                                    borderRadius: "5px",
                                  }}
                                />
                                <Label>{produce.name}</Label>
                              </a>
                            </Col>
                          )
                      )}
                    </Row>
                  </div>
                )}
              </Fragment>
            </Container>
          )}
        </ModalBody>
      </Modal>
      <BuyerReportDetail
        isShow={showBuyerModal}
        onToggle={() => setShowBuyerModal(!showBuyerModal)}
        buyer={selectedBuyer}
        onLimited={onUserLimited}
      />
      <UserPermission
        modal={showRoleModal}
        onToggle={() => setShowRoleModal(!showRoleModal)}
        message="Your membership does not allow you to view this feature. Please upgrade to continue."
        isBack={false}
      />
    </Fragment>
  );
};

export default SearchOverlay;
