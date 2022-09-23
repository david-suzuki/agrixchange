import React, { useState, useContext } from 'react';
import { withIronSession } from "next-iron-session";
import CommonLayout from '../../components/layout/common-layout';
import { Button, Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import { Edit } from 'react-feather';
import MyPageSetup from "../layouts/Agri/components/seller/SellerMyPage";
import ProfileModal from "../../components/modals/SellerProfileModal";
import Breadcrumb from "../../components/common/breadcrumb";
import NoData from '../layouts/Agri/components/NoData/NoData';
import { AuthContext } from '../../helpers/auth/AuthContext';
import { listCountries } from '../../helpers/lib';

const MyPage = ({ countries }) => {
    const authContext = useContext(AuthContext)
    const user = authContext.user

    const [isShowProfileModal, setIsShowProfileModal] = useState(false);

    const handleCreate = () => {
        setIsShowProfileModal(!isShowProfileModal)
    }

    return (
        <CommonLayout title="collection" parent="home" sidebar={true}>
            <Breadcrumb title="My Page Setup" description="" parent="Dashboard" />
            <Container fluid={true}>
                {
                    !(
                        user?.companybannerISfile
                        || user?.companybannerISfile
                        || user?.companylogoISfile
                        || user?.companysummaryISsmallplaintextbox
                    ) ?
                    <NoData 
                        description="You have not created your page yet, lets get started!" 
                        createLabel="Create Your Page" 
                        onCreate={handleCreate} 
                    />
                    :
                    <Row>
                        <Col sm="12">
                            <Card>
                                <CardHeader>
                                    <div className="pull-right">
                                        <button 
                                            onClick={() => setIsShowProfileModal(true)} 
                                            className="btn btn-solid btn-default-plan btn-post">
                                            <i className="fa fa-pencil-square-o" aria-hidden="true"></i>Edit
                                        </button>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <MyPageSetup 
                                        countries = {countries}
                                    />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                }
            </Container>
            <ProfileModal 
                modal={isShowProfileModal} 
                toggle={(isShowProfileModal)=>setIsShowProfileModal(!isShowProfileModal)} 
            />
        </CommonLayout>
    )
}

export default MyPage;

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

        const countries = await listCountries()
        return {
            props: {
                countries,
            },
        };
    },
    {
        cookieName: process.env.COOKIE_NAME,
        cookieOptions: {
            secure: process.env.NODE_ENV === "production" ? true : false
        },
        password: process.env.APPLICATION_SECRET
    }
);