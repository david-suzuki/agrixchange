import React from "react";
import CommonLayout from "../../components/layout/common-layout";
import ProduceBanner from "../layouts/Agri/components/ProduceBanner";
import ProduceList from "../layouts/Agri/components/ProduceList";
import AdSpaceSquareProduce from "../layouts/Agri/components/AdSpaceSquareProduce";
import AdSpaceProduce from "../layouts/Agri/components/AdSpaceProduce";
import SellersSpaceSmall from "../layouts/Agri/components/SellersSpaceSmall";
import ReportSpace from "../layouts/Agri/components/ReportSpace";
import ProduceMap from "../layouts/Agri/components/ProduceMap";
import {
  listProduceTypes,
  getProduceTypes,
  getSellers,
  listReports,
  listAdverts,
  listUsersProduce,
} from "../../helpers/lib";

const Produce = ({
  produceData,
  produceTypes,
  premiumAdverts,
  planAdverts,
  reports,
  sellers,
  sellerProduces,
}) => {
  const tags = produceTypes.filter(
    (produceType) =>
      produceType.refers_toISbb_agrix_produce_typesID === produceData.numeric_id
  );
  const categories = produceTypes.filter(
    (produceType) => produceType.refers_toISbb_agrix_produce_typesID === null
  );

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
        tags={tags}
        sellers={sellers}
        sellerProduces={sellerProduces}
      />
      <ProduceList
        sectionClass="small-section"
        itemHeight={60}
        categories={categories}
        type="produce"
      />
      <ProduceMap categories={categories} />
      <AdSpaceSquareProduce
        caption={produceData ? produceData.name : ""}
        description=" - Premium Ad Space"
        premiumAdverts={activePremiumAdverts}
      />
      <ReportSpace reports={reports} imgMaxWidth={280} size="normal" />
      <AdSpaceProduce
        caption={produceData ? produceData.name : ""}
        description="Seller -Ad Space"
        sectionClass="small-section slick-15 pt-0 ml-3"
        planAdverts={activePlanAdverts}
      />
      <SellersSpaceSmall
        caption={produceData ? produceData.name : ""}
        description="Seller"
        sectionClass="small-section ratio_45 pt-0 mx-4"
        sellers={sellers}
        sellerProduces={sellerProduces}
      />
    </CommonLayout>
  );
};

export default Produce;

// export async function getStaticPaths() {
//     let produces = await listProduceTypes()
//     let paths = []
//     for (let produce of produces) {
//         if (produce.refers_toISbb_agrix_produce_typesID !== null) {
//             paths.push({ params: { id: produce.numeric_id }})
//         }
//     }

//     return {
//         paths,
//         fallback: false
//     }
// }

export async function getServerSideProps({ params }) {
  const produceData = await getProduceTypes(params.id);
  const produceTypes = await listProduceTypes();
  const premiumAdverts = await listAdverts(
    "positionISbb_agrix_adverts_positionsID",
    null,
    null,
    "1",
    "RAND()"
  );
  const planAdverts = await listAdverts(
    "produce_categoryISbb_agrix_produce_typesID",
    null,
    params.id,
    "2"
  );
  const reports = await listReports(null, null, params.id);
  const sellers = await getSellers();
  const sellerProduces = await listUsersProduce("1", null, params.id);

  return {
    props: {
      produceData,
      produceTypes,
      premiumAdverts,
      planAdverts,
      reports,
      sellers,
      sellerProduces,
    },
  };
}
