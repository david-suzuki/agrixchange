import React, { Fragment, useState, useEffect, useContext } from "react";
import getConfig from "next/config";
import { useRouter } from "next/router";
import { Col, Media, Row } from "reactstrap";
import { getFormClient } from "../../../../../services/constants";
import { post } from "../../../../../services/axios";
import { AuthContext } from "../../../../../helpers/auth/AuthContext";
import UserPermissionModal from "../../../../../components/modals/UserPermission";

const { publicRuntimeConfig } = getConfig();
const apiUrl = `${publicRuntimeConfig.API_URL}`;
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`;

const SellerList = ({ favourites, filter, sellers, usersProduce }) => {
  const router = useRouter();

  const authContext = useContext(AuthContext);
  const user = authContext.user;

  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [message, setMessage] = useState("");

  const [followLoading, setFollowLoading] = useState([]);

  // The variable for handling the real data displayed through search
  const [filteredSellers, setFilteredSellers] = useState([]);
  const [favouriteSellers, setFavouriteSellers] = useState([]);

  // the variable for handling the fundamental data for search
  const [nonFavSellers, setNonFavSellers] = useState([]);
  const [favSellers, setFavSellers] = useState([]);

  // removing favourite sellers from s
  const initSellers = [];
  const initFavourites = [];
  for (let seller of sellers) {
    const favourite = favourites.find(
      (f) => f.fav_userISbb_agrix_usersID === seller.numeric_id
    );
    const user_produce = usersProduce.filter(
      (produce) => produce.userISbb_agrix_usersID === seller.numeric_id
    );
    if (!favourite) {
      initSellers.push({
        ...seller,
        favourite_id: null,
        produce: user_produce,
      });
    } else {
      initFavourites.push({
        ...seller,
        favourite_id: favourite._id,
        produce: user_produce,
      });
    }
  }

  useEffect(() => {
    let temp_sellers = [...nonFavSellers];
    let temp_favourites = [...favSellers];
    if (filter.country !== "") {
      temp_sellers = temp_sellers.filter(
        (temp) => temp.countryISbb_agrix_countriesID === filter.country
      );
      temp_favourites = temp_favourites.filter(
        (temp) => temp.countryISbb_agrix_countriesID === filter.country
      );
    }
    if (filter.region !== "") {
      temp_sellers = temp_sellers.filter(
        (temp) => temp.regionISbb_agrix_countriesID === filter.region
      );
      temp_favourites = temp_favourites.filter(
        (temp) => temp.regionISbb_agrix_countriesID === filter.region
      );
    }
    if (filter.city !== "") {
      temp_sellers = temp_sellers.filter(
        (temp) => temp.cityISbb_agrix_countriesID === filter.city
      );
      temp_favourites = temp_favourites.filter(
        (temp) => temp.cityISbb_agrix_countriesID === filter.city
      );
    }
    if (filter.seller !== "") {
      temp_sellers = temp_sellers.filter(
        (temp) =>
          temp.first_name.toLowerCase() === filter.seller.toLowerCase() ||
          temp.last_name.toLowerCase() === filter.seller.toLowerCase()
      );
      temp_favourites = temp_favourites.filter(
        (temp) =>
          temp.first_name.toLowerCase() === filter.seller.toLowerCase() ||
          temp.last_name.toLowerCase() === filter.seller.toLowerCase()
      );
    }
    if (filter.category !== "") {
      temp_sellers = temp_sellers.filter((temp) => {
        const category = temp.produce.find(
          (prod) =>
            prod.produce_categoryISbb_agrix_produce_typesID === filter.category
        );
        if (category) return true;
        return false;
      });
      temp_favourites = temp_favourites.filter((temp) => {
        const category = temp.produce.find(
          (prod) =>
            prod.produce_categoryISbb_agrix_produce_typesID === filter.category
        );
        if (category) return true;
        return false;
      });
    }
    setFavouriteSellers(temp_favourites);
    setFilteredSellers(temp_sellers);

    const loadings = [...temp_favourites, ...temp_sellers].map((item) => {
      return false;
    });
    setFollowLoading(loadings);
  }, [filter]);

  useEffect(() => {
    setFavouriteSellers(initFavourites);
    setFavSellers(initFavourites);
    setNonFavSellers(initSellers);
    const loadings = initFavourites.map((item) => {
      return false;
    });
    setFollowLoading(loadings);
  }, []);

  const permissionCheck = (seller) => {
    const membershipId = user.membershipISbb_agrix_membership_typesID;
    if (membershipId === "3" && favSellers.length >= 2) return false;
    if (membershipId === "2" && favSellers.length >= 10) return false;
    if (membershipId === "1" && favSellers.length >= 20) return false;
    return true;
  };

  const onFollowingClicked = async (e, seller, idx) => {
    e.stopPropagation();
    let formData = getFormClient();

    let loadings = followLoading.map((load, i) => {
      if (i === idx) return true;
      return false;
    });
    setFollowLoading(loadings);

    if (seller.favourite_id) {
      formData.append("api_method", "delete_users_favourites");
      formData.append("_id", seller.favourite_id);
    } else {
      const isUserAllowed = permissionCheck(seller);
      if (!isUserAllowed) {
        setMessage(
          "Your membership does not allow you to view this feature. Please upgrade to continue."
        );
        setShowPermissionModal(true);
        return;
      }

      formData.append("api_method", "add_users_favourites");
      formData.append("userISbb_agrix_usersID", user._id);
      formData.append("fav_userISbb_agrix_usersID", seller._id);
    }
    formData.append("session_id", user.session_id);
    formData.append("user_id", user._id);

    try {
      const response = await post(apiUrl, formData);

      loadings = followLoading.map((load) => {
        return false;
      });
      setFollowLoading(loadings);

      if (response.data.message === "SUCCESS") {
        if (seller.favourite_id) {
          const newFavouriteSellers = favouriteSellers.filter(
            (favSeller) => favSeller._id !== seller._id
          );
          setFavouriteSellers(newFavouriteSellers);
          const newFavSellers = favSellers.filter(
            (favSeller) => favSeller._id !== seller._id
          );
          setFavSellers(newFavSellers);
          setFilteredSellers([
            ...filteredSellers,
            ...[Object.assign({}, seller, { favourite_id: null })],
          ]);
          setNonFavSellers([
            ...nonFavSellers,
            ...[Object.assign({}, seller, { favourite_id: null })],
          ]);
        } else {
          const favourite_item = response.data.item;
          const newNonFavSellers = nonFavSellers.filter(
            (nonFavSeller) => nonFavSeller._id !== seller._id
          );
          setNonFavSellers(newNonFavSellers);
          const newFilteredSellers = filteredSellers.filter(
            (filteredSeller) => filteredSeller._id !== seller._id
          );
          setFilteredSellers(newFilteredSellers);
          setFavouriteSellers([
            ...favouriteSellers,
            ...[
              Object.assign({}, seller, { favourite_id: favourite_item._id }),
            ],
          ]);
          setFavSellers([
            ...favSellers,
            ...[
              Object.assign({}, seller, { favourite_id: favourite_item._id }),
            ],
          ]);
        }
      } else if (response.data.error) {
        alert(response.data.message);
      }
    } catch (err) {
      alert(err.toString());
    }
  };

  const onSellerClicked = (value) => {
    router.push(`/seller/detail/${value.numeric_id}`);
  };

  return (
    <Fragment>
      <div className="ratio_45 section-b-space">
        <Row className="partition4 mb-2">
          <Col md="12">
            <h5>My Seller</h5>
          </Col>
        </Row>
        <Row>
          {[...favouriteSellers, ...filteredSellers].map((data, idx) => {
            const country_name = data.countryISbb_agrix_countriesID_data
              ? data.countryISbb_agrix_countriesID_data.name
              : "";
            const region_name = data.regionISbb_agrix_countriesID_data
              ? data.regionISbb_agrix_countriesID_data.name
              : "";
            const city_name = data.cityISbb_agrix_countriesID_data
              ? data.cityISbb_agrix_countriesID_data.name
              : "";
            let produce_names = [];
            for (let prod of data.produce) {
              if (prod.produce_categoryISbb_agrix_produce_typesID_data) {
                const produceName =
                  prod.produce_categoryISbb_agrix_produce_typesID_data.name;
                const produce = produce_names.find(
                  (name) => name === produceName
                );
                if (!produce) produce_names.push(produceName);
              }
            }

            return (
              <div className="col-md-4 mb-3" key={data._id}>
                <a className="linkCursor" onClick={() => onSellerClicked(data)}>
                  <div className={`collection-banner`}>
                    <div className="img-part">
                      <Media
                        src={contentsUrl + data.companylogoISfile}
                        className="img-fluid-ads"
                        height="220px"
                        width="280px"
                        style={{ objectFit: "cover", borderRadius: 6 }}
                      />
                    </div>
                  </div>
                  <div className="ourseller-info produce-info">
                    <div
                      style={
                        data.favourite_id
                          ? { float: "right" }
                          : { color: "gray", float: "right" }
                      }
                    >
                      {followLoading[idx] ? (
                        <div
                          style={{
                            marginTop: 10,
                            textAlign: "center",
                          }}
                        >
                          <span
                            className="spinner-border text-success"
                            style={{ width: 25, height: 25 }}
                          ></span>
                        </div>
                      ) : (
                        <div
                          style={{ textAlign: "center", marginTop: 5 }}
                          onClick={(e) => onFollowingClicked(e, data, idx)}
                        >
                          <i
                            className="fa fa-star"
                            aria-hidden="true"
                            style={{ fontSize: 32 }}
                          ></i>
                          <br />
                          <span>
                            {data.favourite_id ? "Unfollow" : "Follow"}
                          </span>
                        </div>
                      )}
                    </div>
                    <h5>{data.first_name + " " + data.last_name}</h5>
                    <h5>{data.company ?? ""}</h5>
                    <h6>
                      {country_name + " " + region_name + " " + city_name}
                    </h6>
                    <h6>Produce: {produce_names.join(", ")}</h6>
                  </div>
                </a>
              </div>
            );
          })}
        </Row>
      </div>
      <UserPermissionModal
        modal={showPermissionModal}
        onToggle={() => setShowPermissionModal(!showPermissionModal)}
        message={message}
        isBack={false}
      />
    </Fragment>
  );
};

export default SellerList;
