import React from 'react';

import { Button, Grid, Row, Column } from 'carbon-components-react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div style={{ margin: '5em' }}>
            <Grid>
                <Row>
                    <Column>
                        <h1>Github issues analytics dashboard</h1>
                        <p>Visualize your Github issues and use our AI model to tag untagged issues based on existing tags.</p>
                    </Column>
                </Row>
                <Row>
                    <Column style={{ marginTop: '5em' }}>
                        <Link to='/analytics'>
                            <Button>Get started now!</Button>
                        </Link>
                    </Column>
                </Row>
            </Grid>
        </div>
    );
};

export default Home;