import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import { Alert } from "reactstrap";
import { LinkPreview } from "@dhaiwat10/react-link-preview";

const FavouriteSellerDescription = ({ seller, usersProduce }) => {
  const produces = [];
  for (let prod of usersProduce) {
    const produce = produces.find(
      (p) =>
        p.produce_sub_categoryISbb_agrix_produce_typesID ===
        prod.produce_sub_categoryISbb_agrix_produce_typesID
    );
    if (!produce) produces.push(prod);
  }

  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const getThumbnailUrl = () => {
      let httpsurl = seller.website_url;
      if (!seller.website_url.includes("https")) {
        httpsurl = "http://" + httpsurl;
      }
      setThumbnailUrl(httpsurl);
    };

    if (seller.website_url) getThumbnailUrl();
    else setError("Seller has no website.");
  }, []);

  const onWebsiteLinkClicked = () => {
    if (seller.website_url) {
      let httpsurl = seller.website_url;
      if (!seller.website_url.includes("https")) {
        httpsurl = "https://" + httpsurl;
      }
      window.open(httpsurl, "_blank");
    }
  };

  return (
    <div className="mt-4 mx-2">
      <div className="py-3">
        {produces.map((prod) => (
          <span className="favourite-banner-tag" key={prod.numeric_id}>
            {prod.produce_sub_categoryISbb_agrix_produce_typesID_data
              ? prod.produce_sub_categoryISbb_agrix_produce_typesID_data.name
              : ""}
          </span>
        ))}
      </div>
      <Row className="py-3">
        <Col md="8">
          <h4>{seller.first_name + " " + seller.last_name}</h4>
          <h6>{seller.companydescriptionISsmallplaintextbox ?? ""}</h6>
          <div className="pl-2">
            <div className="mb-1">
              <span>Tel: {seller.telephone ?? ""}</span>
            </div>
            <div className="mb-1">
              <span>Email: {seller.email ?? ""}</span>
            </div>
            <div className="mb-1">
              <span>Website: {seller.website_url ?? ""}</span>
              <br />
            </div>
            <div className="mb-1">
              <span>
                Address:{" "}
                {(seller.address_line_1 ?? "") +
                  " " +
                  (seller.address_line_2 ?? "")}
              </span>
            </div>
          </div>
        </Col>
        <Col md="4">
          <a onClick={onWebsiteLinkClicked}>
            <LinkPreview
              url={thumbnailUrl}
              width="100%"
              fallback={
                <Alert color="danger">
                  <h5 className="alert-heading">Thumbnail Error!</h5>
                  <div>
                    Can't generate thumbnail of seller's website. Please check
                    the validate website.
                  </div>
                </Alert>
              }
            />
          </a>
        </Col>
      </Row>
    </div>
  );
};

export default FavouriteSellerDescription;
