import React, { useContext } from "react";
import { withIronSession } from "next-iron-session";
import CommonLayout from "../../components/layout/common-layout";
import Breadcrumb from "../../components/common/breadcrumb";
import {
  getMembershipTypes,
  listProducesByUserId,
  listAdvertsByUserId,
} from "../../helpers/lib";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import DashboardPlan from "../layouts/Agri/components/DashboardPlan";
import DashboardProduce from "../layouts/Agri/components/seller/SellerDashboardProduce";
import DashboardAdvert from "../layouts/Agri/components/seller/SellerDashboardAdvert";

const Dashboard = ({
  membershipTypes,
  producesForSeller,
  advertsForSeller,
}) => {
  return (
    <CommonLayout title="collection" parent="home" sidebar={true}>
      <Breadcrumb title="Dashboard" parent="Dashboard" />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <CardHeader>
                Description or section summary information.
              </CardHeader>
              <CardBody>
                <DashboardPlan membershipTypes={membershipTypes} />
                <DashboardProduce producesForSeller={producesForSeller} />
                <DashboardAdvert advertsForSeller={advertsForSeller} />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </CommonLayout>
  );
};

export default Dashboard;

export const getServerSideProps = withIronSession(
  async ({ req, res }) => {
    const user = req.session.get("user");

    if (!user) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    const membershipTypes = await getMembershipTypes();
    const producesForSeller = await listProducesByUserId(user.user._id);
    const advertsForSeller = await listAdvertsByUserId(user.user._id);

    return {
      props: {
        membershipTypes,
        producesForSeller,
        advertsForSeller,
      },
    };
  },
  {
    cookieName: process.env.COOKIE_NAME,
    cookieOptions: {
      secure: process.env.NODE_ENV === "production" ? true : false,
    },
    password: process.env.APPLICATION_SECRET,
  }
);
