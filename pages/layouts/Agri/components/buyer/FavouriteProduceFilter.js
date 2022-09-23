import React, { useState, useEffect } from "react";
import getConfig from "next/config";
import { Col, Input, Row } from "reactstrap";
import { getFormClient } from "../../../../../services/constants";
import { post } from "../../../../../services/axios";

const { publicRuntimeConfig } = getConfig();
const apiUrl = `${publicRuntimeConfig.API_URL}`;

const FavouriteProduceFilter = ({ onFilter }) => {
  const [countryList, setCountryList] = useState([]);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");

  const [produceTypes, setProduceTypes] = useState([]);
  const [produce, setProduce] = useState("");
  const [types, setTypes] = useState([]);
  const [type, setType] = useState("");

  const [month, setMonth] = useState("");

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

    const getProduceTypes = async () => {
      let formData = getFormClient();
      formData.append("api_method", "list_produce_types");
      try {
        const response = await post(apiUrl, formData);
        if (response.data.message === "SUCCESS") {
          setProduceTypes(response.data.list);
        } else if (response.data.error) {
          alert(response.data.message);
        }
      } catch (err) {
        alert(err.toString());
      }
    };

    getCountryList();
    getProduceTypes();
  }, []);

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

  const categories = produceTypes.filter(
    (pt) => pt.refers_toISbb_agrix_produce_typesID === null
  );
  let produces = [];
  for (let category of categories) {
    const sub_categories = produceTypes.filter(
      (pt) => pt.refers_toISbb_agrix_produce_typesID === category.numeric_id
    );
    produces = [...produces, ...sub_categories];
  }

  const produceOptions = produces.map((prod) => (
    <option key={prod._id} value={prod.numeric_id}>
      {prod.name}
    </option>
  ));

  const typeOptions = types.map((type) => (
    <option key={type._id} value={type.numeric_id}>
      {type.name}
    </option>
  ));

  const onProduceChanged = (e) => {
    const produce_id = e.target.value;
    setProduce(produce_id);

    const types = produceTypes.filter(
      (pt) => pt.refers_toISbb_agrix_produce_typesID === produce_id
    );
    setTypes(types);
  };

  const onSearchClicked = () => {
    const filterObj = {
      country,
      region,
      city,
      produce,
      type,
      month,
    };
    onFilter(filterObj);
  };

  return (
    <section className="ratio_45 section-b-space">
      <form className="needs-validation user-add" noValidate="">
        <Row className="mb-2">
          <Col md="3">
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
          <Col md="3">
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
          <Col md="3">
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
          <Col md="3">
            <Input
              type="select"
              name="produce"
              value={produce}
              onChange={onProduceChanged}
            >
              <option value="">-Select produce-</option>
              {produceOptions}
            </Input>
          </Col>
          <Col md="3">
            <Input
              type="select"
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">-Select type-</option>
              {typeOptions}
            </Input>
          </Col>
          <Col md="3">
            <Input
              type="select"
              name="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              <option value="">-Select month-</option>
              <option value="1">January</option>
              <option value="2">Feburary</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">August</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </Input>
          </Col>
          <Col md="3">
            <button
              type="button"
              className="btn btn-solid btn-default-plan btn-post mt-1"
              onClick={onSearchClicked}
            >
              <i className="fa fa-eye" aria-hidden="true"></i> Search
            </button>
          </Col>
        </Row>
      </form>
    </section>
  );
};

export default FavouriteProduceFilter;
