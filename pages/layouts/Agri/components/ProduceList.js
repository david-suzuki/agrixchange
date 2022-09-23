import React from 'react';
import { Container, Row, Col, Media } from "reactstrap";
import Link from "next/link";
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`;

const CategoryContent = ({ img, title, link, height }) => {
    return (
        <Col lg="2" md="6" className="produce-list-block">
            <Link href={link}>
                <a>
                    <div className={`collection-banner produce-card`}>
                        <div className="img-part">
                            <Media alt={title} >
                                <div style={{ backgroundPosition: "center center", backgroundSize: "cover", backgroundRepeat: 'no-repeat', backgroundImage: `url(${encodeURI(`${img}`)})`, width: "100%", height: `${height ?? 200}px` }}></div>
                            </Media>
                        </div>
                        <div className="contain-banner banner-5">
                            <div>
                                <h4 style={{ marginBottom: 0 }}>{title}</h4>
                            </div>
                        </div>
                    </div>
                </a>
            </Link >
        </Col >
    );
};
const ProduceList = ({ sectionClass, itemHeight = 180, categories, type }) => {

    return (
        <Container>
            <section className={sectionClass}>
                <h4 className="section-title">Produce List</h4>
                <Row className="partition6">
                    {categories && categories.map((data, i) => {
                        return (
                            <CategoryContent
                                key={i}
                                height={itemHeight}
                                img={contentsUrl + '' + data.main_produce_image01ISfile}
                                title={data.name}
                                link={`/${type}/${data.numeric_id}`}
                            />
                        );
                    })}
                </Row>
            </section>
        </Container>
    );
};

export default ProduceList;
