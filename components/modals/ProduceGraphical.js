import React, { useEffect, useState, useContext } from "react";
import Link from "next/link";
import getConfig from "next/config";
import Chart from "react-google-charts";
import {
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  Label,
} from "reactstrap";
import { getFormClient } from "../../services/constants";
import { post } from "../../services/axios";
import SettingContext from "../../helpers/theme-setting/SettingContext";
import MultiSeasonSelect from "../../pages/layouts/Agri/components/MultiSeasonSelect";

const { publicRuntimeConfig } = getConfig();
const apiUrl = `${publicRuntimeConfig.API_URL}`;

let lineChartOptions = {
  title: "Produce vs. Price comparison",
  hAxis: {
    title: "12 Months of the Year",
    textPosition: ["out"],
  },
  vAxis: {
    textPosition: ["in"],
    title: "Price",
  },
  legend: "none",
  curveType: "function",
};

const initGraphData = [
  ["x", "dummy"],
  ["", 0],
];

const ProduceGraphical = ({ isShow, onToggle, produceData }) => {
  const settingContext = useContext(SettingContext);

  const packagings = settingContext.appData.produce_packaging;
  const packagingOptions = packagings.map((packaging) => (
    <option value={packaging.numeric_id} key={packaging._id}>
      {packaging.name}
    </option>
  ));

  const farmings = settingContext.appData.produce_farming_method;
  const farmingOptions = farmings.map((farming) => (
    <option value={farming.numeric_id} key={farming._id}>
      {farming.name}
    </option>
  ));

  const [pricelogs, setPriceLogs] = useState([]);
  const [graphData, setGraphData] = useState(initGraphData);

  const [produces, setProduces] = useState([]);
  const [produce, setProduce] = useState("");
  const [countryList, setCountryList] = useState([]);
  const [country, setCountry] = useState("");
  const [regions, setRegions] = useState([]);
  const [region, setRegion] = useState("");
  const [toPrice, setToPrice] = useState(0);
  const [fromPrice, setFromPrice] = useState(0);
  const [farming, setFarming] = useState("");
  const [packaging, setPackaging] = useState("");
  const [storage, setStorage] = useState([]);

  const [priceRangeError, setPriceRangeError] = useState(false);

  useEffect(() => {
    const getProduceTypes = async () => {
      let formData = getFormClient();
      formData.append("api_method", "list_produce_types");
      try {
        const response = await post(apiUrl, formData);
        if (response.data.message === "SUCCESS") {
          const produceTypes = response.data.list;
          const produces = produceTypes.filter(
            (pt) =>
              pt.refers_toISbb_agrix_produce_typesID === produceData.numeric_id
          );
          setProduces(produces);
        } else if (response.data.error) {
          alert(response.data.message);
        }
      } catch (err) {
        alert(err.toString());
      }
    };

    const getCountryList = async () => {
      let formData = getFormClient();
      formData.append("api_method", "list_countries");

      try {
        const response = await post(apiUrl, formData);
        if (response.data.message === "SUCCESS") {
          setCountryList(response.data.list);
        }
      } catch (err) {
        alert(err.toString());
      }
    };

    const getPriceLogs = async () => {
      let formData = getFormClient();
      formData.append("api_method", "list_users_produce_pricing");

      try {
        const response = await post(apiUrl, formData);
        if (response.data.message === "SUCCESS") {
          setPriceLogs(response.data.list);
        }
      } catch (err) {
        alert(err.toString());
      }
    };

    getProduceTypes();
    getCountryList();
    getPriceLogs();
    setGraphData(initGraphData);
  }, []);

  const produceOptions = produces.map((produce) => (
    <option key={produce.numeric_id} value={produce.numeric_id}>
      {produce.name}
    </option>
  ));

  const countries = countryList.filter(
    (country) => country.refers_toISbb_agrix_countriesID === null
  );
  const countryOptions = countries.map((country) => (
    <option key={country.numeric_id} value={country.numeric_id}>
      {country.name}
    </option>
  ));

  const regionOptions = regions.map((region) => (
    <option key={region.numeric_id} value={region.numeric_id}>
      {region.name}
    </option>
  ));

  const onToggled = () => {
    onToggle();
  };

  const onCountryChanged = (e) => {
    const numeric_id = e.target.value;
    setCountry(numeric_id);
    const regions = countryList.filter(
      (country) => country.refers_toISbb_agrix_countriesID === numeric_id
    );
    setRegions(regions);
  };

  const onStorageFiltered = (produces) => {
    if (storage.length === 0) return produces;

    const filteredProduces = produces.filter((produce) => {
      // exclude the produce with storage_season=null
      if (!produce.produce_storage_season) return false;
      else {
        // get the porduces only that inludes filter-storage in its own storage_season field
        const produceStorages = JSON.parse(produce.produce_storage_season);
        const containsAll = storage.every((element) => {
          return produceStorages.includes(element);
        });
        return containsAll;
      }
    });

    return filteredProduces;
  };

  const onPriceFiltered = (produces) => {
    if (fromPrice === 0 && toPrice === 0) return produces;

    const filteredProduces = produces.filter((produce) => {
      const producePrices = pricelogs.filter(
        (price) =>
          price.produceISbb_agrix_users_produceID === produce.numeric_id
      );
      // if produce has no price logs
      if (producePrices.length === 0) return false;

      // get first priceLog with priceNum that is out of filter-price ranges
      const priceLog = producePrices.find(
        (producePrice) =>
          parseFloat(producePrice.priceNUM) < fromPrice ||
          parseFloat(producePrice.priceNUM) > toPrice
      );

      if (priceLog) return false;

      return true;
    });

    return filteredProduces;
  };

  const calcDays = (month, day, dir, dates) => {
    if (dir === "end") {
      if (month === parseInt(dates[1]))
        return Math.abs(parseInt(dates[2]) - day) + 1;

      if (
        month === 1 ||
        month === 3 ||
        month === 5 ||
        month === 7 ||
        month === 8 ||
        month === 10 ||
        month === 12
      ) {
        return 31 - day + 1;
      } else if (month === 2) {
        return 28 - day + 1;
      } else {
        return 30 - day + 1;
      }
    } else if (dir === "none") {
      if (
        month === 1 ||
        month === 3 ||
        month === 5 ||
        month === 7 ||
        month === 8 ||
        month === 10 ||
        month === 12
      ) {
        return 31;
      } else if (month === 2) {
        return 28;
      } else {
        return 30;
      }
    } else return day;
  };

  const calcGraphData = (produces) => {
    let graphData = [
      [
        "x",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    ];
    for (let produce of produces) {
      const price_logs = pricelogs.filter(
        (price) =>
          price.produceISbb_agrix_users_produceID === produce.numeric_id
      );
      let price_day_2arr = [];
      for (let log of price_logs) {
        let price_day_months = [];
        for (let i = 0; i < 12; i++) {
          price_day_months.push([0, 0]);
        }
        const from_date = log.from_date.split(" ")[0];
        const to_date = log.to_date.split(" ")[0];
        const from_dates = from_date.split("-");
        const to_dates = to_date.split("-");
        const from_month = parseInt(from_dates[1]);
        const to_month = parseInt(to_dates[1]);
        const from_day = parseInt(from_dates[2]);
        const to_day = parseInt(to_dates[2]);
        for (let m = from_month; m <= to_month; m++) {
          if (m === from_month) {
            price_day_months[m - 1] = [
              parseFloat(log.priceNUM),
              calcDays(m, from_day, "end", to_dates),
            ];
          } else if (m === to_month) {
            price_day_months[m - 1] = [
              parseFloat(log.priceNUM),
              calcDays(m, to_day, "start", to_dates),
            ];
          } else {
            price_day_months[m - 1] = [
              parseFloat(log.priceNUM),
              calcDays(m, to_day, "none", to_dates),
            ];
          }
        }
        price_day_2arr.push(price_day_months);
      }

      let produce_price_row = [];
      for (let i = 0; i < 12; i++) {
        let price_sum = 0;
        let days_sum = 0;
        for (let j = 0; j < price_day_2arr.length; j++) {
          price_sum += price_day_2arr[j][i][0] * price_day_2arr[j][i][1];
          days_sum += price_day_2arr[j][i][1];
        }
        const ave_price = days_sum === 0 ? 0 : price_sum / days_sum;
        produce_price_row.push(ave_price);
      }
      produce_price_row.unshift(
        produce.produce_sub_categoryISbb_agrix_produce_typesID_data?.name
      );
      graphData.push(produce_price_row);
    }
    return graphData;
  };

  const onFilterClicked = async () => {
    if (fromPrice > toPrice) {
      setPriceRangeError(true);
      return;
    }

    let formData = getFormClient();
    formData.append("api_method", "list_users_produce");
    formData.append("get_linked_data", "1");
    // if on category screen
    if (produceData.refers_toISbb_agrix_produce_typesID === null) {
      formData.append(
        "produce_categoryISbb_agrix_produce_typesID",
        produceData.numeric_id
      );
      if (produce)
        formData.append(
          "produce_sub_categoryISbb_agrix_produce_typesID",
          produce
        );
      // if on sub-category screen
    } else {
      formData.append(
        "produce_sub_categoryISbb_agrix_produce_typesID",
        produceData.numeric_id
      );
      if (produce)
        formData.append("produce_typeISbb_agrix_produce_typesID", produce);
    }

    if (country) formData.append("countryISbb_agrix_countriesID", country);

    if (region) formData.append("regionISbb_agrix_countriesID", region);

    if (packaging)
      formData.append("packagingISbb_agrix_produce_packagingID", packaging);

    if (farming)
      formData.append(
        "farming_methodISbb_agrix_produce_farming_methodID",
        farming
      );

    try {
      const response = await post(apiUrl, formData);
      if (response.data.message === "SUCCESS") {
        const respData = response.data.list;
        const storageFilteredProduces = onStorageFiltered(respData);
        const priceFilteredProduces = onPriceFiltered(storageFilteredProduces);
        const graphData = calcGraphData(priceFilteredProduces);
        // transposing the array

        const output = graphData[0].map((_, colIndex) =>
          graphData.map((row) => row[colIndex])
        );
        lineChartOptions.legend = "right";
        setGraphData(output);
      }
    } catch (err) {
      alert(err.toString());
    }
  };

  return (
    <Modal centered isOpen={isShow} toggle={onToggled} size="lg">
      <ModalHeader toggle={onToggled}>Graphical Report</ModalHeader>
      <ModalBody className="p-3">
        <form className="needs-validation">
          <Row className="my-1">
            <Col>
              <Input
                type="select"
                name="category"
                value={produce}
                onChange={(e) => setProduce(e.target.value)}
              >
                <option value="">-Select produce-</option>
                {produceOptions}
              </Input>
            </Col>
            <Col>
              <div className="d-flex align-items-center">
                <Label className={priceRangeError ? "text-danger" : ""}>
                  Price Range($):
                </Label>
                <Input
                  className={`w-25 mx-3 ${priceRangeError ? "is-invalid" : ""}`}
                  type="number"
                  value={fromPrice}
                  onChange={(e) => {
                    setFromPrice(e.target.value);
                    setPriceRangeError(false);
                  }}
                />
                <Label> to </Label>
                <Input
                  className={`w-25 mx-3 ${priceRangeError ? "is-invalid" : ""}`}
                  type="number"
                  value={toPrice}
                  onChange={(e) => {
                    setToPrice(e.target.value);
                    setPriceRangeError(false);
                  }}
                />
              </div>
            </Col>
          </Row>
          <Row className="my-1">
            <Col>
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
            <Col>
              <Input
                type="select"
                name="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                <option value="">-Select rgion-</option>
                {regionOptions}
              </Input>
            </Col>
          </Row>
          <Row className="my-1">
            <Col>
              <Input
                type="select"
                name="farming"
                value={farming}
                onChange={(e) => setFarming(e.target.value)}
              >
                <option value="">-Select farming method-</option>
                {farmingOptions}
              </Input>
            </Col>
            <Col>
              <Input
                type="select"
                name="packaging"
                value={packaging}
                onChange={(e) => setPackaging(e.target.value)}
              >
                <option value="">-Select packaging-</option>
                {packagingOptions}
              </Input>
            </Col>
            <Col>
              <MultiSeasonSelect
                onSelected={(list) => setStorage([...list])}
                onRemoved={(list) => setStorage([...list])}
                placeholder="-Select Storage-"
              />
            </Col>
          </Row>
          <div>
            <button
              type="button"
              className="btn btn-solid btn-default-plan py-1 px-3"
              style={{ float: "right" }}
              onClick={onFilterClicked}
            >
              Filter
            </button>
          </div>
        </form>
        <div className="mt-5">
          <Chart
            width="100%"
            height="350px"
            chartType="LineChart"
            loader={<div>Loading Chart</div>}
            data={graphData}
            options={lineChartOptions}
            rootProps={{ "data-testid": "2" }}
          />
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ProduceGraphical;
