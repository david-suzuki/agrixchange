import React, { Fragment, useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Media,
  ButtonDropdown,
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
import getConfig from "next/config";
import ReportDetailSeller from "../../../../components/modals/ReportDetailSeller";

const { publicRuntimeConfig } = getConfig();
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`;

const shareUrl = "http://github.com";
const title = "GitHub";

const MasterReport = ({ report, imgMaxWidth }) => {
  const MAX_LENGTH_1 = 240;
  const MAX_LENGTH_2 = 550;

  const summary = report.summaryISsmallplaintextbox;

  const [showDetail, setShowDetail] = useState(false);
  const [isShareButtons, setShareButtons] = useState(false);

  useEffect(() => {
    const elements = document.getElementsByClassName("media-share-dropdown");
    for (let element of elements) {
      element.classList.remove("btn-secondary");
    }
  }, []);

  const onMoreClicked = (e) => {
    e.preventDefault();
    setShowDetail(true);
  };

  const formatedSummary = (
    <Col
      sm="6"
      className="text-dark pt-1"
      style={{ textAlign: "justify", position: "relative" }}
    >
      {summary.length > MAX_LENGTH_2 ? (
        <span>{summary.substring(MAX_LENGTH_1 + 1, MAX_LENGTH_2) + "..."}</span>
      ) : (
        <span>{summary.substring(MAX_LENGTH_1 + 1, summary.length)}</span>
      )}
      <div
        className="pt-1 text-md-right text-primary"
        style={{ position: "absolute", bottom: "0%", right: "10%" }}
        onClick={onMoreClicked}
      >
        See more
      </div>
    </Col>
  );

  return (
    <Fragment>
      <div className="report-wrapper">
        <div className="d-flex justify-content-between">
          <h4>{report.name}</h4>
          <ButtonDropdown
            direction="left"
            isOpen={isShareButtons}
            toggle={() => setShareButtons(!isShareButtons)}
          >
            <DropdownToggle className="media-share-dropdown btn btn-link">
              <i
                className="fa fa-share-alt"
                aria-hidden="true"
                style={{ fontSize: 20 }}
              ></i>
            </DropdownToggle>
            <DropdownMenu className="media-sharing">
              <div>
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
                <ViberShareButton url={shareUrl} quote={title} className="ml-1">
                  <ViberIcon size={26} round />
                </ViberShareButton>
              </div>
            </DropdownMenu>
          </ButtonDropdown>
        </div>
        <a href="" onClick={onMoreClicked}>
          <div
            className="text-dark"
            style={{ minHeight: 60, textAlign: "justify" }}
          >
            {summary.substring(0, MAX_LENGTH_1)}
          </div>
          <Row>
            <Col sm="6" className="pt-3">
              <Media
                src={contentsUrl + "" + report.report_image01ISfile}
                className="img-fluid-ads"
                height="180"
                style={{ objectFit: "cover", maxWidth: imgMaxWidth }}
              />
            </Col>
            {formatedSummary}
          </Row>
        </a>
      </div>
      <ReportDetailSeller
        isShow={showDetail}
        onToggle={() => setShowDetail(!showDetail)}
        report={report}
      />
    </Fragment>
  );
};

const ReportSpace = ({ reports, imgMaxWidth }) => {
  return (
    <section id="report" className="section-b-space ratio_portrait mx-2">
      <Container>
        <h4 className="section-title mb-3">Report</h4>
        <Row>
          {reports.map((report) => (
            <Col md="6" key={report._id} className="category-m my-3">
              <MasterReport report={report} imgMaxWidth={imgMaxWidth} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default ReportSpace;
