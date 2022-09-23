import React, { Fragment, useState, useEffect, useContext } from "react";
import getConfig from "next/config";
import { Col, Media, Row } from "reactstrap";
import FavouriteProduceDetail from "../../../../../components/modals/FavouriteProduceBuyer";
import { getFormClient } from "../../../../../services/constants";
import { post } from "../../../../../services/axios";
import { AuthContext } from "../../../../../helpers/auth/AuthContext";
import UserPermissionModal from "../../../../../components/modals/UserPermission";

const { publicRuntimeConfig } = getConfig();
const apiUrl = `${publicRuntimeConfig.API_URL}`;
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`;

const ProduceList = ({
  favourites,
  filter,
  sellers,
  usersProduces,
  pricinglogs,
}) => {
  const authContext = useContext(AuthContext);
  const user = authContext.user;

  const [showDetailsModal, setDetailsModal] = useState(false);
  const [selectedProduce, setSelectedProduce] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);

  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [message, setMessage] = useState("");

  const [followLoading, setFollowLoading] = useState([]);

  // adding seller data to user's produce item
  const produces = usersProduces.map((produce) => {
    const seller_data = sellers.find(
      (s) => s.numeric_id === produce.userISbb_agrix_usersID
    );
    const seller = seller_data ?? null;
    return { ...produce, seller: seller, favourite_id: null };
  });
  // removing favourites produces from users_produces
  const initProduces = [];
  for (let produce of produces) {
    const favourite = favourites.find(
      (f) => f.fav_produceISbb_agrix_users_produceID === produce.numeric_id
    );
    if (!favourite) {
      initProduces.push(produce);
    }
  }

  const initFavourites = favourites.map((favourite) => {
    const user_produce = usersProduces.find(
      (up) => up.numeric_id === favourite.fav_produceISbb_agrix_users_produceID
    );
    const seller_data = sellers.find(
      (s) => s.numeric_id === user_produce.userISbb_agrix_usersID
    );
    const seller = seller_data ?? null;
    return { ...user_produce, seller: seller, favourite_id: favourite._id };
  });

  // the variable for handling the real produces disaplyed via search result
  const [filteredProduces, setFilteredProduces] = useState([]);
  const [favouriteProduces, setFavouriteProduces] = useState([]);

  // the variable for handling the fundamental produces for search
  const [nonFavProduces, setNonFavProduces] = useState([]);
  const [favProduces, setFavProduces] = useState([]);

  useEffect(() => {
    let temp_produces = [...nonFavProduces];
    let temp_favourites = [...favProduces];
    if (filter.country !== "") {
      temp_produces = temp_produces.filter(
        (temp) => temp.seller?.countryISbb_agrix_countriesID === filter.country
      );
      temp_favourites = temp_favourites.filter(
        (temp) => temp.seller?.countryISbb_agrix_countriesID === filter.country
      );
    }
    if (filter.region !== "") {
      temp_produces = temp_produces.filter(
        (temp) => temp.seller?.regionISbb_agrix_countriesID === filter.region
      );
      temp_favourites = temp_favourites.filter(
        (temp) => temp.seller?.regionISbb_agrix_countriesID === filter.region
      );
    }
    if (filter.city !== "") {
      temp_produces = temp_produces.filter(
        (temp) => temp.seller?.cityISbb_agrix_countriesID === filter.city
      );
      temp_favourites = temp_favourites.filter(
        (temp) => temp.seller?.cityISbb_agrix_countriesID === filter.city
      );
    }
    if (filter.produce !== "") {
      temp_produces = temp_produces.filter(
        (temp) =>
          temp.produce_sub_categoryISbb_agrix_produce_typesID === filter.produce
      );
      temp_favourites = temp_favourites.filter(
        (temp) =>
          temp.produce_sub_categoryISbb_agrix_produce_typesID === filter.produce
      );
    }
    if (filter.type !== "") {
      temp_produces = temp_produces.filter(
        (temp) => temp.produce_typeISbb_agrix_produce_typesID === filter.type
      );
      temp_favourites = temp_favourites.filter(
        (temp) => temp.produce_typeISbb_agrix_produce_typesID === filter.type
      );
    }
    // if (filter.month !== "") {
    //   temp_produces = temp_produces.filter(temp=>temp. === filter.month)
    // }
    setFavouriteProduces(temp_favourites);
    setFilteredProduces(temp_produces);

    const loadings = [...temp_favourites, ...temp_produces].map((item) => {
      return false;
    });
    setFollowLoading(loadings);
  }, [filter]);

  useEffect(() => {
    setFavouriteProduces(initFavourites);
    setFavProduces(initFavourites);
    setNonFavProduces(initProduces);

    const loadings = initFavourites.map((item) => {
      return false;
    });
    setFollowLoading(loadings);
  }, []);

  const permissionCheck = (produce) => {
    const existFavourites = favProduces.filter(
      (fp) => fp.userISbb_agrix_usersID === produce.userISbb_agrix_usersID
    );

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
      const isUserAllowed = permissionCheck(produce);
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
        const favourite_item = response.data.item;
        updateProduces(produce, favourite_item);
      } else if (response.data.error) {
        alert(response.data.message);
      }
    } catch (err) {
      alert(err.toString());
    }
  };

  const updateProduces = (produce, favourite_item) => {
    if (produce.favourite_id) {
      const newFavouriteProduces = favouriteProduces.filter(
        (favProd) => favProd._id !== produce._id
      );
      setFavouriteProduces(newFavouriteProduces);
      const newFavProduces = favProduces.filter(
        (favProd) => favProd._id !== produce._id
      );
      setFavProduces(newFavProduces);
      setFilteredProduces([
        ...filteredProduces,
        ...[Object.assign({}, produce, { favourite_id: null })],
      ]);
      setNonFavProduces([
        ...nonFavProduces,
        ...[Object.assign({}, produce, { favourite_id: null })],
      ]);
      setSelectedProduce(Object.assign({}, produce, { favourite_id: null }));
    } else {
      const newNonFavProduces = nonFavProduces.filter(
        (nonFavProd) => nonFavProd._id !== produce._id
      );
      setNonFavProduces(newNonFavProduces);
      const newFilteredProduces = filteredProduces.filter(
        (filteredProd) => filteredProd._id !== produce._id
      );
      setFilteredProduces(newFilteredProduces);
      setFavouriteProduces([
        ...favouriteProduces,
        ...[Object.assign({}, produce, { favourite_id: favourite_item._id })],
      ]);
      setFavProduces([
        ...favProduces,
        ...[Object.assign({}, produce, { favourite_id: favourite_item._id })],
      ]);
      setSelectedProduce(
        Object.assign({}, produce, { favourite_id: favourite_item._id })
      );
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
      <div className="ratio_45 section-b-space">
        <Row className="partition4 mb-2">
          <Col md="12">
            <h5>My Produce</h5>
          </Col>
        </Row>
        <Row>
          {[...favouriteProduces, ...filteredProduces].map((data, idx) => {
            let company_name = "";
            let country_name = "";
            let region_name = "";
            let city_name = "";

            if (data.seller) {
              company_name = data.seller.company ?? "";
              country_name = data.seller.countryISbb_agrix_countriesID_data
                ? data.seller.countryISbb_agrix_countriesID_data.name
                : "";
              region_name = data.seller.regionISbb_agrix_countriesID_data
                ? data.seller.regionISbb_agrix_countriesID_data.name
                : "";
              city_name = data.seller.cityISbb_agrix_countriesID_data
                ? data.seller.cityISbb_agrix_countriesID_data.name
                : "";
            }

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
                ? data.farming_methodISbb_agrix_produce_farming_methodID_data
                    .name
                : "";
            const season_name = data.produce_storage_season
              ? JSON.parse(data.produce_storage_season).join(",")
              : "";

            const pricing = pricinglogs.find(
              (price) =>
                price.produceISbb_agrix_users_produceID === data.numeric_id
            );
            const price = pricing
              ? parseFloat(pricing.priceNUM).toFixed(2)
              : "";

            return (
              <div className="col-md-4 mb-3" key={data._id}>
                <a
                  className="linkCursor"
                  onClick={() => onProduceClicked(data, price)}
                >
                  <div className={`collection-banner`}>
                    <div className="img-part">
                      <Media
                        src={contentsUrl + data.produce_imageISfile}
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
                      <span style={{ fontSize: 18 }}>$ Price: {price}</span>
                      {followLoading[idx] ? (
                        <div
                          style={{
                            marginTop: 10,
                            textAlign: "center",
                          }}
                        >
                          <span
                            className="spinner-border text-success"
                            style={{ width: 30, height: 30 }}
                          ></span>
                        </div>
                      ) : (
                        <div
                          style={{ textAlign: "right", marginTop: 10 }}
                          onClick={(e) => onFollowingClicked(e, data, idx)}
                        >
                          <i
                            className="fa fa-star"
                            aria-hidden="true"
                            style={{ fontSize: 42, marginRight: 10 }}
                          ></i>
                          <br />
                          <span>
                            {data.favourite_id ? "Unfollow" : "Follow"}
                          </span>
                        </div>
                      )}
                    </div>
                    <h5>{company_name}</h5>
                    <h5>
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
      </div>
      <FavouriteProduceDetail
        modal={showDetailsModal}
        onToggle={(showDetailsModal) => setDetailsModal(!showDetailsModal)}
        selectedProduce={selectedProduce}
        selectedPrice={selectedPrice}
        onFollowClicked={onModalFollowClicked}
        pricingLogs={pricinglogs}
        usersProduce={usersProduces}
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

export default ProduceList;
