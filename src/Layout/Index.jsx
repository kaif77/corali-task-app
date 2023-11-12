import React from "react";
import { Layout, theme } from "antd";
import { Content, Footer } from "antd/es/layout/layout";
import TaskDashboard from "../Task/TaskDashboard/TaskDashboard";

const Index = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout>
      <Content
        className="site-layout"
        style={{
          padding: "10px 50px",
        }}
      >
        <div style={{ borderRadius: "15px", background: colorBgContainer }}>
          <TaskDashboard />
        </div>
      </Content>
      <Footer
        style={{
          textAlign: "center",
        }}
      >
        ©2023 Created by Kaif. All Rights Reserved.
      </Footer>
    </Layout>
  );
};

export default Index;
