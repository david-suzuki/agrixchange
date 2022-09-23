import React, { useContext } from 'react';
import getConfig from 'next/config';
import { Media, Col, Row } from 'reactstrap';
import { Award } from 'react-feather';
import { AuthContext } from '../../../../../helpers/auth/AuthContext';

const { publicRuntimeConfig } = getConfig();
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`;

const MyPageSetup = () => {
    const authContext = useContext(AuthContext)
    const user = authContext.user
    console.log(user)

    return (
        <section className="ratio_45 section-b-space">
            <Row>
                <Col md="4">
                    <div className='mb-2'>
                        <span style={{ fontSize: 22 }}>{user.company ?? ""}</span>
                    </div>
                    <div className='mb-2'>
                        <span style={{ fontSize: 20 }}>{user.first_name + " " + user.last_name}</span>
                    </div>
                    <div className='ml-4'>
                        <h6>Tel: {user.telephone ?? ""}</h6>
                        <h6>Email: {user.email ?? ""}</h6>
                        {/* <h6>Website: {user.website_url ?? ""}<Award color="#fd7e14"/></h6> */}
                        <h6>Website: {user.website_url ?? ""}</h6>
                        <h6>Address 1: {user.address_line_1 ?? ""}</h6>
                        <h6>Address 2: {user.address_line_2 ?? ""}</h6>
                        <p>{user.companysummaryISsmallplaintextbox ?? ""}</p>
                    </div>
                </Col>
                <Col md="4" className='d-flex align-items-center mt-2'>
                    {
                        user.companylogoISfile && 
                        <Media 
                            src={contentsUrl + user.companylogoISfile} 
                            className="img-fluid" 
                            alt="" 
                            style={{ objectFit: "fill", width: "100%" }} 
                        />
                    }
                    
                </Col>
            </Row>
            <Row>
                <Col md="10" className='mt-3'>
                    <p className='ml-4'>
                        {user.companydescriptionISsmallplaintextbox ?? ""}
                    </p>
                </Col>
            </Row>
        </section>
    )
}

export default MyPageSetup;