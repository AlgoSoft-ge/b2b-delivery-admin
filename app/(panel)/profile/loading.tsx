import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Space, Spin } from "antd";

const Loading: React.FC = () => (
  <Space className="w-screen h-[94vh] flex justify-center items-center">
    <Spin
      indicator={
        <LoadingOutlined
          style={{ fontSize: 60 }}
          spin
        />
      }
    />
  </Space>
);

export default Loading;
