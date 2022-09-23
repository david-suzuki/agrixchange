import React, { Fragment, useContext, useEffect, useState } from "react";
import getConfig from "next/config";
import { useRouter } from "next/router";
import { Row, Col, Media } from "reactstrap";
import { AuthContext } from "../../../../../helpers/auth/AuthContext";
import { getFormClient } from "../../../../../services/constants";
import { post } from "../../../../../services/axios";
import FavouriteProduceDetail from "../../../../../components/modals/FavouriteProduceBuyer";
import UserPermissionModal from "../../../../../components/modals/UserPermission";

const { publicRuntimeConfig } = getConfig();
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`;
const apiUrl = `${publicRuntimeConfig.API_URL}`;

const FavouriteSellerProduce = ({
  seller,
  usersProduce,
  usersFavourites,
  pricingLogs,
}) => {
  const router = useRouter();

  const authContext = useContext(AuthContext);
  const user = authContext.user;

  const [produces, setProduces] = useState([]);

  const [showDetailsModal, setDetailsModal] = useState(false);
  const [selectedProduce, setSelectedProduce] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);

  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [message, setMessage] = useState("");

  const [followLoading, setFollowLoading] = useState([]);

  useEffect(() => {
    const produces = usersProduce.map((userProduce) => {
      const favourite = usersFavourites.find(
        (userfavourite) =>
          userfavourite.fav_produceISbb_agrix_users_produceID ===
          userProduce.numeric_id
      );
      if (favourite) return { ...userProduce, favourite_id: favourite._id };
      else return { ...userProduce, favourite_id: null };
    });
    setProduces(produces);

    const loadings = produces.map((produce) => {
      return false;
    });
    setFollowLoading(loadings);
  }, []);

  const permissionCheck = () => {
    const existFavourites = produces.filter((fp) => fp.favourite_id !== null);

    const membershipId = user.membershipISbb_agrix_membership_typesID;
    if (membershipId === "3" && existFavourites.length >= 2) return false;
    if (membershipId === "2" && existFavourites.length >= 5) return false;

    return true;
  };

  const onFollowingClicked = async (e, produce, idx) => {
    e.stopPropagation();
    let formData = getFormClient();

    let loadings = followLoading.map((load, i) => {
      if (i === idx) return true;
      return false;
    });
    setFollowLoading(loadings);

    if (produce.favourite_id) {
      formData.append("api_method", "delete_users_favourites");
      formData.append("_id", produce.favourite_id);
    } else {
      const isUserAllowed = permissionCheck();
      if (!isUserAllowed) {
        setMessage(
          "Your membership does not allow you to view this feature. Please upgrade to continue."
        );
        setShowPermissionModal(true);
        return;
      }

      formData.append("api_method", "add_users_favourites");
      formData.append("userISbb_agrix_usersID", user._id);
      formData.append(
        "fav_produceISbb_agrix_users_produceID",
        produce.numeric_id
      );
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
        const item = response.data.item;
        if (produce.favourite_id) {
          const newProduces = produces.map((prod) => {
            if (prod._id === produce._id) {
              const followingProduce = Object.assign({}, prod, {
                favourite_id: null,
              });
              setSelectedProduce(followingProduce);
              return followingProduce;
            }
            return prod;
          });
          setProduces(newProduces);
        } else {
          const newProduces = produces.map((prod) => {
            if (prod._id === produce._id) {
              const followingProduce = Object.assign({}, prod, {
                favourite_id: item._id,
              });
              setSelectedProduce(followingProduce);
              return followingProduce;
            }
            return prod;
          });
          setProduces(newProduces);
        }
      } else if (response.data.error) {
        alert(response.data.message);
      }
    } catch (err) {
      alert(err.toString());
    }
  };

  const onProduceClicked = (value, price) => {
    setDetailsModal(true);
    setSelectedProduce(value);
    setSelectedPrice(price);
  };

  const onModalFollowClicked = (e, produce) => {
    onFollowingClicked(e, produce);
  };

  return (
    <Fragment>
      <div>
        <h4>Produces</h4>
      </div>
      <Row>
        {produces.map((data, idx) => {
          let produce_name = "";
          if (data.produce_typeISbb_agrix_produce_typesID_data)
            produce_name =
              data.produce_typeISbb_agrix_produce_typesID_data.name;
          else if (data.produce_sub_categoryISbb_agrix_produce_typesID_data)
            produce_name =
              data.produce_sub_categoryISbb_agrix_produce_typesID_data.name;

          const pricingLog = pricingLogs.find(
            (pricelog) =>
              pricelog.produceISbb_agrix_users_produceID === data.numeric_id
          )?.priceNUM;
          const price = pricingLog ? parseFloat(pricingLog).toFixed(2) : "";
          const country_name = seller.countryISbb_agrix_countriesID_data
            ? seller.countryISbb_agrix_countriesID_data.name
            : "";
          const region_name = seller.regionISbb_agrix_countriesID_data
            ? seller.regionISbb_agrix_countriesID_data.name
            : "";
          const city_name = seller.cityISbb_agrix_countriesID_data
            ? seller.cityISbb_agrix_countriesID_data.name
            : "";
          const type_name = data.produce_typeISbb_agrix_produce_typesID_data
            ? data.produce_typeISbb_agrix_produce_typesID_data.name
            : "";
          const size_name = data.sizeISbb_agrix_produce_sizesID_data
            ? data.sizeISbb_agrix_produce_sizesID_data.name
            : "";
          const packaging_name =
            data.packagingISbb_agrix_produce_packagingID_data
              ? data.packagingISbb_agrix_produce_packagingID_data.name
              : "";
          const farming_name =
            data.farming_methodISbb_agrix_produce_farming_methodID_data
              ? data.farming_methodISbb_agrix_produce_farming_methodID_data.name
              : "";
          const season_name =
            data.storage_seasonISbb_agrix_produce_seasonsID_data
              ? data.storage_seasonISbb_agrix_produce_seasonsID_data.name
              : "";

          return (
            <div className="col-md-3 mb-3" key={data._id}>
              <a
                className="linkCursor"
                onClick={() => onProduceClicked(data, price)}
              >
                <div className={`collection-banner`}>
                  <div className="img-part">
                    <Media
                      src={contentsUrl + data.produce_imageISfile}
                      className="img-fluid-ads"
                      height="180px"
                      width="230px"
                      style={{ objectFit: "cover", borderRadius: 6 }}
                    />
                  </div>
                </div>
                <div className="ourseller-info produce-info">
                  {user.role === "buyer" && (
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
                          style={{ textAlign: "center", marginTop: 10 }}
                          onClick={(e) => onFollowingClicked(e, data, idx)}
                        >
                          <i
                            className="fa fa-star"
                            aria-hidden="true"
                            style={{ fontSize: 26 }}
                          ></i>
                          <br />
                          <span>
                            {data.favourite_id ? "Unfollow" : "Follow"}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  <h5>{produce_name}</h5>
                  {user.role !== "seller" && <h5>Price: ${price}</h5>}
                  <h5>Validity: </h5>
                  <h5>
                    Location:{" "}
                    {country_name + " " + region_name + " " + city_name}
                  </h5>
                  <h6>Type: {type_name}</h6>
                  <h6>Size: {size_name}</h6>
                  <h6>Packaging: {packaging_name}</h6>
                  <h6>Farming Method: {farming_name}</h6>
                  <h6>Season: {season_name}</h6>
                </div>
              </a>
            </div>
          );
        })}
      </Row>
      <FavouriteProduceDetail
        modal={showDetailsModal}
        onToggle={(showDetailsModal) => setDetailsModal(!showDetailsModal)}
        selectedProduce={selectedProduce}
        selectedPrice={selectedPrice}
        pricingLogs={pricingLogs}
        onFollowClicked={onModalFollowClicked}
        usersProduce={usersProduce}
      />
      <UserPermissionModal
        modal={showPermissionModal}
        onToggle={() => setShowPermissionModal(!showPermissionModal)}
        message={message}
        isBack={false}
      />
    </Fragment>
  );
};

export default FavouriteSellerProduce;
