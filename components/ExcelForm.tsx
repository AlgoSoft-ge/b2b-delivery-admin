import React from "react";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { message, Upload } from "antd";
import { useRouter } from "next/navigation";

const { Dragger } = Upload;

const ExcelUpload: React.FC<{
  token: string | undefined;
  setIsAdd: (isAdd: boolean) => void;
}> = ({ token, setIsAdd }) => {
  const router = useRouter();
  const props: UploadProps = {
    name: "file",
    multiple: false,
    action: `${process.env.API_URL}/upload-excel/`,
    headers: {
      Authorization: `Token ${token}`,
    },
    async onChange(info) {
      const { status } = info.file;

      if (status === "done" && info.file) {
        message.success(
          `${info.file.name} ფაილი წარმატებით აიტვირთა.`
        );
        router.refresh();
        setIsAdd(false);
      }
    },
  };
  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        დააკლიკეთ ან ჩააგდეთ ექსელის ფაილი
        ასატვირთად
      </p>
    </Dragger>
  );
};

export default ExcelUpload;
