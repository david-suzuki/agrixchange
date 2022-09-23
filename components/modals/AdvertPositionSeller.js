import React from 'react'
import { Modal, ModalHeader, ModalBody, Table, Button } from "reactstrap"

const AdvertPositionSellerModal = ({modal, onToggle, positions, onPositionSelected}) => {

    return (
        <Modal
            centered
            isOpen={modal}
            className='modal-lg'
            toggle={onToggle}
        >
            <ModalHeader toggle={onToggle}>
                Select Advert Type
            </ModalHeader>
            <ModalBody className="mx-5 mt-3">
                {/* <h5 className="f-w-600 mb-3">Create A New Advert</h5> */}
                {
                    positions.length === 0 ?
                    <div className='text-center'>
                        <span style={{ fontSize: 18 }}>There is no postion to display.</span>
                        <br/>
                        <Button type="button" onClick={onToggle} color="primary" className="btn mt-3"> 
                            <span className="px-2">Close</span>
                        </Button>
                    </div>:
                    <Table bordered responsive>
                        <thead>
                            <tr style={{ textAlign: 'center'}}>
                                <th>Position</th>
                                <th>Price per Month</th>
                                <th>Width</th>
                                <th>Height</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            positions.map(position => (
                                <tr key={position._id} style={{ textAlign: 'center'}}>
                                    <td>{position.name}</td>
                                    <td>{ parseFloat(position.priceNUM).toFixed(2) }</td>
                                    <td>250</td>
                                    <td>{position.name === "Premium" ? "250" : "150"}</td>
                                    <td>
                                        <button 
                                            className="btn btn-solid btn-green-plan btn-post"
                                            onClick={()=>onPositionSelected(position)}
                                        >
                                            <i
                                                className="fa fa-dollar"
                                                aria-hidden="true"                                                              
                                            ></i>
                                            Purchase
                                        </button>                                         
                                    </td>
                                </tr>
                            ))
                        }
                        </tbody>
                    </Table>
                }
            </ModalBody>
        </Modal>
    )
}

export default AdvertPositionSellerModal