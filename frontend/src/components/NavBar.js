import React from "react";
import {
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem
} from "carbon-components-react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <Header>
      <HeaderName prefix="[Area 421]">
        Github Issues Analytics Dashboard
      </HeaderName>
      <HeaderNavigation>
        <HeaderMenuItem>
          <Link to="/" style={{ underline: "none" }}>
            Home
          </Link>
        </HeaderMenuItem>
        <HeaderMenuItem>
          <Link to="/analytics">Dashboard</Link>
        </HeaderMenuItem>
      </HeaderNavigation>
    </Header>
  );
};

export default NavBar;
