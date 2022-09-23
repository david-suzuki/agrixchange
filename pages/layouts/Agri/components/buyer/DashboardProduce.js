import React, { Fragment, useContext } from "react";
import { useRouter } from "next/router";
import { Container, Col, Row, Media } from "reactstrap";
import getConfig from "next/config";
import Link from "next/link";
import NoData from "../NoData/NoData";
import SettingContext from "../../../../../helpers/theme-setting/SettingContext";

const { publicRuntimeConfig } = getConfig();
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`;

const DashboardProduce = ({ producesForBuyer }) => {
  const router = useRouter();

  const settingContext = useContext(SettingContext);
  const produce_types = settingContext.appData.produce_types;

  const produces = producesForBuyer.filter((produce, index) => index < 3);

  const onCreate = () => {
    router.push("/buyer/favourite-produce");
  };

  const onFavouriteProducesBtnClicked = () => {
    router.push("/buyer/favourite-produce");
  };

  return (
    <Container className="mt-4">
      <h5 className="f-w-600 mb-3">My Latest Favourite Produce: </h5>
      {produces.length === 0 ? (
        <NoData
          description="Looks like you have no favourite produce item yet! Click below to discover some."
          createLabel="Explore Produce"
          onCreate={onCreate}
        />
      ) : (
        <Fragment>
          <Row className="partition4">
            {produces.map((produce) => {
              return (
                <Col md="4" className="mb-3" key={produce.numeric_id}>
                  <div className="collection-banner">
                    <div className="img-part">
                      <Media
                        src={
                          produce.fav_produceISbb_agrix_users_produceID_data
                            ? contentsUrl +
                              produce.fav_produceISbb_agrix_users_produceID_data
                                .produce_imageISfile
                            : ""
                        }
                        className="img-fluid-ads"
                        alt=""
                        height="200px"
                        width="260px"
                        style={{ objectFit: "cover", borderRadius: 6 }}
                      />
                    </div>
                  </div>
                  <div className="ourseller-info produce-info">
                    <h5 style={{ fontWeight: "bold" }}>
                      {produce.fav_produceISbb_agrix_users_produceID_data
                        ? produce_types.find(
                            (prod) =>
                              prod.numeric_id ===
                              produce.fav_produceISbb_agrix_users_produceID_data
                                .produce_sub_categoryISbb_agrix_produce_typesID
                          ).name
                        : ""}
                    </h5>
                  </div>
                </Col>
              );
            })}
          </Row>
          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-solid btn-default-plan py-2 px-2"
              onClick={onFavouriteProducesBtnClicked}
            >
              See All Favourite Produces
            </button>
          </div>
        </Fragment>
      )}
    </Container>
  );
};

export default DashboardProduce;
