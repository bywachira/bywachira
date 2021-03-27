import React from "react";
import Head from "next/head";

type MetaProps = {
  title?: string;
  description?: string;
  image?: any;
  link?: string;
};

export default function Meta(props: MetaProps): React.ReactElement {
  const TITLE = props.title || "The Dev Note";
  const DESCRIPTION =
    props.description ||
    "The 'Dev Note', which belonged to the developers and makers of this world, and grants them the supernatural ability to jot down things they learned, the mistakes, what they are building, and more in its pages.";
  const IMAGE = props.image || "/thedevnote.png";
  const LINK = props.link || "https://thedevnote.xyz";

  return (
    <Head key={1}>
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="manifest" href="/manifest.json" />
      <title>The Dev Note</title>
      <meta name="title" content={TITLE} />
      <meta name="description" content={DESCRIPTION} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={LINK} />
      <meta property="og:title" content={TITLE} />
      <meta property="og:description" content={DESCRIPTION} />
      <meta property="og:image" content={IMAGE} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={LINK} />
      <meta property="twitter:title" content={TITLE} />
      <meta property="twitter:description" content={DESCRIPTION} />
      <meta property="twitter:image" content={IMAGE} />
    </Head>
  );
}
