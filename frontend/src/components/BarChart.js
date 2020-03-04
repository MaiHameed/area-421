import React from "react";
import { Row, Column } from "carbon-components-react";
import { GroupedBarChart } from "@carbon/charts-react";
import "@carbon/charts/styles.css";

const generateData = (assigned, labels) => {
  const data = {
    labels: Object.keys(assigned),
    datasets: []
  };

  Object.keys(labels).forEach(label => {
    data.datasets.push({
      label: label,
      data: Object.values(
        Object.values(assigned).map(assignee =>
          assignee[label] ? assignee[label] : 0
        )
      )
    });
  });

  return data;
};
const BarChart = ({ assigned, labels }) => (
  <Row>
    <Column>
      {assigned && (
        <GroupedBarChart
          data={generateData(assigned, labels)}
          options={{
            title: "Assignee distribution",
            axes: {
              left: {
                primary: true
              },
              bottom: {
                scaleType: "labels",
                secondary: true
              }
            },
            height: "400px"
          }}
        />
      )}
    </Column>
  </Row>
);

export default BarChart;
