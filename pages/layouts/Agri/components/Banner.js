import React, { Fragment } from "react";
import Slider from "react-slick";
import MasterBanner from "./MasterBanner";
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const contentsUrl = `${publicRuntimeConfig.CONTENTS_URL}`;

const Banner = (props) => {
  const { banner } = props
  const bannerUrl = contentsUrl + banner.image01ISfile

  const bannerBackground = {
    backgroundPosition: "center center", 
    backgroundSize: "cover", 
    backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${encodeURI(`${bannerUrl}`)})`,
  }

  return (
    <Fragment>
      <section className="p-0">
        <Slider className="slide-1 home-slider no-arrow">
          <MasterBanner
            bannerBackground={bannerBackground}
            title={banner.contentISsmallplaintextbox}
		        classes="p-center text-center"
          />
        </Slider>
      </section>
    </Fragment>
  );
};

export default Banner;
