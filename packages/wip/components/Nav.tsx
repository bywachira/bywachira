import React from "react";
import { Nav, Logo, NavContainer } from "../styled-components/Layout";

const Navbar: React.FC<{}> = (): React.ReactElement => {
  return (
    <NavContainer>
      <Nav>
        <Logo src="/chirp-no-bg.svg" alt="" />
      </Nav>
    </NavContainer>
  );
};

export default Navbar;
