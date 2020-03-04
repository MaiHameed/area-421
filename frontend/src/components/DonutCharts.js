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
      {labels && (
        <React.Fragment>
          <Column>
            <br />
            <br />
            <br />
            <br />
            <p>Manually tagged issues: </p>
            <h1>{statesTagged.open + statesTagged.closed}</h1>
            <br />
            <p>We tagged: </p>
            <h1>{statesUntagged.open + statesUntagged.closed}</h1>
            <br />
            <p>Total issues:</p>
            <h1>{allStateData.open + allStateData.closed}</h1>
          </Column>
          <Column>
            <DonutChart
              data={{
                labels: Object.keys(labels),
                datasets: [
                  {
                    label: "dataset1",
                    data: Object.values(labels),
                    fillColors: ["#ee0701", "#1191e6", "#008672"]
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
                  donut: {
                    center: {
                      label: "Total issues"
                    }
                  },
                  height: "400px",
                  width: "400px"
                }}
              />
            )}
          </Column>
        </React.Fragment>
      )}
    </Row>
  );
};

export default DonutCharts;
