import React, { useEffect, useState } from "react";
import { Container, Col, Media, Row } from "reactstrap";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`;

const SellerReportList = ({
  followings,
  filter,
  buyers,
  onBuyerSelected,
  isShowList,
}) => {
  const reportFollowings = followings.map((following) => {
    return buyers.find(
      (buyer) => buyer.numeric_id === following.userISbb_agrix_usersID
    );
  });

  const [filteredFollowings, setFilteredFollowings] =
    useState(reportFollowings);

  useEffect(() => {
    let temp_followings = [...reportFollowings];
    if (filter.country) {
      temp_followings = temp_followings.filter(
        (temp) => temp.countryISbb_agrix_countriesID === filter.country
      );
    }
    if (filter.region) {
      temp_followings = temp_followings.filter(
        (temp) => temp.regionISbb_agrix_countriesID === filter.region
      );
    }
    if (filter.city) {
      temp_followings = temp_followings.filter(
        (temp) => temp.cityISbb_agrix_countriesID === filter.city
      );
    }
    if (filter.buyer) {
      temp_followings = temp_followings.filter(
        (temp) =>
          temp.first_name === filter.buyer || temp.last_name === filter.buyer
      );
    }
    setFilteredFollowings(temp_followings);
  }, [filter]);

  return (
    <div className="ratio_45 section-b-space">
      {isShowList && (
        <Container>
          <div className="partition4 mb-2">
            <h4>Buyers</h4>
          </div>
          <Row>
            {filteredFollowings.map((data, i) => {
              const country_name = data.countryISbb_agrix_countriesID_data
                ? data.countryISbb_agrix_countriesID_data.name
                : "";
              const region_name = data.regionISbb_agrix_countriesID_data
                ? data.regionISbb_agrix_countriesID_data.name
                : "";
              const city_name = data.cityISbb_agrix_countriesID_data
                ? data.cityISbb_agrix_countriesID_data.name
                : "";

              return (
                <div className="col-md-4 mb-3" key={data.numeric_id}>
                  <a
                    className="linkCursor"
                    onClick={() => onBuyerSelected(data)}
                  >
                    <div className="collection-banner">
                      <div className="img-part">
                        <Media
                          src={contentsUrl + data.companylogoISfile}
                          className="img-fluid-ads"
                          height="200px"
                          width="280px"
                          style={{ objectFit: "cover", borderRadius: 6 }}
                        />
                      </div>
                      <div className="contain-banner ourseller-banner">
                        <h4>{data.first_name + " " + data.last_name}</h4>
                      </div>
                    </div>
                    <div className="ourseller-info produce-info">
                      <h5>Company: {data.company ?? ""}</h5>
                      <h6>
                        Location:{" "}
                        {country_name + " " + region_name + " " + city_name}
                      </h6>
                    </div>
                  </a>
                </div>
              );
            })}
          </Row>
        </Container>
      )}
    </div>
  );
};

export default SellerReportList;
