import React, { useContext } from "react";
import { Clipboard } from "react-feather";
import { Table, Button, Container } from "reactstrap";
import { AuthContext } from "../../../../helpers/auth/AuthContext";

const DashboardPlan = ({ membershipTypes }) => {
  const authContext = useContext(AuthContext);
  const user = authContext.user;

  const userMembershipTypeId = user.membershipISbb_agrix_membership_typesID;
  const activeMembership = membershipTypes.find(
    (membership) => membership._id === userMembershipTypeId
  );

  return (
    <Container className="attribute-blocks">
      <h5 className="f-w-600 mb-3">Current Subscription Plan: </h5>
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
              {parseFloat(activeMembership?.membership_month_priceNUM).toFixed(
                2
              )}
            </td>
            <td>Year</td>
            <td>
              {parseFloat(activeMembership?.membership_year_priceNUM).toFixed(
                2
              )}
            </td>
            <td>{activeMembership?._datemodified}</td>
            <td>
              <Button className="btn btn-disabled btn-post btn-lg" disabled>
                <div className="pull-left">
                  <Clipboard size="20" />
                </div>
                <span className="pl-1 fs-15">Subscribed</span>
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>
    </Container>
  );
};

export default DashboardPlan;
