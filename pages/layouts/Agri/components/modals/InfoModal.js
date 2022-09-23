import React, { useEffect, useState, useContext } from "react";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import { Search } from 'react-feather';
import {
    Media,
    Col,
    Row,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Collapse,
    Container,
    Button,
    Input,
    Label,
    Table,
    Form,
    FormGroup
} from "reactstrap";

const SellerSearch = ({ modal, toggle }) => {
    return (
        <div>
            <div>
              <Modal 
                  contentClassName = 'modal-search'
                  modalClassName = "modalSearchReports"
                  centered
                  isOpen={modal}                     
                  toggle={toggle}
                  className='search-seller-modal'>
                  <div>                      
                        <ModalBody className="p-3">
                          <section className="ratio_45 section-b-space">
                            <Container>
                                <Row>
                                    <Col className="col-md-4">
                                        
                                    </Col>                                  
                                </Row>
                                <Row>
                                    <Col className="col-md-12">
                                        <textarea rows="8" cols="500" maxlength="500" className="col-xl-12 col-md-12" placeholder="Fruit and veg description..."></textarea>
                                    </Col>
                                </Row>
                            </Container>
                          </section>
                      </ModalBody>
                  </div>                                   
              </Modal>
            </div>     
        </div>
    );
};

export default SellerSearch;
