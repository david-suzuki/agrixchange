import React, { useContext, useState } from "react";
import { withIronSession } from "next-iron-session";
import CommonLayout from "../../components/layout/common-layout";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import Produce from "../layouts/Agri/components/seller/SellerProduce";
import Breadcrumb from "../../components/common/breadcrumb";
import ProduceSellerModal from "../../components/modals/ProduceSeller";
import DeleteModal from "../../components/modals/ConfirmModal";
import NoData from "../layouts/Agri/components/NoData/NoData";
import {
  listProducesByUserId,
  lisUsersProducePricing,
} from "../../helpers/lib";
import { getFormClient } from "../../services/constants";
import { post } from "../../services/axios";
import { AuthContext } from "../../helpers/auth/AuthContext";
import { useRouter } from "next/router";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const apiUrl = `${publicRuntimeConfig.API_URL}`;

const MyProduce = ({ producesForSeller, pricelogs }) => {
  const router = useRouter();

  const authContext = useContext(AuthContext);
  const user = authContext.user;

  const [caption, setCaption] = useState("");
  const [showProduceAddModal, setShowProduceAddModal] = useState(false);
  const [selectedProduce, setSelectedProduce] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleCreate = () => {
    setCaption("Add New Produce Item");
    setShowProduceAddModal(!showProduceAddModal);
    setSelectedProduce(null);
  };

  const handleEdit = (produce) => {
    setCaption("Edit Produce Item");
    setShowProduceAddModal(!showProduceAddModal);
    setSelectedProduce(produce);
  };

  const handleDelete = (produce) => {
    setShowDeleteModal(true);
    setSelectedProduce(produce);
  };

  const handleConfirmDelete = async () => {
    let formData = getFormClient();
    formData.append("api_method", "delete_users_produce");
    formData.append("_id", selectedProduce._id);
    formData.append("session_id", user.session_id);
    formData.append("user_id", user._id);

    try {
      const response = await post(apiUrl, formData);
      if (response.data.message === "SUCCESS") {
        setShowDeleteModal(false);
        router.reload();
      } else if (response.data.error) {
        alert(response.data.message);
      }
    } catch (err) {
      alert(err.toString());
    }
  };

  return (
    <CommonLayout title="collection" parent="home" sidebar={true}>
      <Breadcrumb
        title="My Produce"
        description="Seller Panel"
        parent="Dashboard"
      />
      <Container fluid={true}>
        <Row>
          {!producesForSeller?.length ? (
            <Col sm="12">
              <NoData
                description="You have not added a produce item yet, lets get started!"
                createLabel="Add Produce Item"
                onCreate={handleCreate}
              />
            </Col>
          ) : (
            <Col sm="12">
              <Card>
                <CardHeader>
                  Description or section summary information
                  <div className="pull-right">
                    <button
                      onClick={handleCreate}
                      className="btn btn-solid btn-default-plan btn-post"
                    >
                      <i className="fa fa-plus-circle" aria-hidden="true"></i>
                      Add
                    </button>
                  </div>
                  <div className="pull-right mr-3">
                    <button className="btn btn-solid btn-blue-plan btn-post">
                      <i className="fa fa-eye" aria-hidden="true"></i> Search
                    </button>
                  </div>
                </CardHeader>
                <CardBody>
                  <Produce
                    producesForSeller={producesForSeller}
                    pricelogs={pricelogs}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </CardBody>
              </Card>
            </Col>
          )}
        </Row>
      </Container>
      <ProduceSellerModal
        modal={showProduceAddModal}
        toggle={(showProduceAddModal) =>
          setShowProduceAddModal(!showProduceAddModal)
        }
        caption={caption}
        selectedProduce={selectedProduce}
      />
      <DeleteModal
        modal={showDeleteModal}
        toggle={(showDeleteModal) => setShowDeleteModal(!showDeleteModal)}
        caption="Delete Produce"
        message="Are you sure you want to delete this produce item?"
        onConfirm={handleConfirmDelete}
      />
    </CommonLayout>
  );
};

export default MyProduce;

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

    const producesForSeller = await listProducesByUserId(user.user._id);
    const pricelogs = await lisUsersProducePricing();

    return {
      props: {
        producesForSeller,
        pricelogs,
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
