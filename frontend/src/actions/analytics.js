import {
    ANALYTICS_LOADING,
    ANALYTICS_SUCCESS,
    ANALYTICS_NOT_FOUND,
    ANALYTICS_ERROR
} from './types';

// improve later
export const getAnalytics = form => async dispatch => {
    const { ownerName, repoName, since, issueState } = form;

    dispatch({
        type: ANALYTICS_LOADING
    });

    try {
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
        const assigned = {};

        if (res.status === 200) {
            data.issues.labeled.forEach(issue => {
                if (issue.state === 'open') {
                    statesTagged.open++;
                }
                else {
                    statesTagged.closed++;
                }

                issue.assignees.forEach(assignee => {
                    if (assigned[assignee.login] === undefined) {
                        assigned[assignee.login] = {};
                    }
                    issue.labels.forEach(label => {
                        if (assigned[assignee.login][label] === undefined) {
                            assigned[assignee.login][label] = 1;
                        } else {
                            assigned[assignee.login][label]++;
                        }
                    });
                });

                // Object.keys(assigned).forEach(function (item) {
                //     console.log('=====');
                //     console.log(item); // key
                //     console.log('---');
                //     console.log(assigned[item]); // value
                //     console.log('=====');
                // });

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

            dispatch({
                type: ANALYTICS_SUCCESS,
                payload: { 
                    labels, 
                    statesTagged, 
                    statesUntagged, 
                    issues: data.issues,
                    assigned
                }
            });
        } else if (res.status === 404) { 
            dispatch({
                type: ANALYTICS_NOT_FOUND,
                payload: { 
                    error: 'Repository not found'
                }
            });
        } else {
            dispatch({
                type: ANALYTICS_ERROR,
                payload: { 
                    error: 'Unexpected error occurred'
                }
            });
        }
    } catch (e) {
        console.log(e);
        dispatch({
            type: ANALYTICS_ERROR,
            payload: { 
                error: 'Unexpected error occurred'
            }
        });
    }
};