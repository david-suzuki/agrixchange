import React, { Fragment } from "react";
import { useRouter } from "next/router";
import { Container, Row, Col, Label } from "reactstrap";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`;

const SellerReportFollowing = ({
  followings,
  buyers,
  onBuyerSelected,
  membershipId,
}) => {
  const reportFollowings = followings.map((following) => {
    return buyers.find(
      (buyer) => buyer.numeric_id === following.userISbb_agrix_usersID
    );
  });

  const router = useRouter();

  const onPlan = () => {
    router.push({
      pathname: "/seller/account",
      query: { active: "plan" },
    });
  };

  return (
    <div className="ratio_45 section-b-space1" style={{ position: "relative" }}>
      <Container>
        <div className="mb-3">
          <h4>Following me:</h4>
        </div>
        {reportFollowings.map((following) => {
          const avatarUrl = following.profilepictureISfile
            ? contentsUrl + following.profilepictureISfile
            : "../../../../assets/images/user.png";
          return (
            <div
              className="mb-3 d-flex align-items-center"
              key={following.numeric_id}
              onClick={() => onBuyerSelected(following)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={avatarUrl}
                alt={`${following.first_name} ${following.last_name}`}
                className="user-avatar"
              />
              <h5 className="ml-2">
                {following.first_name + " " + following.last_name}
              </h5>
            </div>
          );
        })}
      </Container>
      {membershipId === "2" && (
        <Fragment>
          <div
            style={{
              position: "absolute",
              top: "0px",
              left: "0px",
              width: "100%",
              height: "100%",
              backgroundColor: "gray",
              opacity: 0.7,
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              top: "10%",
              left: "20%",
              width: "60%",
              height: "80%",
              padding: 10,
              backgroundColor: "white",
              borderRadius: 6,
            }}
          >
            <p
              className="text-center"
              style={{ fontSize: 20, lineHeight: 1.5 }}
            >
              Your membership does not allow you to view this feature. Please
              upgrade to continue.
            </p>
            <div className="d-flex justify-content-center align-items-center">
              <button
                className="btn btn-solid btn-default-plan btn-post mr-3"
                onClick={onPlan}
              >
                Membership Plans
              </button>
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default SellerReportFollowing;
