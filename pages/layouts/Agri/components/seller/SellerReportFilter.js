import React, { Fragment, useState, useEffect } from "react";
import { Container, Col, Input, Row, Label, FormGroup } from "reactstrap";
import { getFormClient } from "../../../../../services/constants";
import { post } from "../../../../../services/axios";

import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const apiUrl = `${publicRuntimeConfig.API_URL}`;

const SellerReportFilter = ({ onFilter, membershipId, onLimited, onCheck }) => {
  const [showDetailsModal, setDetailsModal] = useState(false);

  const [countryList, setCountryList] = useState([]);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");

  const [buyer, setBuyer] = useState("");

  const [checked, setChecked] = useState(membershipId !== "2" ? true : false);

  const countries = countryList.filter(
    (item) => item.refers_toISbb_agrix_countriesID === null
  );
  const countryOptions = countries.map((country) => (
    <option key={country._id} value={country.numeric_id}>
      {country.name}
    </option>
  ));

  const regionOptions = regions.map((region) => (
    <option key={region._id} value={region.numeric_id}>
      {region.name}
    </option>
  ));

  const cityOptions = cities.map((city) => (
    <option key={city._id} value={city.numeric_id}>
      {city.name}
    </option>
  ));

  const onCountryChanged = (e) => {
    const country_numeric_id = e.target.value;
    setCountry(country_numeric_id);

    const regions = countryList.filter(
      (item) => item.refers_toISbb_agrix_countriesID === country_numeric_id
    );
    setRegions(regions);
  };

  const onRegionChanged = (e) => {
    const region_numeric_id = e.target.value;
    setRegion(region_numeric_id);

    const cities = countryList.filter(
      (item) => item.refers_toISbb_agrix_countriesID === region_numeric_id
    );
    setCities(cities);
  };

  const onSearchClicked = () => {
    const filterObj = {
      country,
      region,
      city,
      buyer,
    };
    onFilter(filterObj);
  };

  const onCheckboxChanged = (e) => {
    if (membershipId === "2") onLimited();
    else {
      setChecked(!checked);
      onCheck();
    }
  };

  useEffect(() => {
    const getCountryList = async () => {
      let formData = getFormClient();
      formData.append("api_method", "list_countries");
      try {
        const response = await post(apiUrl, formData);
        if (response.data.message === "SUCCESS") {
          setCountryList(response.data.list);
        } else if (response.data.error) {
          alert(response.data.message);
        }
      } catch (err) {
        alert(err.toString());
      }
    };

    getCountryList();
  }, []);

  return (
    <Fragment>
      <section className="ratio_45 section-b-space">
        <Container>
          <div className="partition4 mb-2">
            <h4>Buyer Filter:</h4>
          </div>
          <form className="needs-validation user-add" noValidate="">
            <Row className="mb-2">
              <Col md="4">
                <Input
                  type="select"
                  name="country"
                  value={country}
                  onChange={onCountryChanged}
                >
                  <option value="">-Select country-</option>
                  {countryOptions}
                </Input>
              </Col>
              <Col md="4">
                <Input
                  type="select"
                  name="region"
                  value={region}
                  onChange={onRegionChanged}
                >
                  <option value="">-Select region-</option>
                  {regionOptions}
                </Input>
              </Col>
              <Col md="4">
                <Input
                  type="select"
                  name="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  <option value="">-Select city-</option>
                  {cityOptions}
                </Input>
              </Col>
            </Row>
            <Row>
              <Col md="4">
                <Input
                  type="text"
                  placeholder="Buyer name"
                  value={buyer}
                  onChange={(e) => setBuyer(e.target.value)}
                ></Input>
              </Col>
              <Col md="3">
                <FormGroup check className="pt-1">
                  <Label check style={{ fontSize: 16 }}>
                    <Input
                      type="checkbox"
                      checked={checked}
                      value={checked}
                      onChange={onCheckboxChanged}
                    />
                    Show Buyers following me
                  </Label>
                </FormGroup>
              </Col>
              <Col md="4">
                <button
                  type="button"
                  disabled={!checked}
                  className="btn btn-solid btn-default-plan btn-post"
                  onClick={onSearchClicked}
                >
                  <i className="fa fa-eye" aria-hidden="true"></i> Search
                </button>
              </Col>
            </Row>
          </form>
        </Container>
      </section>
    </Fragment>
  );
};

export default SellerReportFilter;
