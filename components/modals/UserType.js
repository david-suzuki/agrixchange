import React, { useState, useContext } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { AuthContext } from '../../helpers/auth/AuthContext';
import SettingContext from '../../helpers/theme-setting/SettingContext';

const UserTypeModal = (props) => {
    const { isShow, onClose } = props
    const authContext = useContext(AuthContext)
    const onAuthModalsTriggered = authContext.onAuthModalsTriggered

    const settingContext = useContext(SettingContext)
    const types = settingContext.appData.users_types
    const userTypes = types.filter(type=>type.name !== "Admin")

    return (
        <Modal
            isOpen={isShow}
            toggle={() => onClose(!isShow)}
            className="modal-md"
            centered
        >
            <ModalHeader className="border-0 ">
            </ModalHeader>
            <ModalBody className="px-4 pb-3">
                <div className='mb-4'>
                    <h3 className='text-center text-dark'>I am a ...</h3>
                </div>
                <div className='d-flex justify-content-center mb-4'>
                    <button 
                        className="btn btn-solid btn-default-plan btn-post btn-sm mr-3"
                        onClick={() => onAuthModalsTriggered("membership", userTypes[0]._id)}
                    >
                        {userTypes[0].name}
                    </button>
                    <button 
                        className="btn btn-solid btn-default-plan btn-post btn-sm"
                        onClick={() => onAuthModalsTriggered("membership", userTypes[1]._id)}
                    >
                        {userTypes[1].name}
                    </button>
                </div>
            </ModalBody>
        </Modal>
    )
}

export default UserTypeModal