import React, { useContext } from "react";
import { Button, Col, Row, Table } from "reactstrap";
import { Clipboard } from "react-feather";
import { AuthContext } from "../../../../../helpers/auth/AuthContext";

const SellerAccountPlan = ({ membershipTypes }) => {
  const authContext = useContext(AuthContext);
  const user = authContext.user;
  // 'My Plan' tab
  const userMembershipTypeId = user.membershipISbb_agrix_membership_typesID;
  const activeMembership = membershipTypes.find(
    (membership) => membership._id === userMembershipTypeId
  );

  const formatMembershipPlan = (plans) => {
    // getting the 2D array with raw data of plantypes
    const arrBefore = [];
    const arrBeforeRow0 = [];
    Object.keys(plans[0]).forEach(function (key) {
      if (
        key.substring(0, 7) === "option_" &&
        key.substring(9, key.length) === "_name"
      ) {
        arrBeforeRow0.push(plans[0][key]);
      }
    });
    arrBefore.push(arrBeforeRow0);

    for (let plan of plans) {
      const arrayBeforeRow = [];
      Object.keys(plan).forEach(function (key) {
        if (
          key.substring(0, 7) === "option_" &&
          key.substring(9, key.length) === "_YN"
        ) {
          arrayBeforeRow.push(plan[key]);
        }
      });
      arrBefore.push(arrayBeforeRow);
    }

    // transposing the array
    const output = arrBefore[0].map((_, colIndex) =>
      arrBefore.map((row) => row[colIndex])
    );

    return output;
  };

  const sortedPlanTypes = membershipTypes.sort(
    (a, b) =>
      parseFloat(a.membership_month_priceNUM) -
      parseFloat(b.membership_month_priceNUM)
  );
  const formatedMembershipPlan = formatMembershipPlan(sortedPlanTypes);

  const onMembershipClicked = (type) => {
    const onAuthModalsTriggered = authContext.onAuthModalsTriggered;
    onAuthModalsTriggered("subscribe", type._apikey);
  };

  return (
    <div className="permission-block">
      <div className="attribute-blocks">
        <h5 className="f-w-600 mb-3">Current Subscription Plan: </h5>
        <Row>
          <Col xl="10" sm="12">
            <Table bordered responsive>
              <thead>
                <tr style={{ textAlign: "center" }}>
                  <th>Plan</th>
                  <th>Price</th>
                  <th>Per</th>
                  <th>Total Price Per Year</th>
                  <th>Renewal Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ textAlign: "center" }}>
                  <td>{activeMembership?.name}</td>
                  <td>
                    {parseFloat(
                      activeMembership?.membership_month_priceNUM
                    ).toFixed(2)}
                  </td>
                  <td>Year</td>
                  <td>
                    {parseFloat(
                      activeMembership?.membership_year_priceNUM
                    ).toFixed(2)}
                  </td>
                  <td>{activeMembership?._datemodified}</td>
                  <td>
                    <Button
                      className="btn btn-disabled btn-post btn-lg"
                      disabled
                    >
                      <div className="pull-left">
                        <Clipboard size="20" />
                      </div>
                      <span className="pl-1 fs-15">Subscribed</span>
                    </Button>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      </div>
      <div className="attribute-blocks show-grid plan-modal">
        <h5 className="f-w-600 mb-3">Other Subscription Plans Avaliable </h5>
        <Table bordered responsive>
          <thead>
            <tr>
              <th style={{ width: "30%" }}></th>
              {membershipTypes.map((type) => {
                const amount =
                  "$" +
                  (
                    Math.round(
                      parseFloat(type.membership_month_priceNUM) * 100
                    ) / 100
                  ).toFixed(2);
                return (
                  <th className="membership-column" key={type._id}>
                    <span className="membership-cell-title mt-1">
                      {type.name}
                    </span>
                    <br />
                    <span className="membership-cell-amount">{amount}</span>
                    <br />
                    {type._id === userMembershipTypeId ? (
                      <Button
                        className="btn btn-disabled btn-post btn-lg"
                        disabled
                        style={{ maxHeight: 34 }}
                      >
                        <div className="pull-left">
                          <Clipboard size="20" />
                        </div>
                        <span className="pl-1 fs-15">Subscribed</span>
                      </Button>
                    ) : (
                      <button
                        className="btn btn-solid btn-default-plan px-1 py-1"
                        style={{ width: "90%" }}
                        onClick={() => onMembershipClicked(type)}
                      >
                        Get {type.name}
                      </button>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {formatedMembershipPlan.map((plan, index) => (
              <tr key={index}>
                <th scope="row">
                  <span>{plan[0]}</span>
                </th>
                {plan.map(
                  (p, i) =>
                    i > 0 && (
                      <td className="membership-column" key={i}>
                        {p === "1" ? (
                          <i
                            className="fa fa-check-circle-o"
                            style={{ color: "green" }}
                          ></i>
                        ) : (
                          ""
                        )}
                      </td>
                    )
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default SellerAccountPlan;
