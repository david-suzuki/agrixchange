import React, { Fragment } from "react";
import { ShoppingBag, Download, AlertCircle } from "react-feather";
import { Media, Col } from "reactstrap";


const Contents = () => {
	return (
		<div>
			<div className="page-wrapper">
				<Header />
				<div className="page-body-wrapper">
					<Sidebar />
					<RightSidebar />
					<div className="page-body">{props.children}</div>
					<Footer />
				</div>
			</div>
			<div
				className="btn-light custom-theme"
				onClick={() => ChangeRtl(side.divName)}
			>
				{side.divName}
			</div>
		</div>
	);
};

export default Contents;
