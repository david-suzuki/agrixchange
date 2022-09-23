import React, { useState, useContext, useEffect } from "react";
import { Modal, ModalBody, Table } from "reactstrap";
import SettingContext from "../../helpers/theme-setting/SettingContext";
import { AuthContext } from "../../helpers/auth/AuthContext";

const SubscriptionModal = (props) => {
  const { isShow, onClose, membershipTypeId, userTypeId } = props

  const settingContext = useContext(SettingContext)
  const planTypes = settingContext.appData.membership_types
  const planType = planTypes.find(plan=>plan._id === membershipTypeId)

  const authContext = useContext(AuthContext)
  const onAuthModalsTriggered = authContext.onAuthModalsTriggered;

  const onBackClicked = () => {
    onAuthModalsTriggered("membership", userTypeId)
  }

  const onSubscriptionClicked = () => {
    onAuthModalsTriggered("register", membershipTypeId)
  }

  return (
    <Modal
      isOpen={isShow}
      toggle={() => onClose(!isShow)}
      className="modal-lg"
      centered
    >
      <ModalBody>
        <div className="mt-3">
          <span 
            className="ml-4" 
            style={{ cursor: "pointer" }}
            onClick={onBackClicked}
          >
            {"<"}Back
          </span>
          <h3 className="text-center mt-2" style={{ color: "#115322" }}>My Subscription</h3>
          <div className="mx-3">
            <Table bordered responsive>
            <thead>
              <tr style={{ width: '25%', textAlign: 'center'}}>
                <th>Plan</th>
                <th>Price</th>
                <th>Per</th>
                <th>Total Price Per Year</th>
                <th>Subscribe</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ width: '25%', textAlign: 'center'}}>
                <td>{planType?.name} Annual</td>
                <td>{parseFloat(planType?.membership_year_priceNUM).toFixed(2)}</td>
                <td>Year</td>
                <td>{parseFloat(planType?.membership_year_priceNUM).toFixed(2)}</td>
                <td>
                  <button 
                    className="btn btn-solid btn-green-plan btn-subscription btn-post btn-sm"
                    onClick={onSubscriptionClicked}
                  >
                    <i className="fa fa-dollar" aria-hidden="true"></i>
                    Subscription          
                  </button>
                </td>
              </tr>
              <tr style={{ width: '25%', textAlign: 'center'}}>
                <td>{planType?.name} Monthly</td>
                <td>{parseFloat(planType?.membership_month_priceNUM).toFixed(2)}</td>
                <td>Month</td>
                <td>{(parseFloat(planType?.membership_month_priceNUM) * 12).toFixed(2)}</td>
                <td>
                  <button 
                    className="btn btn-solid btn-green-plan btn-subscription btn-post btn-sm"
                    onClick={onSubscriptionClicked}
                  >
                    <i className="fa fa-dollar" aria-hidden="true"></i>
                    Subscription          
                  </button>
                </td>
              </tr>
            </tbody>
            </Table>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default SubscriptionModal;
