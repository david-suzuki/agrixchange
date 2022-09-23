import React, { useState, useContext, useEffect } from "react";
import { Modal, ModalBody, Table } from "reactstrap";
import SettingContext from "../../helpers/theme-setting/SettingContext";
import { AuthContext } from "../../helpers/auth/AuthContext";

const MembershipModal = (props) => {
  const { isShow, onClose, userTypeId } = props

  const authContext = useContext(AuthContext)
  const onAuthModalsTriggered = authContext.onAuthModalsTriggered

  const settingContext = useContext(SettingContext)
  const planTypes = settingContext.appData.membership_types
  const sortedPlanTypes = planTypes.sort((a, b) => 
    parseFloat(a.membership_month_priceNUM) - parseFloat(b.membership_month_priceNUM)
  )
  const userTypes = settingContext.appData.users_types
  const userType = userTypes.find(t => t._id === userTypeId)

  const formatMembershipPlan = (plans) => {
    // getting the 2D array with raw data of plantypes
    const arrBefore = []
    const arrBeforeRow0 = []
    Object.keys(plans[0]).forEach(function(key) {
      if (key.substring(0,7) === "option_" && key.substring(9, key.length) === "_name" ) {
        arrBeforeRow0.push(plans[0][key])
      }
    })
    arrBefore.push(arrBeforeRow0)

    for (let plan of plans) {
      const arrayBeforeRow = []
      Object.keys(plan).forEach(function(key) {
        if (key.substring(0,7) === "option_" && key.substring(9, key.length) === "_YN" ) {
          arrayBeforeRow.push(plan[key])
        }
      })
      arrBefore.push(arrayBeforeRow)
    }

    // transposing the array
    const output = arrBefore[0].map((_, colIndex) => arrBefore.map(row => row[colIndex]));

    return output
  }

  const formatedMembershipPlan = formatMembershipPlan(sortedPlanTypes)

  const onMembershipClicked = (type) => {
    if (type.name === "Blue") 
      onAuthModalsTriggered("register", type._id)
    else
      onAuthModalsTriggered("subscribe", type._id)
  }

  return (
    <Modal
      isOpen={isShow}
      toggle={() => onClose(!isShow)}
      className="modal-xl mt-3"
      centered
    >
      <ModalBody>
        <h3 className="text-center mt-3">{ userType?.name } Plan</h3>
        <div className="mx-3">
          <Table bordered responsive>
            <thead>
              <tr>
                <th style={{ border: "none" }}>
                </th>
                {
                  planTypes.map(type => {
                    const amount = "$" + (Math.round(parseFloat(type.membership_month_priceNUM) * 100) / 100).toFixed(2)
                    return (
                      <th className="membership-column" key={type._id}>
                        <span className="mt-1" style={{ fontSize: 20 }}>{type.name}</span><br/>
                        <span style={{ fontSize: 18 }}>{amount}</span>
                        <button 
                          className="btn btn-solid btn-green-plan btn-post btn-sm w-100"
                          onClick={() => onMembershipClicked(type)}>
                          Get {type.name}
                        </button>
                      </th> 
                    ) 
                  })
                }
              </tr>
            </thead>
            <tbody>
              {
                formatedMembershipPlan.map((plan, index) => 
                  <tr key={index}>
                    <th scope="row">
                      <span>{plan[0]}</span>
                    </th>
                    {
                      plan.map((p, i) => 
                        i > 0 &&
                        <td className="membership-column" key={i}>
                          {
                            p === "1" ? <i className="fa fa-check-circle-o" style={{ color: "green" }}></i> : ""
                          }
                        </td>
                      ) 
                    }
                  </tr>   
                )
              }
            </tbody>
          </Table>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default MembershipModal;
