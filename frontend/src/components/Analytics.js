import React from 'react';
import { 
    TextInput, 
    Button, 
    ButtonSkeleton, 
    InlineNotification, 
    Grid, 
    Row, 
    Column, 
    DatePicker, 
    DatePickerInput,
    Dropdown } from 'carbon-components-react';
import { DonutChart } from '@carbon/charts-react';
import '@carbon/charts/styles.css';

import UntagedIssuesTable from './UntaggedIssuesTable';

const issueStates = {
    ALL: 'all',
    OPEN: 'open',
    CLOSED: 'closed'
};

class Analytics extends React.Component {
    state = {
        ownerName: 'openliberty',
        repoName: 'open-liberty',
        since: new Date().toISOString(),
        loading: false,
        error: undefined,
        labels: undefined,
        issues: undefined,
        states: undefined,
        issueState: issueStates.ALL
    };

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    onSearch = async () => {
        const { ownerName, repoName, since, issueState } = this.state;
        try {
            this.setState({ loading: true, error: undefined });

            const url = `/api/labels/${ownerName}/${repoName}?since=${encodeURIComponent(since)}&issue_state=${issueState}`;
            const res = await fetch(url);
            const data = await res.json();

            const labels = {};
            const statesTagged = {
                open: 0,
                closed: 0
            }
            const statesUntagged = {
                open: 0,
                closed: 0
            }

            if (res.status === 200) {
                data.issues.labeled.forEach(issue => {
                    if (issue.state === 'open') {
                        statesTagged.open++;
                    }
                    else {
                        statesTagged.closed++;
                    }

                    issue.labels.forEach(label => { 
                        if (labels[label] !== undefined) {
                            labels[label]++;
                        } else {
                            labels[label] = 1;
                        }
                    });
                });

                data.issues.unlabeled.forEach(issue => {
                    if (issue.state === 'open') {
                        statesUntagged.open++;
                    } else {
                        statesUntagged.closed++;
                    }

                    if (labels.none === undefined) {
                        labels.none = 1;
                    } else {
                        labels.none++;
                    }
                });

                this.setState({ 
                    labels, 
                    statesTagged, 
                    statesUntagged, 
                    issues: data.issues, 
                    loading: false 
                });
            } else if (res.status === 404) { 
                this.setState({ error: 'Repository not found', loading: false });
            } else {
                this.setState({ error: 'Unexpected error occurred', loading: false });
            }
        } catch (e) {
            this.setState({ error: 'Unexpected error occurred', loading: false });
        }
    }

    render() {
        return (
            <div style={{ margin: '5em' }}>
                <Grid>
                    <Row>
                        <Column>
                            <h1>Gather analytics data for a Github repository</h1>
                            <br />
                            {this.state.error &&
                                <InlineNotification 
                                    kind='error'
                                    title=''
                                    lowContrast
                                    subtitle={this.state.error}
                                    style={{ minWidth: '100%' }}
                                />
                            }
                        </Column>
                    </Row>
                    <Row>
                        <Column>
                            <TextInput
                                type="text"
                                name="ownerName"
                                labelText="Repository Owner"
                                placeholder="e.g., openliberty"
                                disabled={this.state.loading}
                                defaultValue={this.state.ownerName}
                                onChange={(e) => this.onChange(e)}
                            />
                        </Column>
                        <Column>
                            <TextInput
                                type="text"
                                name="repoName"
                                labelText="Repository Name"
                                placeholder="e.g., open-liberty"
                                disabled={this.state.loading}
                                defaultValue={this.state.repoName}
                                onChange={(e) => this.onChange(e)}
                            />
                        </Column>
                        <Column>
                            <DatePicker
                                dateFormat="m/d/Y"
                                datePickerType="single"
                                locale="en"
                                onChange={(e) => this.setState({ since: new Date(e[0]).toISOString() })}
                                >
                                <DatePickerInput
                                    disabled={this.state.loading}
                                    labelText="Created since"
                                    pattern="d{1,2}/d{1,2}/d{4}"
                                    placeholder="mm/dd/yyyy"
                                    type="text"
                                />
                            </DatePicker>
                        </Column>
                    </Row>
                    <Row>
                        <Column>
                            <br />
                            <Dropdown
                                titleText="Issue state"
                                items={Object.keys(issueStates)}
                                label={Object.keys(issueStates).find(key => issueStates[key] === this.state.issueState)}
                                onChange={e => this.setState({ issueState: issueStates[e.selectedItem] })}
                                disabled={this.state.loading}
                            />
                        </Column>
                        <Column />
                        <Column />
                    </Row>
                    <Row>
                        <Column>
                            <br />
                            <hr />
                            {this.state.loading ?
                                <ButtonSkeleton style={{ float: 'right' }}/> :
                                <Button onClick={this.onSearch} style={{ float: 'right' }}>Gather data!</Button>     
                            }
                        </Column>
                    </Row>
                    <Row>
                        <Column>
                            {this.state.labels &&
                                <DonutChart
                                    data={{
                                        "labels": Object.keys(this.state.labels),
                                        "datasets": [{
                                            "label": "dataset1",
                                            "data": Object.values(this.state.labels)
                                        }]
                                    }}
                                    options={{
                                        "title": "Tag distribution",
                                        "resizable": true,
                                        "donut": {
                                            "center": {
                                                "label": "Issues"
                                            }
                                        },
                                        "height": "400px",
                                        "width": "400px",
                                    }}
                                    style={{ margin: '0 auto' }}
                                />
                            }
                        </Column>
                        <Column>
                            {this.state.statesTagged &&
                                <DonutChart
                                    data={{
                                        "labels": Object.keys(this.state.statesTagged),
                                        "datasets": [{
                                            "label": "dataset1",
                                            "data": Object.values(this.state.statesTagged)
                                        }]
                                    }}
                                    options={{
                                        "title": "State distribution",
                                        "resizable": true,
                                        "donut": {
                                            "center": {
                                                "label": "Tagged issues"
                                            }
                                        },
                                        "height": "400px",
                                        "width": "400px"
                                    }}
                                />
                            }
                        </Column>
                        <Column>
                            {this.state.statesUntagged &&
                                <DonutChart
                                    data={{
                                        "labels": Object.keys(this.state.statesUntagged),
                                        "datasets": [{
                                            "label": "dataset1",
                                            "data": Object.values(this.state.statesUntagged)
                                        }]
                                    }}
                                    options={{
                                        "title": "State distribution",
                                        "resizable": true,
                                        "donut": {
                                            "center": {
                                                "label": "Untagged issues"
                                            }
                                        },
                                        "height": "400px",
                                        "width": "400px"
                                    }}
                                />
                            }
                        </Column>
                    </Row>
                    <Row>
                        <Column>
                            {this.state.issues && this.state.issues.unlabeled &&
                                <UntagedIssuesTable
                                    unlabeledIssues={this.state.issues.unlabeled} 
                                />
                            }
                        </Column>
                    </Row>
                </Grid> 
            </div>
        );
    }

}

export default Analytics;
