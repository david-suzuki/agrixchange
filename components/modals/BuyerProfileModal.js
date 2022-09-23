import React, { useContext, useState, useRef, useEffect } from "react";
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
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { NavDropdown } from "react-bootstrap";
import { AuthContext } from "../../helpers/auth/AuthContext";
import { getFormClient } from "../../services/constants";
import { post } from "../../services/axios";

const { publicRuntimeConfig } = getConfig();
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`;
const apiUrl = `${publicRuntimeConfig.API_URL}`;

const BuyerProfileForm = ({ modal, toggle }) => {
  const authContext = useContext(AuthContext);
  const user = authContext.user;

  const [isLoading, setIsLoading] = useState(false);

  const [company, setCompany] = useState(user.company ?? "");
  const [websiteUrl, setWebsiteUrl] = useState(user.website_url ?? "");
  const [companyDescription, setCompanyDescription] = useState(
    user.companydescriptionISsmallplaintextbox ?? ""
  );
  const [companySummary, setCompanySummary] = useState(
    user.companysummaryISsmallplaintextbox ?? ""
  );

  const inputLogoFile = useRef(null);
  const imgLogoRef = useRef(null);

  const [logoSrc, setLogoSrc] = useState(null);
  const [editingLogo, setEditingLogo] = useState(null);
  const [logoCrop, setLogoCrop] = useState();
  const [logoCompletedCrop, setLogoCompletedCrop] = useState(null);
  const [logoBlob, setLogoBlob] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);

  const [errors, setErrors] = useState(false);

  useEffect(() => {
    if (user.companylogoISfile)
      setLogoUrl(encodeURI(`${contentsUrl}${user.companylogoISfile}`));
  }, []);

  const onWebsiteUrlChanged = (e) => {
    setWebsiteUrl(e.target.value);
    setErrors(false);
  };

  const validURL = (str) => {
    var pattern = new RegExp(
      "^(http(s)?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(str);
  };

  const onSaveClicked = async () => {
    // vlidation for website url
    const isValidUrl = validURL(websiteUrl);
    if (!isValidUrl) {
      setErrors(true);
      return;
    }

    let formData = getFormClient();
    formData.append("api_method", "update_profile");
    formData.append("user_id", user._id);
    formData.append("session_id", user.session_id);
    formData.append("companysummaryISsmallplaintextbox", companySummary);
    formData.append(
      "companydescriptionISsmallplaintextbox",
      companyDescription
    );
    formData.append("website_url", websiteUrl);
    formData.append("company", company);

    if (logoBlob) {
      const logoBlobToBase64 = await blobToBase64(logoBlob);
      formData.append("companylogoISfile", logoBlobToBase64);
    }

    try {
      setIsLoading(true);
      const response = await post(apiUrl, formData);
      if (response.data.message === "SUCCESS") {
        const userInfo = response.data.data;
        localStorage.setItem("user", JSON.stringify(userInfo));
        const onAuth = authContext.onAuth;
        onAuth(userInfo, true);
        toggle(modal);
      } else if (response.data.error) {
        alert(response.data.message);
      }
      setIsLoading(false);
    } catch (err) {
      alert(err.toString());
    }
  };

  function handleLogoImageLoad(event) {
    imgLogoRef.current = event?.currentTarget;

    const { width, height } = event?.currentTarget;
    const crop = centerCrop(
      makeAspectCrop({ unit: "%", width: 90 }, 11 / 6, width, height),
      width,
      height
    );
    setLogoCrop(crop);
  }

  function handleSelectLogoClick(event) {
    event.preventDefault();
    inputLogoFile.current.click();
  }

  async function handleLogoEditingDone(_event) {
    setEditingLogo(false);
    const logoBlob = await getCroppedImg(
      imgLogoRef.current,
      logoCompletedCrop,
      "logo.jpg"
    );
    setLogoBlob(logoBlob);
  }

  function handleLogoEditingCancel(_event) {
    setEditingLogo(null);
    setLogoBlob(null);
  }

  function handleSelectLogo(event) {
    if (event?.target?.files?.length) {
      setLogoCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setLogoSrc(reader?.result?.toString() ?? "");
        setEditingLogo(true);
        inputLogoFile.current.value = null;
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

  return (
    <Modal
      centered
      isOpen={modal}
      toggle={toggle}
      size="lg"
      style={{ marginTop: 7 }}
    >
      <ModalHeader toggle={toggle}>Create your Buyer Profile Page</ModalHeader>
      <ModalBody className="mx-3">
        <section className="ratio_45 section-b-space">
          <form className="needs-validation user-add" noValidate="">
            <Row className="mb-3">
              <Col md="3">
                <Label className="pl-2">Company Name</Label>
              </Col>
              <Col md="5">
                <Input
                  name="company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md="3">
                <Label className="pl-2">Company Summary</Label>
              </Col>
              <Col md="8">
                <textarea
                  className="mb-0"
                  rows="3"
                  maxLength="200"
                  placeholder="200 characters"
                  value={companySummary}
                  onChange={(e) => setCompanySummary(e.target.value)}
                ></textarea>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md="3">
                <Label className="pl-2">Company Description</Label>
              </Col>
              <Col md="8">
                <textarea
                  className="form-control mb-0"
                  rows="4"
                  maxLength="500"
                  placeholder="500 characters"
                  value={companyDescription}
                  onChange={(e) => setCompanyDescription(e.target.value)}
                ></textarea>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md="3">
                <Label className="pl-2">Website URL</Label>
              </Col>
              <Col md="5">
                {errors && (
                  <div style={{ float: "right", color: "red" }}>
                    Invalid Url!
                  </div>
                )}
                <Input
                  className={errors ? "is-invalid" : ""}
                  type="text"
                  placeholder="www.yourwebsite.com"
                  value={websiteUrl}
                  onChange={onWebsiteUrlChanged}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md="3">
                <Label className="pl-2">My Logo</Label>
              </Col>
              <Col md="4">
                {editingLogo ? (
                  <ReactCrop
                    keepSelection
                    crop={logoCrop}
                    onChange={(_, percentCrop) => setLogoCrop(percentCrop)}
                    onComplete={(crop) => setLogoCompletedCrop(crop)}
                    aspect={11 / 6}
                  >
                    <img
                      alt="Logo"
                      onLoad={handleLogoImageLoad}
                      src={logoSrc}
                      style={{ transform: `scale(1) rotate(0deg)` }}
                    />
                  </ReactCrop>
                ) : logoBlob ? (
                  <img className="w-100" src={URL.createObjectURL(logoBlob)} />
                ) : logoUrl ? (
                  <img className="w-100" src={logoUrl} />
                ) : (
                  ""
                )}
                <input
                  style={{ display: "none" }}
                  ref={inputLogoFile}
                  onChange={handleSelectLogo}
                  type="file"
                />
              </Col>
              <Col md="2" className="mt-2">
                {editingLogo ? (
                  <div>
                    <button
                      onClick={handleLogoEditingDone}
                      className="btn btn-solid btn-default-plan p-1 w-100"
                    >
                      <span className="pl-1 fs-15">Done</span>
                    </button>
                    <button
                      onClick={handleLogoEditingCancel}
                      sm={1}
                      className="btn btn-solid btn-default-plan p-1 mt-2 w-100"
                    >
                      <span className="pl-1 fs-15">Cancel</span>
                    </button>
                  </div>
                ) : (
                  <div>
                    <NavDropdown title="Edit" className="btn-signup btn-navbar">
                      <NavDropdown.Item onClick={handleSelectLogoClick}>
                        Upload Your Logo
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item>
                        Purchase a Logo Design
                      </NavDropdown.Item>
                    </NavDropdown>
                  </div>
                )}
              </Col>
            </Row>
            <div className="mt-4 d-flex justify-content-center">
              <button
                disabled={isLoading}
                color="primary"
                className="btn btn-solid btn-blue-plan btn-post"
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
    </Modal>
  );
};

export default BuyerProfileForm;
