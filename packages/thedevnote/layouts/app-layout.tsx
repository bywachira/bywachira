import React from "react";
import Nav from "../components/nav";

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="">
      <Nav />
    <div className="">{children}</div>
  </div>
);

export const getLayout = (page: React.ReactNode) => (
  <AppLayout>{page}</AppLayout>
);

export default AppLayout;
