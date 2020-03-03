import React from 'react';

import { Button } from 'carbon-components-react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div style={{ margin: '5em 10em' }}>
            <h1>Github issues analytics dashboard</h1>
            <p>Visualize your Github issues and use our AI model to tag untagged issues based on existing tags.</p>
            <br />
            <hr />
            <br />
            <Link to='/analytics'>
                <Button>Get started now!</Button>
            </Link>
        </div>
    );
};

export default Home;