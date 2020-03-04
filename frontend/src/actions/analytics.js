import {
    ANALYTICS_LOADING,
    ANALYTICS_SUCCESS,
    ANALYTICS_NOT_FOUND,
    ANALYTICS_ERROR
} from './types';

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

            dispatch({
                type: ANALYTICS_SUCCESS,
                payload: { 
                    labels, 
                    statesTagged, 
                    statesUntagged, 
                    issues: data.issues
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