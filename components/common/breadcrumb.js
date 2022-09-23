import React from "react";
import { Home } from "react-feather";
import { Col, Container, Row } from "reactstrap";
import Link from 'next/link';

const Breadcrumb = ({title, description, parent}) => {
	return (
		<Container fluid={true}>
			<div className="page-header" style={{ paddingTop: 45, paddingBottom: 25, paddingLeft: 10 }}>
				<Row>
					<Col lg="6">
						<div className="page-header-left">
							<h3 style={{fontFamily:'Lato, sans-serif'}}>
								{title}
								<small style={{display:'none'}}>{description}</small>
							</h3>
						</div>
					</Col>
					<Col lg="6">

					</Col>
				</Row>
			</div>
		</Container>
	);
};

export default Breadcrumb;
