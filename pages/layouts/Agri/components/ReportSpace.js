import React, { Fragment, useContext, useEffect, useState } from "react";
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
import Slider from "react-slick";
import { Slider2 } from "../../../../services/script";
import getConfig from "next/config";
import { AuthContext } from "../../../../helpers/auth/AuthContext";
import { useRouter } from "next/router";
import ReportDetailSeller from "../../../../components/modals/ReportDetailSeller";

const { publicRuntimeConfig } = getConfig();
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`;

const shareUrl = "http://github.com";
const title = "GitHub";

const MasterReport = ({ report, imgMaxWidth, size }) => {
  const MAX_LENGTH_1 = size === "normal" ? 240 : 160;
  const MAX_LENGTH_2 = size === "normal" ? 550 : 350;

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

const ReportSpace = ({ reports, imgMaxWidth, size }) => {
  const router = useRouter();

  const authContext = useContext(AuthContext);
  const isAuth = authContext.isAuthenticated;
  const onAuthModalsTriggered = authContext.onAuthModalsTriggered;
  const onTarget = authContext.onTarget;

  const onAllClicked = () => {
    if (!isAuth) {
      onTarget("/reports");
      onAuthModalsTriggered("login");
      return;
    }

    router.push("/reports");
  };

  return (
    <Fragment>
      <section id="report" className="section-b-space ratio_portrait mx-2">
        <Container>
          <h4 className="section-title mb-3">Report</h4>
          <Row>
            {reports.length < 3 ? (
              <div className="ml-2 mr-4">
                {reports.map((report) => (
                  <Col md="6" key={report._id} className="category-m">
                    <MasterReport
                      report={report}
                      imgMaxWidth={imgMaxWidth}
                      size={size}
                    />
                  </Col>
                ))}
              </div>
            ) : (
              <Col>
                <Slider {...Slider2} className="slide-2 category-m slick-15">
                  {reports.map((report) => {
                    return (
                      <MasterReport
                        key={report._id}
                        report={report}
                        imgMaxWidth={imgMaxWidth}
                        size={size}
                      />
                    );
                  })}
                </Slider>
              </Col>
            )}
          </Row>
          <div className="text-right mt-3 mr-2">
            <a onClick={onAllClicked} className="btn btn-outline linkCursor">
              See all reports
            </a>
          </div>
        </Container>
      </section>
    </Fragment>
  );
};

export default ReportSpace;
