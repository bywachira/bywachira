import Head from "next/head";
import React from "react";
import { AppContainer } from "../styled-components/styles";
import "../static/index.css";

type Props = {
  Component: any;
  pageProps: any;
};

const MyApp: React.FC<Props> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link rel="icon" type="image/png" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <meta name="title" content={"Erick Wachira"} />
        <meta name="description" content={"Summary bywachira"} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bywachira.com" />
        <meta property="og:title" content={"Erick Wachira"} />
        <meta property="og:description" content="Summary bywachira" />
        <meta
          property="og:image"
          content={
            "https://res.cloudinary.com/duoxba7n1/image/upload/v1597872359/blog/logo2.png"
          }
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={""} />
        <meta property="twitter:title" content="Erick Wachira" />
        <meta property="twitter:description" content={"Summary bywachira"} />
        <meta
          property="twitter:image"
          content={
            "https://res.cloudinary.com/duoxba7n1/image/upload/v1597872359/blog/logo2.png"
          }
        />
        <title>Erick Wachira</title>
      </Head>
      <AppContainer>
        <Component {...pageProps} />
      </AppContainer>
    </>
  );
};

export default MyApp;
