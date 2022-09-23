import React, { useContext } from "react";
import { Button, Container, Col, Row, Media } from "reactstrap";
import getConfig from "next/config";
import SettingContext from "../../../../../helpers/theme-setting/SettingContext";
import { isWithinInterval } from "date-fns";
import { seasonOptions } from "../../../../../services/constants";

const { publicRuntimeConfig } = getConfig();
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`;

const MyProduce = ({ producesForSeller, pricelogs, onEdit, onDelete }) => {
  const settingContext = useContext(SettingContext);
  const seasons = settingContext.appData.produce_seasons;
  const packagings = settingContext.appData.produce_packaging;
  const farmings = settingContext.appData.produce_farming_method;
  const sizes = settingContext.appData.produce_sizes;

  let priceLogsForSeller = [];
  for (let produce of producesForSeller) {
    const priceLogsForProduce = pricelogs.filter(
      (log) => log.produceISbb_agrix_users_produceID === produce.numeric_id
    );
    priceLogsForSeller = [...priceLogsForSeller, ...priceLogsForProduce];
  }
  let reversedPrices = priceLogsForSeller.reverse();

  const isInDateRange = (from, to) => {
    const nowDate = new Date();
    let text = nowDate.toISOString();
    const currentDate = text.split("T")[0];
    const currentYear = parseInt(currentDate.split("-")[0]);
    const currentMonth = parseInt(currentDate.split("-")[1]);
    const currentDay = parseInt(currentDate.split("-")[2]);

    const fromDate = from.split(" ")[0];
    const fromYear = parseInt(fromDate.split("-")[0]);
    const fromMonth = parseInt(fromDate.split("-")[1]);
    const fromDay = parseInt(fromDate.split("-")[2]);

    const toDate = to.split(" ")[0];
    const toYear = parseInt(toDate.split("-")[0]);
    const toMonth = parseInt(toDate.split("-")[1]);
    const toDay = parseInt(toDate.split("-")[2]);

    return isWithinInterval(
      new Date(currentYear, currentMonth - 1, currentDay),
      {
        start: new Date(fromYear, fromMonth - 1, fromDay),
        end: new Date(toYear, toMonth, toDay),
      }
    );
  };

  return (
    <Container>
      <Row className="partition4">
        {producesForSeller.map((produce) => {
          const price = reversedPrices.find(
            (p) => p.produceISbb_agrix_users_produceID === produce.numeric_id
          );
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
                <div className="pull-right">
                  <Button
                    className="btn btn-solid btn-red-border btn-red-plan p-1 mx-1"
                    onClick={() => onDelete(produce)}
                  >
                    Delete
                  </Button>
                  <Button
                    className="btn btn-solid btn-blue-border btn-blue-plan p-1 mx-1"
                    onClick={() => onEdit(produce)}
                  >
                    Edit
                  </Button>
                </div>
                <h5 style={{ fontWeight: "bold" }}>
                  {
                    produce.produce_sub_categoryISbb_agrix_produce_typesID_data
                      ?.name
                  }
                </h5>
                <h5>
                  Price: $ {price ? parseFloat(price.priceNUM).toFixed(2) : ""}
                  <i className="fa fa-lock" aria-hidden="true"></i>
                </h5>
                <h5>
                  Validity:{" "}
                  {price && isInDateRange(price.from_date, price.to_date)
                    ? "Yes"
                    : "No"}
                </h5>
                <h5>
                  Location:{" "}
                  {(produce.countryISbb_agrix_countriesID_data
                    ? produce.countryISbb_agrix_countriesID_data.name
                    : "") +
                    " " +
                    (produce.regionISbb_agrix_countriesID_data
                      ? produce.regionISbb_agrix_countriesID_data.name
                      : "") +
                    " " +
                    (produce.cityISbb_agrix_countriesID_data
                      ? produce.cityISbb_agrix_countriesID_data.name
                      : "")}
                </h5>
                <h6>
                  Type:{" "}
                  {produce.produce_typeISbb_agrix_produce_typesID_data?.name}
                </h6>
                <h6>
                  Size:{" "}
                  {
                    sizes.find(
                      (size) =>
                        size.numeric_id ===
                        produce.sizeISbb_agrix_produce_sizesID
                    )?.name
                  }
                </h6>
                <h6>
                  Packaging:{" "}
                  {
                    packagings.find(
                      (packaging) =>
                        packaging.numeric_id ===
                        produce.packagingISbb_agrix_produce_packagingID
                    )?.name
                  }
                </h6>
                <h6>
                  Farming Method:{" "}
                  {
                    farmings.find(
                      (farming) =>
                        farming.numeric_id ===
                        produce.farming_methodISbb_agrix_produce_farming_methodID
                    )?.name
                  }
                </h6>
                <h6>
                  Season:{" "}
                  {produce.produce_storage_season
                    ? JSON.parse(produce.produce_storage_season).join(",")
                    : ""}
                </h6>
              </div>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default MyProduce;
