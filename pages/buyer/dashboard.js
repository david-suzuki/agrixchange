import React from "react";
import { withIronSession } from "next-iron-session";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import DashboardPlan from "../layouts/Agri/components/DashboardPlan";
import DashboardProduce from "../layouts/Agri/components/buyer/DashboardProduce";
import DashboardSeller from "../layouts/Agri/components/buyer/DashboardSeller";
import {
  getMembershipTypes,
  listUsersFavourites,
  getSellers,
} from "../../helpers/lib";
import CommonLayout from "../../components/layout/common-layout";
import Breadcrumb from "../../components/common/breadcrumb";

const Dashboard = ({ membershipTypes, favourites, sellers }) => {
  const producesForBuyer = favourites.filter(
    (favourite) => favourite.fav_produceISbb_agrix_users_produceID !== null
  );

  const sellersForBuyer = favourites.filter(
    (favourite) => favourite.fav_userISbb_agrix_usersID !== null
  );
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
                <DashboardProduce producesForBuyer={producesForBuyer} />
                <DashboardSeller
                  sellersForBuyer={sellersForBuyer}
                  sellers={sellers}
                />
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
    const favourites = await listUsersFavourites(user.user._id);
    const sellers = await getSellers();

    return {
      props: {
        membershipTypes,
        favourites,
        sellers,
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
