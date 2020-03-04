import React from "react";

import { connect } from "react-redux";
import { getAnalytics } from "../actions/analytics";

import { Grid } from "carbon-components-react";

import UntagedIssuesTable from "./UntaggedIssuesTable";
import AnalyticsForm from "./AnalyticsForm";
import DonutCharts from "./DonutCharts";
import BarChart from "./BarChart";

import { issueStates } from "../utils/constants";

const Analytics = ({ form, analytics, getAnalytics }) => {
  return (
    <div style={{ margin: "5em" }}>
      <Grid>
        <AnalyticsForm
          loading={analytics.loading}
          errorMessage={analytics.error}
          initialValues={{
            ownerName: "",
            repoName: "",
            since: new Date().toISOString(),
            issueState: issueStates.ALL
          }}
          onSubmit={() => getAnalytics(form.values)}
        />
        <DonutCharts
          labels={analytics.labels}
          statesTagged={analytics.statesTagged}
          statesUntagged={analytics.statesUntagged}
        />
        <BarChart assigned={analytics.assigned} labels={analytics.labels} />
        <UntagedIssuesTable issues={analytics.issues} />
      </Grid>
    </div>
  );
};

const mapStateToProps = state => ({
  form: state.form.github,
  analytics: state.analytics
});

const mapDispatchToProps = {
  getAnalytics
};

export default connect(mapStateToProps, mapDispatchToProps)(Analytics);
