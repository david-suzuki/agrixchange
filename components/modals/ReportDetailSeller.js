import React, { useState, useEffect } from "react";
import getConfig from "next/config";
import {
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Container,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap";
import {
  WhatsappShareButton,
  LinkedinShareButton,
  FacebookShareButton,
  TwitterShareButton,
  ViberShareButton,
  WhatsappIcon,
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
  ViberIcon,
} from "react-share";

const { publicRuntimeConfig } = getConfig();
const apiUrl = `${publicRuntimeConfig.API_URL}`;
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`;

const shareUrl = "http://github.com";
const title = "GitHub";

const ReportDetailSeller = ({ isShow, onToggle, report }) => {
  const [isShareButtons, setShareButtons] = useState(false);

  useEffect(() => {
    const elements = document.getElementsByClassName("share-dropdown");
    for (let element of elements) {
      element.classList.remove("btn-secondary");
    }
  }, []);

  const onOpenPdfClicked = () => {
    const link = contentsUrl + report.upload_pdf01ISfile;
    window.open(link);
  };

  return (
    <Modal centered isOpen={isShow} toggle={onToggle} className="modal-xl">
      <ModalHeader toggle={onToggle}>{report.name}</ModalHeader>
      <ModalBody className="p-3">
        <Container>
          <Row className="mb-3">
            <Col md="4">
              <img
                src={
                  report.report_image01ISfile
                    ? `${contentsUrl}${report.report_image01ISfile}`
                    : ""
                }
                alt={report.name}
                className="img-fluid image_zoom_1 blur-up lazyloaded"
                style={{ width: "100%" }}
              />
            </Col>
            <Col md="8">
              <div>
                <div
                  style={{
                    textAlign: "justify",
                    maxHeight: 180,
                    overflow: "auto",
                  }}
                >
                  {report.summaryISsmallplaintextbox}
                </div>
                <div className="d-flex justify-content-between mt-3">
                  <div style={{ fontSize: 16 }}>
                    Produce:{" "}
                    {report.produce_sub_categoryISbb_agrix_produce_typesID_data
                      ? report
                          .produce_sub_categoryISbb_agrix_produce_typesID_data
                          .name
                      : ""}
                  </div>
                  <div style={{ fontSize: 16 }}>
                    Location:{" "}
                    {report.countryISbb_agrix_countriesID_data
                      ? report.countryISbb_agrix_countriesID_data.name
                      : ""}
                    &nbsp;
                    {report.regionISbb_agrix_countriesID_data
                      ? report.regionISbb_agrix_countriesID_data.name
                      : ""}
                    &nbsp;
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <div
            className="mb-3"
            style={{
              textAlign: "justify",
              maxHeight: 200,
              overflow: "auto",
            }}
          >
            {report.report_textISsmallplaintextbox ?? ""}
          </div>
          <div className="mb-3 d-flex">
            {report.upload_pdf01ISfile && (
              <button
                className="btn btn-solid btn-default-plan btn-post btn-sm mr-2"
                onClick={onOpenPdfClicked}
              >
                <i className="fa fa-paperclip" aria-hidden="true"></i>
                Open attached pdf
              </button>
            )}
            <Dropdown
              isOpen={isShareButtons}
              toggle={() => setShareButtons(!isShareButtons)}
            >
              <DropdownToggle className="btn btn-solid btn-default-plan btn-post btn-sm mr-2 share-dropdown">
                <i className="fa fa-share-square-o" aria-hidden="true"></i>
                Share
              </DropdownToggle>
              <DropdownMenu className="media-sharing">
                <div className="pt-2">
                  <FacebookShareButton
                    url={shareUrl}
                    quote={title}
                    className="ml-2"
                  >
                    <FacebookIcon size={26} round />
                  </FacebookShareButton>
                  <WhatsappShareButton
                    url={shareUrl}
                    quote={title}
                    className="ml-1"
                  >
                    <WhatsappIcon size={26} round />
                  </WhatsappShareButton>
                  <LinkedinShareButton
                    url={shareUrl}
                    quote={title}
                    className="ml-1"
                  >
                    <LinkedinIcon size={26} round />
                  </LinkedinShareButton>
                  <TwitterShareButton
                    url={shareUrl}
                    quote={title}
                    className="ml-1"
                  >
                    <TwitterIcon size={26} round />
                  </TwitterShareButton>
                  <ViberShareButton
                    url={shareUrl}
                    quote={title}
                    className="ml-1"
                  >
                    <ViberIcon size={26} round />
                  </ViberShareButton>
                </div>
              </DropdownMenu>
            </Dropdown>
            <a
              className="btn btn-solid btn-default-plan btn-post btn-sm mr-2"
              href={`/report/pdf/${report._id}`}
              target="_blank"
              rel="noreferrer"
            >
              <i className="fa fa-download" aria-hidden="true"></i>
              Download
            </a>
          </div>
          <div className="mt-4 d-flex justify-content-center">
            <button
              type="button"
              id="save_draft"
              className="btn btn-solid btn-blue-plan py-2"
              onClick={onToggle}
            >
              Back
            </button>
          </div>
        </Container>
      </ModalBody>
    </Modal>
  );
};

export default ReportDetailSeller;
