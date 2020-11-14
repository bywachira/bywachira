import React from "react";
import { AppContainer } from "../styled-components/Layout";
import Nav from "./Nav";

type Props = {
  children: any;
  // pageTitle: string,
  // description: string,
  // image: string,
  // url: string
};

const Layout: React.FC<Props> = (props): React.ReactElement => {
  return (
    <React.Fragment>
      <Nav />
      <AppContainer>{props.children}</AppContainer>
    </React.Fragment>
  );
};

export default Layout;
