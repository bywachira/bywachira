import React from "react";
import Layout from "../components/Layout";
import Projects from "../containers/Projects";

const Index: React.FC<{}> = (): React.ReactElement => {
  return (
    <>
      <Layout>
        <div>
          <Projects />
        </div>
      </Layout>
    </>
  );
};

export default Index;
