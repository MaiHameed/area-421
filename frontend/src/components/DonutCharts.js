import React from "react";

import { Row, Column } from "carbon-components-react";
import { DonutChart } from "@carbon/charts-react";
import "@carbon/charts/styles.css";

const DonutCharts = ({ labels, statesTagged, statesUntagged }) => {
  let allStateData;
  if (statesTagged && statesUntagged) {
    allStateData = {
      open: statesTagged.open + statesUntagged.open,
      closed: statesTagged.closed + statesUntagged.closed
    };
  }
  return (
    <Row>
      <Column>
        {labels && (
          <DonutChart
            data={{
              labels: Object.keys(labels),
              datasets: [
                {
                  label: "dataset1",
                  data: Object.values(labels)
                }
              ]
            }}
            options={{
              title: "Tag distribution",
              resizable: true,
              donut: {
                center: {
                  label: "Issues"
                }
              },
              height: "400px",
              width: "400px"
            }}
            style={{ margin: "0 auto" }}
          />
        )}
      </Column>
      <Column>
        {statesTagged && (
          <DonutChart
            data={{
              labels: Object.keys(allStateData),
              datasets: [
                {
                  label: "dataset2",
                  data: Object.values(allStateData),
                  fillColors: ["#28a745", "#cb2431"]
                }
              ]
            }}
            options={{
              title: "Issues Opened / closed",
              resizable: true,
              height: "400px",
              width: "400px"
            }}
          />
        )}
      </Column>
      <Column>
        {statesUntagged && (
          <DonutChart
            data={{
              labels: Object.keys(statesUntagged),
              datasets: [
                {
                  label: "dataset3",
                  data: Object.values(statesUntagged)
                }
              ]
            }}
            options={{
              title: "State distribution",
              resizable: true,
              donut: {
                center: {
                  label: "Untagged issues"
                }
              },
              height: "400px",
              width: "400px"
            }}
          />
        )}
      </Column>
    </Row>
  );
};

export default DonutCharts;
