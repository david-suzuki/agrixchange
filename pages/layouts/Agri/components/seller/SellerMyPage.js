import React, { Fragment, useContext } from 'react';
import getConfig from 'next/config';
import { Col, Media, Row } from 'reactstrap';
import { Award } from 'react-feather';
import { AuthContext } from '../../../../../helpers/auth/AuthContext';

const { publicRuntimeConfig } = getConfig();
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`;

const MyPageSetup = ({ countries }) => {
    const authContext = useContext(AuthContext)
    const user = authContext.user

    const country = countries.find(country => country._id === user.countryISbb_agrix_countriesID)
    const region = countries.find(country => country._id === user.regionISbb_agrix_countriesID)
    const city = countries.find(country => country._id === user.cityISbb_agrix_countriesID)

    const bannerBackground = {
        backgroundImage: 
        'linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(' + contentsUrl + user.companybannerISfile + ')',
    }

    //setImgPath(`${baseUrl}/public/account/${state.companylogoISfile}`);

    return (
        <Fragment>
            <section className="category-banner-panel" style={bannerBackground}>
                <div className="seller-page-logo">
                    <Media
                        src={`${contentsUrl}${user.companylogoISfile}`}
                        className="img-fluid blur-up lazyload bg-img"
                        alt=""
                        width="165px"
                        height="90px"
                        style={{ borderRadius: 7 }}
                    />
                    <Award style={{ display:'none', position: 'relative', right: 0 }} color="#fd7e14" />
                </div>
                <div className='seller-page-info'>
                    <h3>{user.company}</h3>
                    <p>{user.first_name + " " + user.last_name}</p>
                    <p>{user.companysummaryISsmallplaintextbox}</p>
                </div>
                <div className="img-part">
                    {/*<Media
                  src={imgPath + state.companybannerISfile}
                  className="img-fluid blur-up lazyload bg-img"
                  alt=""
                />*/}
                </div>
            </section>
            <section>
                <Row className="mb-4">
                    <Col md="8">
                        <div className="seller-info">
                            <h6 className="mb-3">{user.companydescriptionISsmallplaintextbox}</h6>
                        </div>
                    </Col>
                    <Col md="4">
                        {user.telephone && <h6>Tel: {user.telephone ?? 'NA'}</h6>}
                        <h6>Email: {user.email ?? ''}</h6>
                        <h6>Website: {user.website_url}</h6>
                        {
                            (user.address_line_1 || user.address_line_2) &&
                            <h6>Address:
                                {user.address_line_1 ? <div>{user.address_line_1}</div>: ''}
                                {user.address_line_2 ? <div>{user.address_line_2}</div>: ''}
                                {user.area_code ? <div>{user.area_code} </div>: ''}
                                {city ? <div>{city.name} (city)</div>: ''}
                                {region ? <div>{region.name} (region)</div>: ''}
                                {country ? <div>{country.name} (country)</div>: ''}  
              			    </h6>
                        }
                    </Col>
                </Row>
            </section>
        </Fragment>
    )
}

export default MyPageSetup;
