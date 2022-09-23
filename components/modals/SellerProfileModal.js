import React, { useContext, useEffect, useRef, useState } from "react";
import getConfig from "next/config";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  Input,
  Col,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import { Alert } from "../../components/common/Alert";
import { NavDropdown } from "react-bootstrap";
import { AuthContext } from "../../helpers/auth/AuthContext";
import { getFormClient } from "../../services/constants";
import { post } from "../../services/axios";

const { publicRuntimeConfig } = getConfig();
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`;
const apiUrl = `${publicRuntimeConfig.API_URL}`;

const SellerProfileForm = ({ modal, toggle }) => {
  const authContext = useContext(AuthContext);
  const user = authContext.user;

  const inputLogoFile = useRef(null);
  const inputCoverFile = useRef(null);

  const imgLogoRef = useRef(null);
  const imgCoverRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);

  const [logoSrc, setLogoSrc] = useState(null);
  const [coverSrc, setCoverSrc] = useState(null);

  const [logoCompletedCrop, setLogoCompletedCrop] = useState(null);
  const [coverCompletedCrop, setCoverCompletedCrop] = useState(null);

  const [logoCrop, setLogoCrop] = useState();
  const [coverCrop, setCoverCrop] = useState();

  const [logoBlob, setLogoBlob] = useState(null);
  const [coverBlob, setCoverBlob] = useState(null);

  const [logoUrl, setLogoUrl] = useState(null);
  const [coverUrl, setCoverUrl] = useState(null);

  const [editingLogo, setEditingLogo] = useState(null);
  const [editingCover, setEditingCover] = useState(null);

  const [companySummary, setCompanySummary] = useState(
    user.companysummaryISsmallplaintextbox ?? ""
  );
  const [companyDescription, setCompanyDescription] = useState(
    user.companydescriptionISsmallplaintextbox ?? ""
  );
  const [companyWebsiteUrl, setCompanyWebsiteUrl] = useState(
    user.website_url ?? ""
  );

  const [errors, setErrors] = useState(false);

  useEffect(() => {
    if (user.companylogoISfile)
      setLogoUrl(encodeURI(`${contentsUrl}${user.companylogoISfile}`));

    if (user.companybannerISfile)
      setCoverUrl(encodeURI(`${contentsUrl}${user.companybannerISfile}`));
  }, []);

  const onWebsiteUrlChanged = (e) => {
    setCompanyWebsiteUrl(e.target.value);
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
    const isValidUrl = validURL(companyWebsiteUrl);
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
    formData.append("website_url", companyWebsiteUrl);

    if (logoBlob) {
      const logoBlobToBase64 = await blobToBase64(logoBlob);
      formData.append("companylogoISfile", logoBlobToBase64);
    }
    if (coverBlob) {
      const coverBlobToBase64 = await blobToBase64(coverBlob);
      formData.append("companybannerISfile", coverBlobToBase64);
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

  function handleSelectLogoClick(event) {
    event.preventDefault();
    inputLogoFile.current.click();
  }

  function handleSelectCoverClick(event) {
    event.preventDefault();
    inputCoverFile.current.click();
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

  function handleSelectCover(event) {
    if (event?.target?.files?.length) {
      setCoverCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setCoverSrc(reader?.result?.toString() ?? "");
        setEditingCover(true);
        inputCoverFile.current.value = null;
      });
      reader.readAsDataURL(event?.target?.files[0]);
    }
  }

  function handleLogoEditingCancel(_event) {
    setEditingLogo(null);
    setLogoBlob(null);
  }

  function handleCoverEditingCancel(_event) {
    setEditingCover(null);
    setCoverBlob(null);
  }

  async function handleLogoEditingDone(_event) {
    setEditingLogo(false);
    const logoBlob = await getCroppedImg(
      imgLogoRef.current,
      logoCompletedCrop,
      "logo.jpg"
    );
    setLogoBlob(logoBlob);
    // setLogoUploadedRes(null);
  }

  async function handleCoverEditingDone(_event) {
    setEditingCover(false);
    const coverBlob = await getCroppedImg(
      imgCoverRef.current,
      coverCompletedCrop,
      "cover.jpg"
    );
    setCoverBlob(coverBlob);
    // setCoverUploadedRes(null);
  }

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

  function handleCoverImageLoad(event) {
    imgCoverRef.current = event?.currentTarget;

    const { width, height } = event.currentTarget;
    const crop = centerCrop(
      makeAspectCrop({ unit: "%", width: 90 }, 16 / 9, width, height),
      width,
      height
    );
    setCoverCrop(crop);
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
    <Modal centered isOpen={modal} toggle={toggle} className="modal-lg mt-4">
      <ModalHeader toggle={toggle}>Create your Seller Profile Page</ModalHeader>
      <ModalBody className="mx-4">
        <section className="ratio_45 section-b-space">
          <div className="mb-3">
            <Alert />
          </div>
          <div className="needs-validation user-add" noValidate="">
            <Row>
              <Col md="6" className="mb-3">
                <Label className="pl-2">Company Summary</Label>
                <textarea
                  className="form-control mb-0"
                  rows="4"
                  maxLength="200"
                  placeholder="200 characters"
                  value={companySummary}
                  onChange={(e) => setCompanySummary(e.target.value)}
                ></textarea>
              </Col>
              <Col md="6" className="mb-3">
                <Label className="pl-2">Full Company Description</Label>
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
            <Row>
              <Col md="6">
                <Label className="pl-2">Website URL</Label>
                {errors && (
                  <div style={{ float: "right", color: "red" }}>
                    Invalid Url!
                  </div>
                )}
                <Input
                  className={errors ? "is-invalid" : ""}
                  name="website_url"
                  type="text"
                  placeholder="www.yourwebsite.com"
                  value={companyWebsiteUrl}
                  onChange={onWebsiteUrlChanged}
                />
              </Col>
            </Row>
            <Row>
              <Col md="6" className="mt-4">
                <Label className="pl-2">My Logo</Label>
                <Row>
                  <Col md="9">
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
                      <img
                        className="w-100"
                        src={URL.createObjectURL(logoBlob)}
                      />
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
                  <Col md="3" className="mt-2">
                    {editingLogo ? (
                      <div>
                        <button
                          onClick={handleLogoEditingDone}
                          className="btn btn-solid btn-default-plan p-1 w-100"
                        >
                          <span className="pl-1 fs-15">Crop</span>
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
                        <NavDropdown
                          title="Edit"
                          className="btn-signup btn-navbar"
                        >
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
              </Col>
              <Col md="6" className="mt-4">
                <Label className="pl-2">Company Cover Image</Label>
                <Row>
                  <Col md="9">
                    {editingCover ? (
                      <ReactCrop
                        keepSelection
                        crop={coverCrop}
                        onChange={(_, percentCrop) => setCoverCrop(percentCrop)}
                        onComplete={(crop) => setCoverCompletedCrop(crop)}
                        aspect={16 / 9}
                      >
                        <img
                          alt="Cover Image"
                          onLoad={handleCoverImageLoad}
                          src={coverSrc}
                          style={{ transform: `scale(1) rotate(0deg)` }}
                        />
                      </ReactCrop>
                    ) : coverBlob ? (
                      <img
                        className="w-100"
                        src={URL.createObjectURL(coverBlob)}
                      />
                    ) : coverUrl ? (
                      <img className="w-100" src={coverUrl} />
                    ) : (
                      ""
                    )}
                    <input
                      style={{ display: "none" }}
                      ref={inputCoverFile}
                      onChange={handleSelectCover}
                      type="file"
                    />
                  </Col>
                  <Col md="3" className="mt-2">
                    {editingCover ? (
                      <div>
                        <button
                          onClick={handleCoverEditingDone}
                          className="btn btn-solid btn-default-plan p-1 w-100"
                        >
                          <span className="pl-1 fs-15">Crop</span>
                        </button>
                        <button
                          onClick={handleCoverEditingCancel}
                          className="btn btn-solid btn-default-plan p-1 mt-2 w-100"
                        >
                          <span className="pl-1 fs-15">Cancel</span>
                        </button>
                      </div>
                    ) : (
                      <NavDropdown
                        title="Edit"
                        className="btn-signup btn-navbar"
                      >
                        <NavDropdown.Item onClick={handleSelectCoverClick}>
                          Upload Banner Image
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item>
                          Purchase Banner Image
                        </NavDropdown.Item>
                      </NavDropdown>
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>
            <div className="mt-5 d-flex justify-content-center">
              <button
                disabled={isLoading}
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
          </div>
        </section>
      </ModalBody>
    </Modal>
  );
};

export default SellerProfileForm;
