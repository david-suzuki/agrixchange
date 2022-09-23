import React, { useState } from "react";
import { Redirect } from "react-router";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import { Bookmark } from 'react-feather';
import {
    Media,
    Col,
    Row,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Collapse,
    Button,
    Input,
    Label,
    Form,
    FormGroup,
    Container,
    Table
} from "reactstrap";

import logo from "../../../../../public/assets/images/advert.png";

const Notifications = ({ modal, toggle }) => {

    const handleToggle = (formType) => {
        setForm(formType); 
    };
    const hiddenToggle = (frm) => {
        toggle();
    };

    return (

        <div>
            <div id="notification">
              <Modal 
                  contentClassName = 'modal-price'
                  modalClassName = "modalPrice"
                  centered
                  isOpen={modal}
                  className='price-add-modal modal-lg'>
                  <div>
                      <ModalHeader toggle={toggle}>Notifications</ModalHeader>                      
                      <ModalBody className="p-3">
                          <section className="ratio_45 section-b-space">
                            <Container>
                              <Form className="needs-validation produce-add" noValidate="">
                                <Row className="partition4">              
                                  <Col md="12">
                                    <Table bordered={true}>
                                        <thead>
                                            <tr>
                                                <th>Type</th>
                                                <th>Notification</th>
                                                <th>Seller / Buyer</th>
                                                <th>Date-Time</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Price change</td>
                                                <td>Bananas New $12.5 per ton</td>
                                                <td>Bob's Bananas</td>
                                                <td>21-2-21 14h56</td>
                                            </tr>
                                            <tr>
                                                <td>Check your Email</td>
                                                <td>Message sent from</td>
                                                <td>Bob's Bananas</td>
                                                <td>21-2-21 14h56</td>
                                            </tr>
                                            <tr>
                                                <td>New Produce</td>
                                                <td>Apples loaded by</td>
                                                <td>Fred's Farm</td>
                                                <td>21-2-21 14h56</td>
                                            </tr>

                                        </tbody>
                                    </Table>                       
                                  </Col>                    
                                </Row>
                                <Row>
                                  <Col md="12">
                                      <div className="text-center">
                                        <Button className="btn btn-solid btn-blue-border btn-blue-plan btn-post btn-sm">                                            
                                            <div className="pull-left"><Bookmark size="20" /></div>
                                            <span className="pl-1 fs-15">Mark as Read</span> 
                                        </Button> 
                                      </div>
                                  </Col>
                                </Row> 
                              </Form>
                            </Container>
                          </section>
                      </ModalBody>
                  </div>
              </Modal>
            </div>     
        </div>
    );
};

export default Notifications;
