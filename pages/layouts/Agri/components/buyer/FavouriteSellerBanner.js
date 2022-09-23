import React, { Fragment, useContext, useState } from "react";
import getConfig from "next/config";
import { Media, Row, Col } from "reactstrap";
import { Award } from "react-feather";
import { AuthContext } from "../../../../../helpers/auth/AuthContext";
import { getFormClient } from "../../../../../services/constants";
import { post } from "../../../../../services/axios";
import ReportsListSeller from "../../../../../components/modals/ReportsListSeller";
import LineChartSeller from "../../../../../components/modals/LineChartSeller";

const { publicRuntimeConfig } = getConfig();
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`;
const apiUrl = `${publicRuntimeConfig.API_URL}`;

const FavouriteSellerBanner = ({ seller, usersFavourites, usersProduce }) => {
  const bannerBackground = {
    backgroundImage:
      "linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(" +
      contentsUrl +
      seller.companybannerISfile +
      ")",
  };

  const authContext = useContext(AuthContext);
  const user = authContext.user;

  const favourite = usersFavourites.find(
    (uf) => uf.fav_userISbb_agrix_usersID === seller.numeric_id
  );
  const [currentFavouriteId, setCurrentFavouriteId] = useState(
    favourite ? favourite._id : null
  );

  const [reportsModal, setReportsModal] = useState(false);
  const [chartModal, setChartModal] = useState(false);

  const onFavouriteClicked = async () => {
    let formData = getFormClient();
    if (currentFavouriteId) {
      formData.append("api_method", "delete_users_favourites");
      formData.append("_id", currentFavouriteId);
    } else {
      formData.append("api_method", "add_users_favourites");
      formData.append("userISbb_agrix_usersID", user._id);
      formData.append("fav_userISbb_agrix_usersID", seller._id);
    }
    formData.append("session_id", user.session_id);
    formData.append("user_id", user._id);

    try {
      const response = await post(apiUrl, formData);
      if (response.data.message === "SUCCESS") {
        const item = response.data.item;
        if (currentFavouriteId) {
          setCurrentFavouriteId(null);
        } else {
          setCurrentFavouriteId(item._id);
        }
      } else if (response.data.error) {
        alert(response.data.message);
      }
    } catch (err) {
      alert(err.toString());
    }
  };

  return (
    <div>
      <section className="favourite-banner-panel" style={bannerBackground}>
        <div className="pl-3 pt-3">
          <Media
            src={`${contentsUrl}${seller.companylogoISfile}`}
            className="img-fluid blur-up lazyload bg-img"
            alt=""
            width="165px"
            style={{ borderRadius: 7, height: "100%" }}
          />
          <Award
            style={{ position: "relative", right: 0, display: "none" }}
            color="#fd7e14"
          />
        </div>
        <div className="seller-page-info pl-3 pt-3">
          <h3>{seller.company}</h3>
          <p>{seller.first_name + " " + seller.last_name}</p>
          <p>{seller.companysummaryISsmallplaintextbox}</p>
        </div>
        <Row className="favourite-banner-info w-100">
          <Col md="8">
            <ul>
              <li>
                <a
                  className="linkCursor"
                  href="#graphs"
                  // onClick={() => setChartModal(!chartModal)}
                >
                  <i className="fa fa-bar-chart circle-icon"></i>
                </a>
              </li>
              <li>
                <a
                  className="linkCursor"
                  onClick={() => setReportsModal(!reportsModal)}
                >
                  <i className="fa fa-list-alt circle-icon"></i>
                </a>
              </li>
            </ul>
          </Col>
          <Col
            md="4"
            className="d-flex justify-content-end"
            style={{ paddingRight: 50 }}
          >
            <button
              className="btn btn-solid btn-default-plan btn-post ml-5"
              style={{ marginTop: 15 }}
            >
              <i className="fa fa-comments mr-1" aria-hidden="true"></i>
              Message
            </button>
            {user.role === "buyer" && (
              <button
                className={`btn btn-solid ${
                  currentFavouriteId ? "btn-default-plan" : "btn-gray-plan"
                } btn-post ml-3`}
                style={{ marginTop: 15 }}
                onClick={onFavouriteClicked}
              >
                <i className="fa fa-star mr-1" aria-hidden="true"></i>
                {currentFavouriteId ? "Unfollow" : "Follow"}
              </button>
            )}
          </Col>
        </Row>
      </section>
      <ReportsListSeller
        isShow={reportsModal}
        onToggle={() => setReportsModal(!reportsModal)}
        seller={seller}
      />
      <LineChartSeller
        isShow={chartModal}
        onToggle={() => setChartModal(!chartModal)}
        usersProduce={usersProduce}
        seller={seller}
      />
    </div>
  );
};

export default FavouriteSellerBanner;
