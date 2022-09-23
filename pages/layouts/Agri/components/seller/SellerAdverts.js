import React, { Fragment, useState, useContext } from "react";
import { useRouter } from "next/router";
import {
  Col,
  Table,
  Row,
  Media,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { format } from "date-fns";
import getConfig from "next/config";
import { getFormClient } from "../../../../../services/constants";
import { post } from "../../../../../services/axios";
import { AuthContext } from "../../../../../helpers/auth/AuthContext";
import ConfirmModal from "../../../../../components/modals/ConfirmModal";

const { publicRuntimeConfig } = getConfig();
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`;
const apiUrl = `${publicRuntimeConfig.API_URL}`;

const MyAverts = ({ advertsForSeller, advertsPositions, onEdit }) => {
  const router = useRouter();

  const authContext = useContext(AuthContext);
  const user = authContext.user;

  const initOpens = advertsForSeller.map((advert) => {
    return false;
  });
  const [opens, setOpens] = useState(initOpens);
  const [advert, setAdvert] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [caption, setCaption] = useState("");
  const [message, setMessage] = useState("");
  const [base64Img, setBase64Img] = useState("");

  const formatDate = (dateStr) => {
    const date = dateStr.split(" ")[0];
    const year = parseInt(date.split("-")[0]);
    const month = parseInt(date.split("-")[1]);
    const day = parseInt(date.split("-")[2]);

    return format(new Date(year, month - 1, day), "dd MMM yyyy");
  };

  const onDropdownToggle = (index) => {
    const newOpens = opens.map((open, i) => {
      if (i === index) return !open;
      return false;
    });
    setOpens(newOpens);
  };

  const onStatusConfirmed = (ad) => {
    setAdvert(ad);
    setBase64FromUrl(contentsUrl + ad.advert_image01ISfile);
    if (
      ad.statusISLIST_Draft_Active_Deactivated_Reactivated_Archived ===
        "Active" ||
      ad.statusISLIST_Draft_Active_Deactivated_Reactivated_Archived ===
        "Reactivated"
    ) {
      setCaption("Deactivate Advert");
      setMessage("Are you sure you want to cancel your subscription?");
    } else if (
      ad.statusISLIST_Draft_Active_Deactivated_Reactivated_Archived ===
      "Deactivated"
    ) {
      setCaption("Reactivate Advert");
      setMessage("Are you sure to make current advert Reactivate?");
    }
    setShowConfirmModal(!showConfirmModal);
  };

  const onStatusChanged = async () => {
    let formData = getFormClient();
    formData.append("api_method", "update_adverts");
    formData.append("_id", advert._id);
    formData.append("user_id", user._id);
    formData.append("session_id", user.session_id);
    formData.append("userISbb_agrix_usersID", user._id);
    formData.append(
      "positionISbb_agrix_adverts_positionsID",
      advert.positionISbb_agrix_adverts_positionsID
    );
    formData.append("advert_image01ISfile", base64Img);
    formData.append(
      "produce_categoryISbb_agrix_produce_typesID",
      advert.produce_categoryISbb_agrix_produce_typesID
    );
    formData.append(
      "produce_sub_categoryISbb_agrix_produce_typesID",
      advert.produce_sub_categoryISbb_agrix_produce_typesID
    );

    if (
      advert.statusISLIST_Draft_Active_Deactivated_Reactivated_Archived ===
        "Active" ||
      advert.statusISLIST_Draft_Active_Deactivated_Reactivated_Archived ===
        "Reactivated"
    )
      formData.append(
        "statusISLIST_Draft_Active_Deactivated_Reactivated_Archived",
        "Deactivated"
      );
    else if (
      advert.statusISLIST_Draft_Active_Deactivated_Reactivated_Archived ===
      "Deactivated"
    )
      formData.append(
        "statusISLIST_Draft_Active_Deactivated_Reactivated_Archived",
        "Reactivated"
      );

    try {
      const response = await post(apiUrl, formData);
      router.reload();
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
        setBase64Img(res);
      };
      var file = this.response;
      reader.readAsDataURL(file);
    };
    xhr.send();
  };

  return (
    <Fragment>
      {advertsForSeller.map((advert, i) => {
        return (
          <Row
            className="mb-3 py-2 border-bottom"
            key={advert._id}
            style={{ borderColor: "#b8b8b8" }}
          >
            <Col md="3">
              <Media
                src={contentsUrl + advert.advert_image01ISfile}
                className="img-fluid-ads"
                alt=""
                style={{
                  objectFit: "cover",
                  width: "100%",
                  maxHeight:
                    advert.positionISbb_agrix_adverts_positionsID === "1"
                      ? "170px"
                      : "140px",
                  borderRadius: "6px",
                }}
              />
            </Col>
            <Col md="9">
              <Table bordered responsive>
                <thead>
                  <tr style={{ textAlign: "center" }}>
                    <th>Date</th>
                    <th>Position</th>
                    <th>Transaction</th>
                    <th>Current Status</th>
                    <th style={{ textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ textAlign: "center" }}>
                    <th>{formatDate(advert._datemodified)}</th>
                    <td>
                      {
                        advertsPositions.find(
                          (position) =>
                            position.numeric_id ===
                            advert.positionISbb_agrix_adverts_positionsID
                        ).name
                      }
                    </td>
                    <td>Otto</td>
                    <td>
                      {
                        advert.statusISLIST_Draft_Active_Deactivated_Reactivated_Archived
                      }
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {/* <button
                                                    type="button"
                                                    className='icon-btn-primary'
                                                    onClick={()=>onEdit(advert)}
                                                >
                                                    <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                                                </button>
                                                <button type="button" className='icon-btn-danger ml-3'>
                                                    <i className="fa fa-ban" aria-hidden="true"></i>
                                                </button> */}
                      <ButtonDropdown
                        isOpen={opens[i]}
                        toggle={() => onDropdownToggle(i)}
                        direction="left"
                      >
                        <DropdownToggle className="btn btn-solid btn-default-plan btn-post border border-success">
                          Select
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem onClick={() => onEdit(advert)}>
                            Edit
                          </DropdownItem>
                          {(advert.statusISLIST_Draft_Active_Deactivated_Reactivated_Archived ===
                            "Active" ||
                            advert.statusISLIST_Draft_Active_Deactivated_Reactivated_Archived ===
                              "Reactivated") && (
                            <DropdownItem
                              onClick={() => onStatusConfirmed(advert)}
                            >
                              Deactivate
                            </DropdownItem>
                          )}
                          {advert.statusISLIST_Draft_Active_Deactivated_Reactivated_Archived ===
                            "Draft" && (
                            <DropdownItem onClick={() => onEdit(advert)}>
                              Activate
                            </DropdownItem>
                          )}
                          {advert.statusISLIST_Draft_Active_Deactivated_Reactivated_Archived ===
                            "Deactivated" && (
                            <DropdownItem
                              onClick={() => onStatusConfirmed(advert)}
                            >
                              Reactivate
                            </DropdownItem>
                          )}
                        </DropdownMenu>
                      </ButtonDropdown>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        );
      })}
      <ConfirmModal
        modal={showConfirmModal}
        toggle={(showConfirmModal) => setShowConfirmModal(!showConfirmModal)}
        caption={caption}
        message={message}
        onConfirm={onStatusChanged}
      />
    </Fragment>
  );
};

export default MyAverts;
