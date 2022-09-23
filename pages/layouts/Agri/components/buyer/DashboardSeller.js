import React, { Fragment } from "react";
import { Container, Col, Row, Media } from "reactstrap";
import getConfig from "next/config";
import { useRouter } from "next/router";
import NoData from "../NoData/NoData";

const { publicRuntimeConfig } = getConfig();
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`;

const DashboardSeller = ({ sellersForBuyer, sellers }) => {
  const router = useRouter();
  const sellersFavourite = sellersForBuyer.filter((seller, index) => index < 6);

  const onCreate = () => {
    router.push("/buyer/favourite-seller");
  };

  const onFavouriteSellersClicked = () => {
    router.push("/buyer/favourite-seller");
  };

  return (
    <Container>
      <h5 className="f-w-600 mb-3">My Latest Favourite Sellers: </h5>
      {sellersForBuyer.length === 0 ? (
        <NoData
          description="Looks like you have no favourite sellers yet! Click below to discover some."
          createLabel="Explore Sellers"
          onCreate={onCreate}
        />
      ) : (
        <Fragment>
          <Row className="partition4">
            {sellersFavourite.map((sellerUser) => {
              const seller = sellers.find(
                (item) =>
                  item.numeric_id ===
                  sellerUser.fav_userISbb_agrix_usersID_data?.numeric_id
              );
              const imgUrl = seller?.companylogoISfile
                ? contentsUrl + seller.companylogoISfile
                : "";
              const name = seller?.first_name + " " + seller?.last_name;
              return (
                seller && (
                  <Col md="4" className="mb-3" key={sellerUser.numeric_id}>
                    <div className="collection-banner">
                      <div className="img-part">
                        <Media
                          src={imgUrl}
                          className="img-fluid-ads"
                          alt=""
                          height="200px"
                          width="260px"
                          style={{ objectFit: "cover", borderRadius: 6 }}
                        />
                      </div>
                    </div>
                    <div className="ourseller-info produce-info">
                      <h5 style={{ fontWeight: "bold" }}>{name}</h5>
                    </div>
                  </Col>
                )
              );
            })}
          </Row>
          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-solid btn-default-plan py-2 px-2"
              onClick={onFavouriteSellersClicked}
            >
              See All Favourite Sellers
            </button>
          </div>
        </Fragment>
      )}
    </Container>
  );
};

export default DashboardSeller;
