import React, { useState, useEffect } from "react";
import getConfig from "next/config";
import { Col, Input, Row } from "reactstrap";
import SellerFilters from "./SellerFilters";
import { getFormClient } from "../../../../../services/constants";
import { post } from "../../../../../services/axios";

const { publicRuntimeConfig } = getConfig();
const apiUrl = `${publicRuntimeConfig.API_URL}`;

const FavouriteSeller = ({ onFilter }) => {
  const [countryList, setCountryList] = useState([]);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");

  const [seller, setSeller] = useState("");
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");

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

  const categoryOptions = categories.map((category) => (
    <option key={category._id} value={category.numeric_id}>
      {category.name}
    </option>
  ));

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
          const produceTypes = response.data.list;
          const categories = produceTypes.filter(
            (pt) => pt.refers_toISbb_agrix_produce_typesID === null
          );
          setCategories(categories);
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

  const onSearchClicked = () => {
    const filterObj = {
      country,
      region,
      city,
      seller,
      category,
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
              type="text"
              placeholder="Seller name"
              value={seller}
              onChange={(e) => setSeller(e.target.value)}
            ></Input>
          </Col>
          <Col md="3">
            <Input
              type="select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">-Produce Interest-</option>
              {categoryOptions}
            </Input>
          </Col>
          <Col md="3">
            <button
              type="button"
              className="btn btn-solid btn-default-plan btn-post"
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

export default FavouriteSeller;
