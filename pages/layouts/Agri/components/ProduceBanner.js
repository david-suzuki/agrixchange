import React, {
  Fragment,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Info from "./modals/InfoModal";
import ProduceGraphical from "../../../../components/modals/ProduceGraphical";
import ProduceSellerSearch from "../../../../components/modals/ProduceSellerSearch";
import getConfig from "next/config";
import { Row, Col } from "reactstrap";
import { AuthContext } from "../../../../helpers/auth/AuthContext";
import { post } from "../../../../services/axios";
import { getFormClient } from "../../../../services/constants";

const { publicRuntimeConfig } = getConfig();
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`;
const apiUrl = `${publicRuntimeConfig.API_URL}`;

const ProduceBanner = ({ produceData, tags, sellers, sellerProduces }) => {
  const caption = produceData ? produceData.name : "";
  const description = "";
  const imagePath = produceData?.main_produce_image01ISfile ?? "";

  const authContext = useContext(AuthContext);
  const user = authContext.user;
  const isAuth = authContext.isAuthenticated;

  const [favouriteId, setFavouriteId] = useState(null);
  const [showInfoModal, setInfoModal] = useState(false);

  const infoForm = () => setInfoModal(!showInfoModal);

  const [showGraphicalModal, setGraphicalModal] = useState(false);

  const [showSearchModal, setSearchModal] = useState(false);

  const sectionStyle = useMemo(
    () => ({
      backgroundPosition: "center center",
      backgroundSize: "cover",
      backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${encodeURI(
        `${contentsUrl}${imagePath ?? ""}`
      )})`,
    }),
    [imagePath]
  );

  useEffect(() => {
    const getUsersFavourites = async () => {
      let formData = getFormClient();
      formData.append("api_method", "list_users_favourites");
      formData.append("userISbb_agrix_usersID", user._id);
      formData.append("get_linked_data", "1");

      try {
        const response = await post(apiUrl, formData);
        if (response.data.message === "SUCCESS") {
          const favourites = response.data.list;
          for (let favourite of favourites) {
            if (favourite.fav_produceISbb_agrix_users_produceID_data) {
              const favouriteProduceId =
                favourite.fav_produceISbb_agrix_users_produceID_data
                  .produce_sub_categoryISbb_agrix_produce_typesID;
              if (favouriteProduceId === produceData.numeric_id)
                setFavouriteId(favouriteProduceId);
            }
          }
        }
      } catch (err) {
        alert(err.toString());
      }
    };

    if (isAuth) getUsersFavourites();
  }, []);

  return (
    <Fragment>
      <section className="category-banner-panel" style={sectionStyle}>
        {tags ? (
          <div className="category-banner-info w-100">
            <h3 className="pb-3">{caption}</h3>
            <div className="mb-3">
              {tags.map((tag) => (
                <span key={tag._id} className="category-banner-tag">
                  {tag.name}
                </span>
              ))}
            </div>
            <Row>
              <Col md="10">
                <p
                  dangerouslySetInnerHTML={{
                    __html: description ?? "",
                  }}
                ></p>
                <ul>
                  <li>
                    <a onClick={infoForm} className="linkCursor">
                      <i className="fa fa-info-circle circle-icon"></i>
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => setGraphicalModal(true)}
                      className="linkCursor"
                    >
                      <i className="fa fa-bar-chart circle-icon"></i>
                    </a>
                  </li>
                  <li>
                    <a className="linkCursor" href="#report">
                      <i className="fa fa-list-alt circle-icon"></i>
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => setSearchModal(true)}
                      className="linkCursor"
                    >
                      <i className="fa fa-user-circle-o circle-icon"></i>
                    </a>
                  </li>
                </ul>
              </Col>
              {user && user.role === "buyer" && (
                <Col md="2">
                  <button
                    className={`btn btn-solid ${
                      favouriteId ? "btn-default-plan" : "btn-gray-plan"
                    } btn-post`}
                    style={{ marginTop: 30 }}
                  >
                    <i className="fa fa-users mr-2" aria-hidden="true"></i>
                    {favouriteId ? "Unfollow" : "Follow"}
                  </button>
                </Col>
              )}
            </Row>
          </div>
        ) : (
          <div className="category-banner-info">
            <h3>{caption}</h3>
            <p
              dangerouslySetInnerHTML={{
                __html: description ?? "",
              }}
            ></p>
            <ul>
              <li>
                <a onClick={infoForm} className="linkCursor">
                  <i className="fa fa-info-circle circle-icon"></i>
                </a>
              </li>
              <li>
                <a
                  onClick={() => setGraphicalModal(true)}
                  className="linkCursor"
                >
                  <i className="fa fa-bar-chart circle-icon"></i>
                </a>
              </li>
              <li>
                <a className="linkCursor" href="#report">
                  <i className="fa fa-list-alt circle-icon"></i>
                </a>
              </li>
              <li>
                <a onClick={() => setSearchModal(true)} className="linkCursor">
                  <i className="fa fa-user-circle-o circle-icon"></i>
                </a>
              </li>
            </ul>
          </div>
        )}
      </section>
      <Info modal={showInfoModal} toggle={infoForm} />
      <ProduceGraphical
        isShow={showGraphicalModal}
        onToggle={() => setGraphicalModal(!showGraphicalModal)}
        produceData={produceData}
      />
      <ProduceSellerSearch
        isShow={showSearchModal}
        onToggle={() => setSearchModal(!showSearchModal)}
        sellers={sellers}
        sellerProduces={sellerProduces}
      />
    </Fragment>
  );
};

export default ProduceBanner;
