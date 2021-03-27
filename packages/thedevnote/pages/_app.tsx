import "react-notion/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";
import "tailwindcss/tailwind.css";
import AppLayout from "../layouts/app-layout";

import "../styles.css";
import React from "react";

export default function MyApp({ Component, pageProps }: any) {
  const getLayout =
    Component?.getLayout ||
    ((page: React.ReactNode) => <AppLayout children={page} />);

  return getLayout(<Component {...pageProps} />);
}
