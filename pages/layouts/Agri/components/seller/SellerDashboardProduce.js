import React, { Fragment } from "react";
import { useRouter } from "next/router";
import { Container, Col, Row, Media } from "reactstrap";
import getConfig from "next/config";
import NoData from "../NoData/NoData";

const { publicRuntimeConfig } = getConfig();
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`;

const SellerDashboardProduce = ({ producesForSeller }) => {
  const router = useRouter();
  const produces = producesForSeller.filter((produce, index) => index < 3);

  const onCreate = () => {
    router.push("/seller/produce");
  };

  const onProducesBtnClicked = () => {
    router.push("/seller/produce");
  };

  return (
    <Container className="mt-4">
      <h5 className="f-w-600 mb-3">My Latest Added Produce: </h5>
      {produces.length === 0 ? (
        <NoData
          description="Looks like you have not added a produce item yet! Click below to start."
          createLabel="Add Produce Item"
          onCreate={onCreate}
        />
      ) : (
        <Fragment>
          <Row className="partition4">
            {produces.map((produce) => {
              // const isValidate = priceisInDateRange(price.from_date, price.to_date)
              return (
                <Col md="4" className="mb-3" key={produce.numeric_id}>
                  <div className="collection-banner">
                    <div className="img-part">
                      <Media
                        src={contentsUrl + produce.produce_imageISfile}
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
                      {
                        produce
                          .produce_sub_categoryISbb_agrix_produce_typesID_data
                          ?.name
                      }
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
              onClick={onProducesBtnClicked}
            >
              See All Produces
            </button>
          </div>
        </Fragment>
      )}
    </Container>
  );
};

export default SellerDashboardProduce;
