import React from "react";
import { AppContainer } from "../styled-components/styles";
import "../static/index.css";

type Props = {
  Component: any;
  pageProps: any;
};

const MyApp: React.FC<Props> = ({ Component, pageProps }) => {
  return (
    <AppContainer>
      <Component {...pageProps} />
    </AppContainer>
  );
};

export default MyApp;
