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
    DatePickerInput } from 'carbon-components-react';

class Analytics extends React.Component {
    state = {
        ownerName: 'openliberty',
        repoName: 'open-liberty',
        since: new Date().toISOString(),
        loading: false,
        error: undefined
    };

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    onSearch = async () => {
        const { ownerName, repoName, since } = this.state;
        try {
            this.setState({ loading: true, error: undefined });

            const url = `/api/labels/${ownerName}/${repoName}?since=${encodeURIComponent(since)}`;
            const res = await fetch(url);
            const data = await res.json();

            if (res.status === 200) {
                // do stuff here
                //
                //
                //
                // do stuff here
                this.setState({ loading: false });
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
                {console.log(this.state)}   
                <Grid>
                    <Row>
                        <Column>
                            <h1>Gather analytics data for a Github repository</h1>
                            <br />
                            {this.state.error ? 
                                <InlineNotification 
                                    kind='error'
                                    title=''
                                    lowContrast
                                    subtitle={this.state.error}
                                    style={{ minWidth: '100%' }}
                                /> : null
                            }
                        </Column>
                    </Row>
                    <Row>
                        <Column>
                            <TextInput
                                type="text"
                                // size="xl"
                                name="ownerName"
                                labelText="Repository Owner"
                                placeholder="e.g., openliberty"
                                defaultValue={this.state.ownerName}
                                onChange={(e) => this.onChange(e)}
                            />
                        </Column>
                        <Column>
                            <TextInput
                                type="text"
                                // size="xl"
                                name="repoName"
                                labelText="Repository Name"
                                placeholder="e.g., open-liberty"
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
                                    labelText="Data since"
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
                            {this.state.loading ?
                                <ButtonSkeleton style={{ float: 'right' }}/> :
                                <Button onClick={this.onSearch} style={{ float: 'right' }}>Gather data!</Button>     
                            }
                        </Column>
                    </Row>
                </Grid> 
            </div>
        );
    }

}

export default Analytics;
