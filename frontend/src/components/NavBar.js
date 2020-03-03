import React from 'react';
import { Header, HeaderName } from 'carbon-components-react';
import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <Header>
            <Link to='/'>
                <HeaderName href="#" prefix="[Area 421]">
                    Github Issues Analytics Dashboard
                </HeaderName>
            </Link>
        </Header>
    );
};

export default NavBar;
