import React, { useEffect, useState, useContext, useRef } from "react";
import { useRouter } from "next/router";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Input,
  Label,
} from "reactstrap";
import getConfig from "next/config";
import SettingContext from "../../helpers/theme-setting/SettingContext";
import { AuthContext } from "../../helpers/auth/AuthContext";
import { getFormClient } from "../../services/constants";
import { post } from "../../services/axios";
import MultiSeasonSelect from "../../pages/layouts/Agri/components/MultiSeasonSelect";

const { publicRuntimeConfig } = getConfig();
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`;
const apiUrl = `${publicRuntimeConfig.API_URL}`;

const ProduceSellerModal = ({ modal, toggle, caption, selectedProduce }) => {
  const router = useRouter();

  const authContext = useContext(AuthContext);
  const user = authContext.user;

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

  const sizes = settingContext.appData.produce_sizes;
  const sizeOptions = sizes.map((size) => (
    <option value={size.numeric_id} key={size._id}>
      {size.name}
    </option>
  ));

  const [produces, setProduces] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [type, setType] = useState("");
  const [size, setSize] = useState("");
  const [packaging, setPackaging] = useState("");
  const [farming, setFarming] = useState("");
  const [harvestSeasons, setHarvestSeasons] = useState([]);
  const [preHarvestSeasons, setPreHarvestSeasons] = useState([]);
  const [storageSeasons, setStorageSeasons] = useState([]);
  const [preStorageSeasons, setPreStorageSeasons] = useState([]);
  const [unavailableSeasons, setUnavailableSeasons] = useState([]);
  const [preUnavailableSeasons, setPreUnavailableSeasons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [country, setCountry] = useState([]);
  const [regions, setRegions] = useState([]);
  const [region, setRegion] = useState("");
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState("");

  const inputImageFile = useRef(null);
  const imgImageRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [editingImage, setEditingImage] = useState(null);
  const [imageCrop, setImageCrop] = useState();
  const [imageCompletedCrop, setImageCompletedCrop] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageBase64, setImageBase64] = useState("");

  const [suggestionText, setSuggestionText] = useState("");

  useEffect(() => {
    const getProduceTypes = async () => {
      let formData = getFormClient();
      formData.append("api_method", "list_produce_types");

      try {
        const response = await post(apiUrl, formData);
        if (response.data.message === "SUCCESS") {
          setProduces(response.data.list);
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

    getProduceTypes();
    getCountryList();
  }, []);

  useEffect(() => {
    setSuggestionText("");
    if (selectedProduce) {
      if (selectedProduce.produce_imageISfile) {
        const imgUrl = contentsUrl + selectedProduce.produce_imageISfile;
        setImageUrl(imgUrl);
        setBase64FromUrl(imgUrl);
      } else {
        setImageUrl(null);
        setImageBase64(null);
      }
    } else {
      setImageUrl(null);
      setImageBase64("");
      setImageSrc(null);
    }

    if (selectedProduce?.produce_categoryISbb_agrix_produce_typesID) {
      const category_numeric_id =
        selectedProduce.produce_categoryISbb_agrix_produce_typesID;
      const sub_categories = produces.filter(
        (produce) =>
          produce.refers_toISbb_agrix_produce_typesID === category_numeric_id
      );
      setSubCategories(sub_categories);
    } else {
      setSubCategories([]);
    }

    if (selectedProduce?.produce_sub_categoryISbb_agrix_produce_typesID) {
      const subcategory_numeric_id =
        selectedProduce.produce_sub_categoryISbb_agrix_produce_typesID;
      const types = produces.filter(
        (produce) =>
          produce.refers_toISbb_agrix_produce_typesID === subcategory_numeric_id
      );
      setTypes(types);
    } else {
      setTypes([]);
    }

    setCategory(
      selectedProduce?.produce_categoryISbb_agrix_produce_typesID ?? ""
    );
    setSubCategory(
      selectedProduce?.produce_sub_categoryISbb_agrix_produce_typesID ?? ""
    );
    setType(selectedProduce?.produce_typeISbb_agrix_produce_typesID ?? "");
    setCountry(selectedProduce?.countryISbb_agrix_countriesID ?? "");
    setRegions(
      countryList.filter(
        (region) =>
          region.refers_toISbb_agrix_countriesID ===
          selectedProduce?.countryISbb_agrix_countriesID
      )
    );
    setRegion(selectedProduce?.regionISbb_agrix_countriesID ?? "");
    setCities(
      countryList.filter(
        (city) =>
          city.refers_toISbb_agrix_countriesID ===
          selectedProduce?.regionISbb_agrix_countriesID
      )
    );
    setCity(selectedProduce?.cityISbb_agrix_countriesID ?? "");
    setSize(selectedProduce?.sizeISbb_agrix_produce_sizesID ?? "");
    setPackaging(
      selectedProduce?.packagingISbb_agrix_produce_packagingID ?? ""
    );
    setFarming(
      selectedProduce?.farming_methodISbb_agrix_produce_farming_methodID ?? ""
    );
    setPreHarvestSeasons(
      selectedProduce?.produce_harvest_season
        ? JSON.parse(selectedProduce.produce_harvest_season)
        : []
    );
    setPreStorageSeasons(
      selectedProduce?.produce_storage_season
        ? JSON.parse(selectedProduce.produce_storage_season)
        : []
    );
    setPreUnavailableSeasons(
      selectedProduce?.produce_unavaliable_season
        ? JSON.parse(selectedProduce.produce_unavaliable_season)
        : []
    );

    setEditingImage(false);
  }, [selectedProduce]);

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

  const cityOptions = cities.map((city) => (
    <option key={city.numeric_id} value={city.numeric_id}>
      {city.name}
    </option>
  ));

  const subCategoryOptions = subCategories.map((subCategory) => (
    <option key={subCategory.numeric_id} value={subCategory.numeric_id}>
      {subCategory.name}
    </option>
  ));

  const typeOptions = types.map((type) => (
    <option key={type.numeric_id} value={type.numeric_id}>
      {type.name}
    </option>
  ));

  const categories = produces.filter(
    (produce) => produce.refers_toISbb_agrix_produce_typesID === null
  );
  const categoryOptions = categories.map((category) => (
    <option key={category.numeric_id} value={category.numeric_id}>
      {category.name}
    </option>
  ));

  const onCountryChanged = (e) => {
    const numeric_id = e.target.value;
    setCountry(numeric_id);
    const regions = countryList.filter(
      (country) => country.refers_toISbb_agrix_countriesID === numeric_id
    );
    setRegions(regions);
  };

  const onRegionChanged = (e) => {
    const numeric_id = e.target.value;
    setRegion(numeric_id);
    const cities = countryList.filter(
      (country) => country.refers_toISbb_agrix_countriesID === numeric_id
    );
    setCities(cities);
  };

  const onCategoryChanged = (e) => {
    const numeric_id = e.target.value;
    setCategory(numeric_id);
    const subCategories = produces.filter(
      (produce) => produce.refers_toISbb_agrix_produce_typesID === numeric_id
    );
    setSubCategories(subCategories);
  };

  const onSubCategoryChanged = (e) => {
    const numeric_id = e.target.value;
    setSubCategory(numeric_id);
    const types = produces.filter(
      (produce) => produce.refers_toISbb_agrix_produce_typesID === numeric_id
    );
    setTypes(types);
  };

  function handleImageImageLoad(event) {
    imgImageRef.current = event?.currentTarget;

    const { width, height } = event?.currentTarget;
    const crop = centerCrop(
      makeAspectCrop({ unit: "%", width: 90 }, 11 / 6, width, height),
      width,
      height
    );
    setImageCrop(crop);
  }

  function handleSelectImageClick(event) {
    event.preventDefault();
    inputImageFile.current.click();
  }

  async function handleImageEditingDone(_event) {
    setEditingImage(false);
    const imageBlob = await getCroppedImg(
      imgImageRef.current,
      imageCompletedCrop,
      "Image.jpg"
    );
    setImageUrl(URL.createObjectURL(imageBlob));
    const imageBlobToBase64 = await blobToBase64(imageBlob);
    setImageBase64(imageBlobToBase64);
  }

  function handleImageEditingCancel(_event) {
    setEditingImage(null);
    if (selectedProduce?.produce_imageISfile) {
      const imgUrl = contentsUrl + selectedProduce.produce_imageISfile;
      setImageUrl(imgUrl);
    }
    setImageSrc(null);
  }

  function handleSelectImage(event) {
    if (event?.target?.files?.length) {
      setImageCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader?.result?.toString() ?? "");
        setEditingImage(true);
        inputImageFile.current.value = null;
      });
      reader.readAsDataURL(event?.target?.files?.[0]);
    }
  }

  function blobToBase64(blob) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  function getCroppedImg(image, crop, fileName) {
    // let image = this.imageRef;
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = Math.ceil(crop.width * scaleX);
    canvas.height = Math.ceil(crop.height * scaleY);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
      // 250,
      // 250
    );
    // As Base64 string
    // const base64Image = canvas.toDataURL('image/jpeg');
    // As a blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          blob.name = fileName;
          resolve(blob);
        },
        "image/jpeg",
        1
      );
    });
  }

  const [errors, setErrors] = useState({
    category: false,
    sub_category: false,
    country: false,
    region: false,
    size: false,
    packaging: false,
    harvest_season: false,
    storage_season: false,
  });

  const onBlured = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === "category")
      if (value === "") setErrors({ ...errors, category: true });
      else setErrors({ ...errors, category: false });
    if (name === "sub_category")
      if (value === "") setErrors({ ...errors, sub_category: true });
      else setErrors({ ...errors, sub_category: false });
    if (name === "country")
      if (value === "") setErrors({ ...errors, country: true });
      else setErrors({ ...errors, country: false });
    if (name === "region")
      if (value === "") setErrors({ ...errors, region: true });
      else setErrors({ ...errors, region: false });
    if (name === "type")
      if (value === "") setErrors({ ...errors, type: true });
      else setErrors({ ...errors, type: false });
    if (name === "size")
      if (value === "") setErrors({ ...errors, size: true });
      else setErrors({ ...errors, size: false });
    if (name === "packaging")
      if (value === "") setErrors({ ...errors, packaging: true });
      else setErrors({ ...errors, packaging: false });
  };

  const onSaveClicked = async () => {
    if (!category || !subCategory || !country || !region || !size || !packaging)
      return;

    if (harvestSeasons.length === 0) {
      setErrors({ ...errors, harvest_season: true });
      return;
    }

    if (storageSeasons.length === 0) {
      setErrors({ ...errors, storage_season: true });
      return;
    }

    let formData = getFormClient();
    if (selectedProduce) {
      formData.append("api_method", "update_users_produce");
      formData.append("_id", selectedProduce._id);
    } else {
      formData.append("api_method", "add_users_produce");
    }

    formData.append("userISbb_agrix_usersID", user._id);
    formData.append("user_id", user._id);
    formData.append("session_id", user.session_id);
    formData.append("produce_categoryISbb_agrix_produce_typesID", category);
    formData.append(
      "produce_sub_categoryISbb_agrix_produce_typesID",
      subCategory
    );
    formData.append("countryISbb_agrix_countriesID", country);
    formData.append("regionISbb_agrix_countriesID", region);
    if (city) formData.append("cityISbb_agrix_countriesID", city);
    if (type) formData.append("produce_typeISbb_agrix_produce_typesID", type);
    formData.append("sizeISbb_agrix_produce_sizesID", size);
    formData.append("packagingISbb_agrix_produce_packagingID", packaging);
    if (farming)
      formData.append(
        "farming_methodISbb_agrix_produce_farming_methodID",
        farming
      );
    formData.append("produce_harvest_season", JSON.stringify(harvestSeasons));
    formData.append("produce_storage_season", JSON.stringify(storageSeasons));
    if (unavailableSeasons.length > 0) {
      formData.append(
        "produce_unavaliable_season",
        JSON.stringify(unavailableSeasons)
      );
    }
    formData.append("produce_imageISfile", imageBase64);

    try {
      setIsLoading(true);
      const response = await post(apiUrl, formData);
      if (response.data.message === "SUCCESS") {
        toggle(modal);
        router.reload();
      } else if (response.data.error) {
        alert(response.data.message);
      }
      setIsLoading(false);
    } catch (err) {
      alert(err.toString());
    }
  };

  const setBase64FromUrl = (img_url) => {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", img_url, true);
    xhr.responseType = "blob";
    xhr.onload = function (e) {
      var reader = new FileReader();
      reader.onload = function (event) {
        var res = event.target.result;
        setImageBase64(res);
      };
      var file = this.response;
      reader.readAsDataURL(file);
    };
    xhr.send();
  };

  const onHarvestSelected = (list) => {
    setHarvestSeasons([...list]);
    setErrors({ ...errors, harvest_season: false });
  };

  const onHarvestRemoved = (list) => {
    setHarvestSeasons([...list]);
    if (list.length === 0) setErrors({ ...errors, harvest_season: true });
  };

  const onStorageSelected = (list) => {
    setStorageSeasons([...list]);
    setErrors({ ...errors, storage_season: false });
  };

  const onStorageRemoved = (list) => {
    setHarvestSeasons([...list]);
    if (list.length === 0) setErrors({ ...errors, storage_season: true });
  };

  const onSuggestionClicked = async () => {
    let formData = getFormClient();
    formData.append("api_method", "add_suggestion_form");
    formData.append("messageISsmallplaintextbox", suggestionText);
    formData.append("userISbb_agrix_usersID", user._id);

    try {
      const response = await post(apiUrl, formData);
      if (response.data.message === "SUCCESS") {
        setSuggestionText("");
      } else if (response.data.error) {
        alert(response.data.message);
      }
    } catch (err) {
      alert(err.toString());
    }
  };

  return (
    <Modal centered isOpen={modal} toggle={toggle} className="modal-lg">
      <div>
        <ModalHeader toggle={toggle}>{caption}</ModalHeader>
        <ModalBody>
          <section className="ratio_45 section-b-space">
            <form className="needs-validation user-add mx-4" noValidate="">
              <Row>
                <Col md="4" className="mb-3">
                  <Label
                    className={`pl-2 ${errors.category ? "text-danger" : ""}`}
                  >
                    *Produce Catgory
                  </Label>
                  <Input
                    className={errors.category ? "is-invalid" : ""}
                    type="select"
                    name="category"
                    value={category}
                    onChange={onCategoryChanged}
                    onBlur={onBlured}
                  >
                    <option value="" hidden>
                      -Select categories-
                    </option>
                    {categoryOptions}
                  </Input>
                </Col>
                <Col md="4" className="mb-3">
                  <Label
                    className={`pl-2 ${
                      errors.sub_category ? "text-danger" : ""
                    }`}
                  >
                    *Produce Sub Catgory
                  </Label>
                  <Input
                    className={errors.sub_category ? "is-invalid" : ""}
                    type="select"
                    name="sub_category"
                    value={subCategory}
                    onChange={onSubCategoryChanged}
                    onBlur={onBlured}
                  >
                    <option value="" hidden>
                      -Select sub categories-
                    </option>
                    {subCategoryOptions}
                  </Input>
                </Col>
                <Col md="4" className="mb-3">
                  <Label className="pl-2">Type</Label>
                  <Input
                    type="select"
                    name="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    onBlur={onBlured}
                  >
                    <option value="" hidden>
                      -Select types-
                    </option>
                    {typeOptions}
                  </Input>
                </Col>
              </Row>
              <Row>
                <Col md="4" className="mb-3">
                  <Label
                    className={`pl-2 ${errors.country ? "text-danger" : ""}`}
                  >
                    *Country
                  </Label>
                  <Input
                    className={errors.country ? "is-invalid" : ""}
                    type="select"
                    name="country"
                    value={country}
                    onChange={onCountryChanged}
                    onBlur={onBlured}
                  >
                    <option value="" hidden>
                      -Select country-
                    </option>
                    {countryOptions}
                  </Input>
                </Col>
                <Col md="4" className="mb-3">
                  <Label
                    className={`pl-2 ${errors.region ? "text-danger" : ""}`}
                  >
                    *Region
                  </Label>
                  <Input
                    className={errors.region ? "is-invalid" : ""}
                    type="select"
                    name="region"
                    value={region}
                    onChange={onRegionChanged}
                    onBlur={onBlured}
                  >
                    <option value="" hidden>
                      -Select regions-
                    </option>
                    {regionOptions}
                  </Input>
                </Col>
                <Col md="4" className="mb-3">
                  <Label className="pl-2">City</Label>
                  <Input
                    type="select"
                    name="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  >
                    <option value="" hidden>
                      -Select cities-
                    </option>
                    {cityOptions}
                  </Input>
                </Col>
              </Row>
              <Row>
                <Col md="5" className="mb-3">
                  <Label className={`pl-2 ${errors.size ? "text-danger" : ""}`}>
                    *Size
                  </Label>
                  <Input
                    className={errors.size ? "is-invalid" : ""}
                    type="select"
                    name="size"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    onBlur={onBlured}
                  >
                    <option value="" hidden>
                      -Select size-
                    </option>
                    {sizeOptions}
                  </Input>
                </Col>
                <Col md="7" className="mb-3">
                  <Label
                    className={`pl-2 ${errors.packaging ? "text-danger" : ""}`}
                  >
                    *Packaging
                  </Label>
                  <div className="d-flex">
                    <Input placeholder="ex: 10" type="number" />
                    <Input
                      className={`ml-2 ${errors.packaging ? "is-invalid" : ""}`}
                      type="select"
                      name="packaging"
                      value={packaging}
                      onChange={(e) => setPackaging(e.target.value)}
                      onBlur={onBlured}
                    >
                      <option value="" hidden>
                        -Select packaging-
                      </option>
                      {packagingOptions}
                    </Input>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md="5" className="mb-3">
                  <Label className="pl-2">Farming Method</Label>
                  <Input
                    type="select"
                    value={farming}
                    onChange={(e) => setFarming(e.target.value)}
                  >
                    <option value="" hidden>
                      -Select farming method-
                    </option>
                    {farmingOptions}
                  </Input>
                </Col>
              </Row>
              <Row>
                <Col md="4" className="mb-3">
                  <Label
                    className={`pl-2 ${
                      errors.harvest_season ? "text-danger" : ""
                    }`}
                  >
                    *Harvest Season
                  </Label>
                  <MultiSeasonSelect
                    onSelected={onHarvestSelected}
                    onRemoved={onHarvestRemoved}
                    selectedValues={preHarvestSeasons}
                  />
                </Col>
                <Col md="4" className="mb-3">
                  <Label
                    className={`pl-2 ${
                      errors.storage_season ? "text-danger" : ""
                    }`}
                  >
                    *Storage Season
                  </Label>
                  <MultiSeasonSelect
                    onSelected={onStorageSelected}
                    onRemoved={onStorageRemoved}
                    selectedValues={preStorageSeasons}
                  />
                </Col>
                <Col md="4" className="mb-3">
                  <Label className="pl-2">Unavailable Season</Label>
                  <MultiSeasonSelect
                    onSelected={(list) => setUnavailableSeasons([...list])}
                    onRemoved={(list) => setUnavailableSeasons([...list])}
                    selectedValues={preUnavailableSeasons}
                  />
                </Col>
              </Row>
              <Row className="mt-3">
                <Col md="3">
                  <Label className="pl-2">Produce Image</Label>
                </Col>
                {(imageSrc || imageUrl) && (
                  <Col md="4">
                    {editingImage ? (
                      <ReactCrop
                        keepSelection
                        crop={imageCrop}
                        onChange={(crop) => setImageCrop(crop)}
                        onComplete={(crop) => setImageCompletedCrop(crop)}
                        aspect={11 / 6}
                      >
                        <img
                          alt="Image"
                          onLoad={handleImageImageLoad}
                          src={imageSrc}
                          style={{ transform: `scale(1) rotate(0deg)` }}
                        />
                      </ReactCrop>
                    ) : imageUrl ? (
                      <img className="w-100" src={imageUrl} />
                    ) : (
                      ""
                    )}
                  </Col>
                )}
                <input
                  style={{ display: "none" }}
                  ref={inputImageFile}
                  onChange={handleSelectImage}
                  type="file"
                />
                <Col md="3" className="mt-2">
                  {editingImage ? (
                    <div style={{ width: "60%" }}>
                      <button
                        type="button"
                        onClick={handleImageEditingDone}
                        className="btn btn-solid btn-default-plan btn-post w-100"
                      >
                        Crop
                      </button>
                      <button
                        type="button"
                        onClick={handleImageEditingCancel}
                        className="btn btn-solid btn-default-plan btn-post mt-2 w-100"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div style={{ width: "75%" }}>
                      <button
                        type="button"
                        onClick={handleSelectImageClick}
                        className="btn btn-solid btn-default-plan btn-post"
                      >
                        {imageSrc || imageUrl ? "Edit Image" : "Select Image"}
                      </button>
                    </div>
                  )}
                </Col>
              </Row>
              <hr className="suggestion-divider mt-5"></hr>
              <div>
                <Label>
                  Are we missing a produce category/subcategory or type from out
                  options? Drop us a message below and we will look at having it
                  added in to our categories soon.
                </Label>
                <div className="mt-2">
                  <textarea
                    type="text"
                    style={{ width: "100%" }}
                    placeholder="Type your produce suggestion here..."
                    rows="2"
                    value={suggestionText}
                    onChange={(e) => setSuggestionText(e.target.value)}
                  ></textarea>
                </div>
                <button
                  type="button"
                  className="btn btn-solid btn-blue-plan py-1 px-3 mt-2"
                  onClick={onSuggestionClicked}
                >
                  Send
                </button>
              </div>
              <div className="mt-5 d-flex justify-content-center">
                <button
                  type="button"
                  disabled={isLoading}
                  className="btn btn-solid btn-blue-plan py-2 px-3"
                  onClick={onSaveClicked}
                >
                  <span className="px-2">
                    {isLoading ? "Loading..." : "Save"}
                  </span>
                  {isLoading && (
                    <span className="spinner-border spinner-border-sm mr-1"></span>
                  )}
                </button>
              </div>
            </form>
          </section>
        </ModalBody>
      </div>
    </Modal>
  );
};

export default ProduceSellerModal;
