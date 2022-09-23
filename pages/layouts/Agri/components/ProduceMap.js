import React, { useContext, useEffect, useState } from "react";
import { Form, Label, Input, Button, Row, Col } from "reactstrap";
import SettingContext from "../../../../helpers/theme-setting/SettingContext";
import { getFormClient } from "../../../../services/constants";
import { post } from "../../../../services/axios";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const apiUrl = `${publicRuntimeConfig.API_URL}`;

const ProduceMap = ({ categories }) => {
  const settingContext = useContext(SettingContext);
  const seasons = settingContext.appData.produce_seasons;

  const seasonOptions = seasons.map((season) => (
    <option value={season._id} key={season._id}>
      {season.name}
    </option>
  ));

  const [produces, setProduces] = useState([]);
  const [countries, setCountries] = useState([]);

  const countryOptions = countries.map(
    (country) =>
      !country.refers_toISbb_agrix_countriesID && (
        <option value={country._id} key={country._id}>
          {country.name}
        </option>
      )
  );

  const allSubCategories = [];
  for (let category of categories) {
    const subCategories = produces.filter(
      (produce) =>
        produce.refers_toISbb_agrix_produce_typesID === category.numeric_id
    );
    for (let sub of subCategories) {
      allSubCategories.push(sub);
    }
  }

  const subCategoryOptions = allSubCategories.map((subCategory) => (
    <option value={subCategory._id} key={subCategory._id}>
      {subCategory.name}
    </option>
  ));

  const [seasonId, setSeasonId] = useState("");
  const [month, setMonth] = useState("");
  const [countryId, setCountryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [tags, setTags] = useState([]);
  const [tagId, setTagId] = useState("");
  const [company, setCompany] = useState("");

  const onSubCategoryChanged = (e) => {
    const sub_category_id = e.target.value;
    setSubCategoryId(sub_category_id);

    const selectedSubCategory = allSubCategories.find(
      (subCategory) => subCategory._id === sub_category_id
    );
    const tags = produces.filter(
      (produce) =>
        produce.refers_toISbb_agrix_produce_typesID ===
        selectedSubCategory.numeric_id
    );
    setTags(tags);
  };

  const tagOptions = tags.map((tag) => (
    <option value={tag._id} key={tag._id}>
      {tag.name}
    </option>
  ));

  useEffect(() => {
    const getSubCategories = async () => {
      let formData = getFormClient();
      formData.append("api_method", "list_produce_types");

      try {
        const response = await post(apiUrl, formData);
        if (response.data.message === "SUCCESS") {
          setProduces(response.data.list);
        } else if (response.data.error) {
          alert(response.data.message);
        }
      } catch (err) {
        alert(err.toString());
      }
    };

    const getCountries = async () => {
      let formData = getFormClient();
      formData.append("api_method", "list_countries");

      try {
        const response = await post(apiUrl, formData);
        if (response.data.message === "SUCCESS") {
          setCountries(response.data.list);
        } else if (response.data.error) {
          alert(response.data.message);
        }
      } catch (err) {
        alert(err.toString());
      }
    };

    getSubCategories();
    getCountries();
  }, []);

  return (
    <section className="px-3" style={{ marginBottom: 40 }}>
      <h4 className="section-title">Map</h4>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1605.811957341231!2d25.45976406005396!3d36.3940974010114!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1550912388321"
        allowFullScreen
        className="w-100 border-0"
        style={{ height: 400 }}
      ></iframe>
      <Form>
        <Row>
          <Col md="5" className="mt-1">
            <div className="d-flex justify-content-between">
              <Input
                type="select"
                value={subCategoryId}
                onChange={onSubCategoryChanged}
              >
                <option value="" hidden>
                  Sub-Category
                </option>
                {subCategoryOptions}
              </Input>
              <Input
                type="select"
                className="ml-4"
                value={tagId}
                onChange={(e) => setTagId(e.target.value)}
              >
                <option value="0" hidden>
                  Tag
                </option>
                {tagOptions}
              </Input>
            </div>
          </Col>
        </Row>
        <Label className="mt-1">Filter by:</Label>
        <Row>
          <Col md="5" className="mt-1">
            <div className="d-flex justify-content-between">
              <Input
                type="text"
                placeholder="Company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
              <Input
                className="ml-4"
                type="select"
                value={countryId}
                onChange={(e) => setCountryId(e.target.value)}
              >
                <option value="" hidden>
                  Country
                </option>
                {countryOptions}
              </Input>
            </div>
          </Col>
          <Col md="5" className="mt-1">
            <div className="d-flex justify-content-between">
              <Input
                type="select"
                name="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                <option value="" hidden>
                  Month
                </option>
                <option value="1">Jan</option>
                <option value="2">Feb</option>
                <option value="3">Mar</option>
                <option value="4">Apr</option>
                <option value="5">May</option>
                <option value="6">Jun</option>
                <option value="7">Jul</option>
                <option value="8">Aug</option>
                <option value="9">Sep</option>
                <option value="10">Oct</option>
                <option value="11">Nov</option>
                <option value="12">Dec</option>
              </Input>
              <Input
                className="ml-4"
                type="select"
                value={seasonId}
                onChange={(e) => setSeasonId(e.target.value)}
              >
                <option value="" hidden>
                  Season
                </option>
                {seasonOptions}
              </Input>
            </div>
          </Col>
          <Col md="2" className="mt-1">
            <button
              type="button"
              className="btn btn-solid btn-default-plan btn-post"
            >
              <i className="fa fa-search mr-2" aria-hidden="true"></i>
              Filter
            </button>
          </Col>
        </Row>
      </Form>
    </section>
  );
};

export default ProduceMap;
