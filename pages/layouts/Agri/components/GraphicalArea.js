import React, { useState } from "react";
import PriceLineGraph from "./PriceLineGraph";
import ProduceGraphicalFilter from "./ProduceGraphicalFilter";
import SeasonalPieChart from "./SeasonalPieChart";

const GraphicalArea = ({ usersProduce, pricingLogs }) => {
  const [lineGraphProduce, setLineGraphProduce] = useState("");
  const [pieChartProduce, setPieChartProduce] = useState("");

  return (
    <div id="graphs">
      <ProduceGraphicalFilter
        usersProduce={usersProduce}
        onFilter={(val) => setLineGraphProduce(val)}
      />
      <PriceLineGraph
        numeric_id={lineGraphProduce}
        pricelogs={pricingLogs}
        graphTitle="Price Log Graph"
      />
      <ProduceGraphicalFilter
        usersProduce={usersProduce}
        onFilter={(val) => setPieChartProduce(val)}
      />
      <SeasonalPieChart
        usersProduce={usersProduce}
        numeric_id={pieChartProduce}
        graphTitle="Seasonal Pie Chart"
      />
    </div>
  );
};

export default GraphicalArea;
