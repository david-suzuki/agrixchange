import React, { useState, useEffect, useRef, useContext } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useRouter } from "next/router";
import getConfig from "next/config";
import {
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ListGroup,
  ListGroupItem,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Label,
  Input,
} from "reactstrap";
import { getFormClient } from "../../services/constants";
import { AuthContext } from "../../helpers/auth/AuthContext";
import { post } from "../../services/axios";

const { publicRuntimeConfig } = getConfig();
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`;
const apiUrl = `${publicRuntimeConfig.API_URL}`;

const AdvertSellerModal = ({
  modal,
  onToggle,
  caption,
  selectedPosition,
  selectedAdvert,
  positions,
}) => {
  const router = useRouter();

  const authContext = useContext(AuthContext);
  const user = authContext.user;

  const cropAspect = selectedPosition.name === "Premium" ? 1 / 1 : 16 / 9;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [produceTypes, setProduceTypes] = useState([]);
  const [category, setCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [subcategory, setSubCategory] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const inputImageFile = useRef(null);
  const imgImageRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [editingImage, setEditingImage] = useState(null);
  const [imageCrop, setImageCrop] = useState();
  const [imageCompletedCrop, setImageCompletedCrop] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageBase64, setImageBase64] = useState("");

  const categories = produceTypes.filter(
    (pt) => pt.refers_toISbb_agrix_produce_typesID === null
  );
  const categoryOptions = categories.map((category) => (
    <option key={category._id} value={category.numeric_id}>
      {category.name}
    </option>
  ));

  const subcategoryOptions = subCategories.map((subcategory) => (
    <option key={subcategory._id} value={subcategory.numeric_id}>
      {subcategory.name}
    </option>
  ));

  useEffect(() => {
    if (selectedAdvert) {
      if (selectedAdvert.advert_image01ISfile) {
        const imgUrl = contentsUrl + selectedAdvert.advert_image01ISfile;
        setImageUrl(imgUrl);
        setBase64FromUrl(imgUrl);
      } else {
        setImageUrl(null);
        setImageBase64(null);
      }
      if (selectedAdvert.produce_categoryISbb_agrix_produce_typesID) {
        const category_id =
          selectedAdvert.produce_categoryISbb_agrix_produce_typesID;
        setCategory(category_id);
        const subcategories = produceTypes.filter(
          (pt) => pt.refers_toISbb_agrix_produce_typesID === category_id
        );
        setSubCategories(subcategories);
      } else {
        setCategory("");
        setSubCategories([]);
      }
      if (selectedAdvert.produce_sub_categoryISbb_agrix_produce_typesID) {
        const subcategory_id =
          selectedAdvert.produce_sub_categoryISbb_agrix_produce_typesID;
        setSubCategory(subcategory_id);
      } else {
        setSubCategory("");
      }
    } else {
      setImageUrl(null);
      setImageBase64("");
      setCategory("");
      setSubCategories([]);
      setSubCategory("");
      setEditingImage(false);
    }

    setErrors({});
  }, [selectedAdvert]);

  useEffect(() => {
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
    getProduceTypes();
  }, []);

  const onCategoryChanged = (e) => {
    const categoryId = e.target.value;
    setCategory(categoryId);
    const subcategories = produceTypes.filter(
      (pt) => pt.refers_toISbb_agrix_produce_typesID === categoryId
    );
    setSubCategories(subcategories);
  };

  const onBlured = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === "category")
      if (value === "") setErrors({ ...errors, category: true });
      else setErrors({ ...errors, category: false });
    if (name === "subcategory")
      if (value === "") setErrors({ ...errors, subcategory: true });
      else setErrors({ ...errors, subcategory: false });
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

  function handleImageImageLoad(event) {
    imgImageRef.current = event?.currentTarget;

    const { width, height } = event?.currentTarget;
    const crop = centerCrop(
      makeAspectCrop({ unit: "%", width: 90 }, cropAspect, width, height),
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
    setErrors({ ...errors, advertImage: false });
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
    if (selectedAdvert?.advert_image01ISfile) {
      const imgUrl = contentsUrl + selectedAdvert.advert_image01ISfile;
      setImageUrl(imgUrl);
    }
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

  const onButtonClicked = async (e) => {
    const btnId = e.target.id;

    if (!imageBase64) {
      setErrors({ ...errors, advertImage: true });
      return;
    }

    if (selectedPosition.name === "Standard" && (!category || !subcategory)) {
      return;
    }

    let formData = getFormClient();
    if (selectedAdvert) {
      formData.append("api_method", "update_adverts");
      formData.append("_id", selectedAdvert._id);
    } else {
      formData.append("api_method", "add_adverts");
    }
    formData.append("session_id", user.session_id);
    formData.append("user_id", user._id);
    formData.append("userISbb_agrix_usersID", user._id);

    if (selectedPosition.name === "Standard") {
      formData.append("produce_categoryISbb_agrix_produce_typesID", category);
      formData.append(
        "produce_sub_categoryISbb_agrix_produce_typesID",
        subcategory
      );
    }

    formData.append(
      "positionISbb_agrix_adverts_positionsID",
      selectedPosition._id
    );

    if (btnId === "save_draft")
      formData.append(
        "statusISLIST_Draft_Active_Deactivated_Reactivated_Archived",
        "Draft"
      );
    else
      formData.append(
        "statusISLIST_Draft_Active_Deactivated_Reactivated_Archived",
        "Active"
      );

    formData.append("advert_image01ISfile", imageBase64);

    try {
      setLoading(true);
      const response = await post(apiUrl, formData);
      if (response.data.message === "SUCCESS") {
        router.reload();
      } else if (response.data.error) {
        alert(response.data.message);
      }
      setLoading(false);
    } catch (err) {
      alert(err.toString());
    }
  };

  return (
    <Modal
      centered
      isOpen={modal}
      toggle={onToggle}
      className="modal-lg"
      // style={{ width: "60%" }}
    >
      <ModalHeader toggle={onToggle}>{caption}</ModalHeader>
      <ModalBody className="m-4">
        <Row>
          <Col md="4">
            <div>
              <div className="text-center mb-2" style={{ fontSize: 16 }}>
                Selected Position
              </div>
              <ListGroup>
                {positions.map((position) => (
                  <ListGroupItem
                    key={position._id}
                    color={position._id === selectedPosition._id ? "info" : ""}
                  >
                    {position.name} Position
                  </ListGroupItem>
                ))}
              </ListGroup>
            </div>
            <div style={{ marginTop: 10, marginLeft: 3 }}>
              <span style={{ textTransform: "uppercase" }}>
                subscription total
              </span>
              <span>
                = $ {parseFloat(selectedPosition.priceNUM).toFixed(2)}
              </span>
              <div>
                <span style={{ float: "right" }}>per Month</span>
              </div>
            </div>
          </Col>
          <Col md="5">
            <div>
              <p className="text-center mb-2" style={{ fontSize: 16 }}>
                Produce Image
              </p>
              {errors.advertImage && (
                <p className="text-danger text-center">
                  *Please select image for advert.
                </p>
              )}
              {editingImage ? (
                <ReactCrop
                  keepSelection
                  crop={imageCrop}
                  onChange={(crop) => setImageCrop(crop)}
                  onComplete={(crop) => setImageCompletedCrop(crop)}
                  aspect={cropAspect}
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
              <input
                style={{ display: "none" }}
                ref={inputImageFile}
                onChange={handleSelectImage}
                type="file"
              />
            </div>
          </Col>
          <Col md="3">
            {editingImage ? (
              <div style={{ width: "50%", marginTop: 20 }}>
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
              <div style={{ width: "80%", marginTop: 20 }}>
                <Dropdown
                  isOpen={dropdownOpen}
                  toggle={() => setDropdownOpen(!dropdownOpen)}
                >
                  <DropdownToggle className="btn btn-solid btn-default-plan btn-post border border-success">
                    {imageUrl ? "Edit Advert" : "Select Advert"}
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem onClick={handleSelectImageClick}>
                      Upload Advert Image
                    </DropdownItem>
                    <DropdownItem>Purchase Advert</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            )}
          </Col>
        </Row>
        {selectedPosition.name === "Standard" && (
          <Row className="mt-4">
            <Col md="4">
              <Label className={`pl-2 ${errors.category ? "text-danger" : ""}`}>
                *Produce Catgory
              </Label>
              <Input
                className={errors.category ? "is-invalid" : ""}
                type="select"
                name="category"
                // style={{
                //   borderColor: "#28a745",
                //   borderWidth: 2,
                //   borderRadius: 5,
                // }}
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
            <Col md="4">
              <Label
                className={`pl-2 ${errors.subcategory ? "text-danger" : ""}`}
              >
                *Produce Sub-Catgory
              </Label>
              <Input
                className={errors.subcategory ? "is-invalid" : ""}
                type="select"
                name="subcategory"
                value={subcategory}
                onChange={(e) => setSubCategory(e.target.value)}
                onBlur={onBlured}
              >
                <option value="" hidden>
                  -Select categories-
                </option>
                {subcategoryOptions}
              </Input>
            </Col>
          </Row>
        )}
        <div className="mt-5 d-flex justify-content-center">
          <button
            className="btn btn-solid btn-blue-plan btn-post"
            onClick={onButtonClicked}
            disabled={loading}
            id="make_payment"
          >
            Make Payment
            {loading && (
              <span className="spinner-border spinner-border-sm ml-2"></span>
            )}
          </button>
          <button
            className="btn btn-solid btn-blue-plan btn-post ml-2"
            style={{ width: "15%" }}
            id="save_draft"
            disabled={loading}
            onClick={onButtonClicked}
          >
            Draft
            {loading && (
              <span className="spinner-border spinner-border-sm ml-2"></span>
            )}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default AdvertSellerModal;
