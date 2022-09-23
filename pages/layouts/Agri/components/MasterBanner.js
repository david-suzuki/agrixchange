import { Col, Container, Row } from "reactstrap";

const MasterBanner = ({ title, classes, bannerBackground }) => {
  return (
    <div>
      <div style={ bannerBackground } className={`home ${classes ? classes : "text-center"}`}>
        <Container>
          <Row>
            <Col>
              <div className="slider-contain">
                <div>
                  <h4>{title}</h4>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default MasterBanner;
