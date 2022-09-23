import React from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { useRouter } from "next/router";

const UserPermission = ({ modal, onToggle, message, isBack }) => {
  const router = useRouter();

  const onPlan = () => {
    router.push({
      pathname: "/seller/account",
      query: { active: "plan" },
    });
  };

  const onBack = () => {
    router.push("/seller/dashboard");
  };

  return (
    <Modal isOpen={modal} toggle={onToggle} className="modal-md" centered>
      <ModalHeader toggle={onToggle}>Alert</ModalHeader>
      <ModalBody className="px-2 pb-2">
        <div className="my-3">
          <p
            className="text-center text-dark"
            style={{ fontSize: 18, lineHeight: 2 }}
          >
            {message}
          </p>
        </div>
        <div className="d-flex justify-content-center mb-4">
          <button
            className="btn btn-solid btn-default-plan btn-post mr-3"
            onClick={onPlan}
          >
            Membership Plans
          </button>
          {isBack && (
            <button
              className="btn btn-solid btn-gray-plan btn-post"
              onClick={onBack}
            >
              Back
            </button>
          )}
        </div>
      </ModalBody>
    </Modal>
  );
};

export default UserPermission;
