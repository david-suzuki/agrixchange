import React from "react";
import CommonLayout from "../components/layout/common-layout";
import Banner from "./layouts/Agri/components/Banner";
import ReportsAllList from "./layouts/Agri/components/ReportsAllList";
import ProduceList from "./layouts/Agri/components/ProduceList";
import { getBanner, listReports, getCategories } from "../helpers/lib";

const Reports = ({ categories, reports, banner }) => {
  return (
    <CommonLayout title="collection" parent="home" sidebar={false}>
      <Banner banner={banner} />
      <ProduceList
        sectionClass="section-b-space"
        categories={categories}
        type="report"
      />
      <ReportsAllList reports={reports} imgMaxWidth={280} />
    </CommonLayout>
  );
};

export default Reports;

export async function getServerSideProps() {
  const categories = await getCategories();
  const reports = await listReports("1");
  const banner = await getBanner();

  return {
    props: {
      categories,
      reports,
      banner,
    },
  };
}
