import React, { useRef, useState, useContext } from "react";
import isWithinInterval from "date-fns/isWithinInterval";
import compareAsc from "date-fns/compareAsc";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_green.css";
import {
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  Label,
  Form,
} from "reactstrap";
import { AuthContext } from "../../helpers/auth/AuthContext";
import { getFormClient } from "../../services/constants";
import { post } from "../../services/axios";
import { useRouter } from "next/router";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const apiUrl = `${publicRuntimeConfig.API_URL}`;

const PriceSellerModal = ({
  modal,
  toggle,
  producesForSeller,
  produces,
  pricinglogs,
}) => {
  const router = useRouter();

  const authContext = useContext(AuthContext);
  const user = authContext.user;

  const types = [];

  const linkedProduceOptions = producesForSeller.map((produce) => {
    const linked_produce = produces.find(
      (prod) =>
        prod.numeric_id ===
        produce.produce_sub_categoryISbb_agrix_produce_typesID
    );
    const type = produces.find(
      (prod) =>
        prod.numeric_id === produce.produce_typeISbb_agrix_produce_typesID
    );
    types.push({ linked_produce_id: produce.numeric_id, type: type });
    return (
      <option key={produce._id} value={produce.numeric_id}>
        {linked_produce.name}
      </option>
    );
  });

  const [isLoading, setIsLoading] = useState(false);
  const [toDate, setToDate] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [linkedProduce, setLinkedProduce] = useState("");
  const [type, setType] = useState("");
  const [priceNum, setPriceNum] = useState(0);

  const inputImageFile = useRef(null);
  const imgImageRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [editingImage, setEditingImage] = useState(null);
  const [imageCrop, setImageCrop] = useState();
  const [imageCompletedCrop, setImageCompletedCrop] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageBase64, setImageBase64] = useState("");

  const [errors, setErrors] = useState({
    linked_produces: false,
    price: false,
    fromDate: false,
    toDate: false,
  });

  const onLinkedProduceChanged = (e) => {
    const produce_id = e.target.value;
    setLinkedProduce(produce_id);

    const type = types.find((t) => t.linked_produce_id === produce_id);
    if (type)
      if (type.type) setType(type?.type?.name);
      else setType("");
    else setType("");
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
    setImageUrl(null);
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

  const onBlured = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === "linked_produces")
      if (value === "") setErrors({ ...errors, linked_produces: true });
      else setErrors({ ...errors, linked_produces: false });
    if (name === "price")
      if (value <= 0) setErrors({ ...errors, price: true });
      else setErrors({ ...errors, price: false });
  };

  const validateDateRange = (date) => {
    const targetDate = date[0]?.toISOString().split("T")[0];
    const targetDates = targetDate.split("-");
    if (!linkedProduce) return false;

    const producePrices = pricinglogs.filter(
      (price) => price.produceISbb_agrix_users_produceID === linkedProduce
    );

    const pricinglog = producePrices.find((price) => {
      const from_date = price.from_date.split(" ")[0];
      const to_date = price.to_date.split(" ")[0];

      const from_dates = from_date.split("-");
      const to_dates = to_date.split("-");

      const isInDates = isWithinInterval(
        new Date(
          parseInt(targetDates[0]),
          parseInt(targetDates[1]) - 1,
          parseInt(targetDates[2])
        ),
        {
          start: new Date(
            parseInt(from_dates[0]),
            parseInt(from_dates[1]) - 1,
            parseInt(from_dates[2])
          ),
          end: new Date(
            parseInt(to_dates[0]),
            parseInt(to_dates[1]) - 1,
            parseInt(to_dates[2])
          ),
        }
      );

      return isInDates;
    });

    if (pricinglog) return false;
    return true;
  };

  const validateFromDate = (date) => {
    const targetDate = date[0]?.toISOString().split("T")[0];
    const targetDates = targetDate.split("-");

    if (!toDate[0]) return true;

    const toDateStr = toDate[0]?.toISOString().split("T")[0];
    const toDates = toDateStr.split("-");

    const result = compareAsc(
      new Date(
        parseInt(targetDates[0]),
        parseInt(targetDates[1]) - 1,
        parseInt(targetDates[2])
      ),
      new Date(
        parseInt(toDates[0]),
        parseInt(toDates[1]) - 1,
        parseInt(toDates[2])
      )
    );
    if (result === 1) return false;
    return true;
  };

  const validateToDate = (date) => {
    const targetDate = date[0]?.toISOString().split("T")[0];
    const targetDates = targetDate.split("-");

    if (!fromDate[0]) return true;

    const fromDateStr = fromDate[0]?.toISOString().split("T")[0];
    const fromDates = fromDateStr.split("-");

    const result = compareAsc(
      new Date(
        parseInt(targetDates[0]),
        parseInt(targetDates[1]) - 1,
        parseInt(targetDates[2])
      ),
      new Date(
        parseInt(fromDates[0]),
        parseInt(fromDates[1]) - 1,
        parseInt(fromDates[2])
      )
    );
    if (result === -1) return false;
    return true;
  };

  const onFromDateClosed = (value) => {
    if (value.length === 0) setErrors({ ...errors, fromDate: true });
    else {
      const isValidRange = validateDateRange(value);
      const isValidFrom = validateFromDate(value);
      if (isValidRange && isValidFrom)
        setErrors({ ...errors, fromDate: false });
      else setErrors({ ...errors, fromDate: true });
    }
  };

  const onToDateClosed = (value) => {
    if (value.length === 0) setErrors({ ...errors, toDate: true });
    else {
      const isValidRange = validateDateRange(value);
      const isValidTo = validateToDate(value);
      if (isValidRange && isValidTo) setErrors({ ...errors, toDate: false });
      else setErrors({ ...errors, toDate: true });
    }
  };

  const onSaveClicked = async () => {
    const fromDateStr = fromDate[0]?.toISOString().split("T")[0];
    const toDateStr = toDate[0]?.toISOString().split("T")[0];

    if (
      !linkedProduce ||
      !priceNum ||
      !fromDateStr ||
      !toDateStr ||
      errors.price ||
      errors.fromDate ||
      errors.toDate
    )
      return;

    let formData = getFormClient();
    formData.append("api_method", "add_users_produce_pricing");
    formData.append("session_id", user.session_id);
    formData.append("user_id", user._id);
    formData.append("produceISbb_agrix_users_produceID", linkedProduce);
    formData.append("priceNUM", priceNum);
    formData.append("from_date", fromDateStr);
    formData.append("to_date", toDateStr);
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

  return (
    <Modal centered className="modal-lg mt-3" isOpen={modal} toggle={toggle}>
      <ModalHeader toggle={toggle}>Add New Price Item</ModalHeader>
      <ModalBody>
        <section className="ratio_45 section-b-space">
          <Form className="needs-validation produce-add mx-4" noValidate="">
            <Row>
              <Col md="4">
                <Label className={errors.linked_produces ? "text-danger" : ""}>
                  *Linked Produce:
                </Label>
              </Col>
              <Col md="7">
                <Input
                  className={errors.linked_produces ? "is-invalid" : ""}
                  type="select"
                  name="linked_produces"
                  value={linkedProduce}
                  onChange={onLinkedProduceChanged}
                  onBlur={onBlured}
                >
                  <option value="" hidden>
                    -Select produce-
                  </option>
                  {linkedProduceOptions}
                </Input>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md="4">
                <Label>*Type:</Label>
              </Col>
              <Col md="7">
                <Input type="text" disabled value={type}></Input>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md="4">
                <Label className={errors.price ? "text-danger" : ""}>
                  *Price(US$(FOB)):
                </Label>
              </Col>
              <Col md="7">
                <Input
                  className={errors.price ? "is-invalid" : ""}
                  type="number"
                  name="price"
                  value={priceNum}
                  onChange={(e) => setPriceNum(e.target.value)}
                  onBlur={onBlured}
                ></Input>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md="4">
                <Label
                  className={
                    errors.fromDate || errors.toDate ? "text-danger" : ""
                  }
                >
                  *Date Range for Availability:
                </Label>
              </Col>
              <Col md="7" className="d-flex jsutify-content-between flatpickr">
                <Flatpickr
                  className={`form-control ${
                    errors.fromDate ? "is-invalid" : ""
                  }`}
                  value={fromDate}
                  onChange={(date) => setFromDate(date)}
                  options={{ onClose: onFromDateClosed }}
                />
                <Flatpickr
                  className={`form-control ml-3 ${
                    errors.toDate ? "is-invalid" : ""
                  }`}
                  value={toDate}
                  onChange={(date) => setToDate(date)}
                  options={{ onClose: onToDateClosed }}
                />
              </Col>
            </Row>
            <Row className="mt-4">
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
              <Col md="4" className="mt-2">
                {editingImage ? (
                  <div style={{ width: "40%" }}>
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
                      className="btn btn-solid btn-default-plan btn-post w-100 mt-2"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div style={{ width: "55%" }}>
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
            <div className="mt-5 d-flex justify-content-center">
              <button
                type="button"
                onClick={onSaveClicked}
                disabled={isLoading}
                className="btn btn-solid btn-blue-plan px-3 py-2"
              >
                <span className="px-2">
                  {isLoading ? "Loading..." : "Save"}
                </span>
                {isLoading && (
                  <span className="spinner-border spinner-border-sm mr-1"></span>
                )}
              </button>
            </div>
          </Form>
        </section>
      </ModalBody>
    </Modal>
  );
};

export default PriceSellerModal;
