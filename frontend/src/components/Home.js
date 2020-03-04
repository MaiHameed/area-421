import React from 'react';

import { Button, Grid, Row, Column } from 'carbon-components-react';
import { Link } from 'react-router-dom';

import AnalyticsSVG from '../svgs/undraw_all_the_data_h4ki.svg';

const Home = () => {
    return (
        <div style={{ margin: '10vh' }}>
            <Grid>
                <Row>
                    <Column>
                        <h1>Github issues analytics dashboard</h1>
                        <br />
                        <br />
                        <p>Visualize your Github issues and use our AI model to tag untagged issues based on existing tags.</p>
                        <Link to='/analytics'>
                            <Button style={{ marginTop: '11em' }}>Get started now!</Button>
                        </Link>
                    </Column>
                    <Column>
                        <img src={AnalyticsSVG} alt="analytics" width='75%' height='75%' />
                    </Column>
                </Row>
            </Grid>
        </div>
    );
};

export default Home;