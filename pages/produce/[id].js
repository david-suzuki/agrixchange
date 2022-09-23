import React from "react";
import CommonLayout from "../../components/layout/common-layout";
import { Row, Col, Container } from "reactstrap";

import ProduceBanner from "../layouts/Agri/components/ProduceBanner";
import ProduceList from "../layouts/Agri/components/ProduceList";
import AdSpaceSquare from "../layouts/Agri/components/AdSpaceSquare";
import AdSpaceSmall from "../layouts/Agri/components/AdSpaceSmall";
import SellersSpaceSmall from "../layouts/Agri/components/SellersSpaceSmall";
import SelectCategory from "../layouts/Agri/components/SelectCategory";
import ReportSpace from "../layouts/Agri/components/ReportSpace";
import {
  getCategories,
  getProduceTypes,
  getSellers,
  listReports,
  listAdverts,
  listUsersProduce,
} from "../../helpers/lib";

const Produce = ({
  produceData,
  categories,
  premiumAdverts,
  planAdverts,
  reports,
  sellerProduces,
  sellers,
}) => {
  const activePremiumAdverts = premiumAdverts.filter(
    (advert) =>
      advert.statusISLIST_Draft_Active_Deactivated_Reactivated_Archived ===
        "Active" ||
      advert.statusISLIST_Draft_Active_Deactivated_Reactivated_Archived ===
        "Reactivated"
  );

  const activePlanAdverts = planAdverts.filter(
    (advert) =>
      advert.statusISLIST_Draft_Active_Deactivated_Reactivated_Archived ===
        "Active" ||
      advert.statusISLIST_Draft_Active_Deactivated_Reactivated_Archived ===
        "Reactivated"
  );

  return (
    <CommonLayout title="collection" parent="home" sidebar={false}>
      <ProduceBanner
        produceData={produceData}
        tags={null}
        sellers={sellers}
        sellerProduces={sellerProduces}
      />
      <ProduceList
        sectionClass="small-section"
        itemHeight={60}
        categories={categories}
        type="produce"
      />
      <Container>
        <Row>
          <Col md="9">
            <AdSpaceSquare
              caption={produceData ? produceData.name : ""}
              description=" - Premium Ad Space"
              premiumAdverts={activePremiumAdverts}
            />
            <ReportSpace reports={reports} imgMaxWidth={200} size="small" />
            <AdSpaceSmall
              caption={produceData ? produceData.name : ""}
              description="Seller -Ad Space"
              sectionClass="small-section slick-15 pt-0 ml-3"
              planAdverts={activePlanAdverts}
            />
            <SellersSpaceSmall
              caption={produceData ? produceData.name : ""}
              description="Seller"
              sectionClass="small-section ratio_45 pt-0 ml-3"
              sellers={sellers}
              sellerProduces={sellerProduces}
            />
          </Col>
          <Col md="3">
            <SelectCategory produceData={produceData} type="produce" />
          </Col>
        </Row>
      </Container>
    </CommonLayout>
  );
};

export default Produce;

// export async function getStaticPaths() {
//     const categories = await getCategories()
//     const paths = categories.map(category=>{
//         return ({params: { id: category.numeric_id }})
//     })

//     return {
//         paths,
//         fallback: false
//     }
// }

export async function getServerSideProps({ params }) {
  const produceData = await getProduceTypes(params.id);
  const categories = await getCategories();
  const premiumAdverts = await listAdverts(
    "positionISbb_agrix_adverts_positionsID",
    null,
    null,
    "1",
    "RAND()"
  );
  const planAdverts = await listAdverts(
    "produce_categoryISbb_agrix_produce_typesID",
    params.id,
    null,
    "2"
  );
  const reports = await listReports(null, params.id);
  const sellerProduces = await listUsersProduce("1", params.id);
  const sellers = await getSellers();

  return {
    props: {
      produceData,
      categories,
      premiumAdverts,
      planAdverts,
      reports,
      sellerProduces,
      sellers,
    },
  };
}
