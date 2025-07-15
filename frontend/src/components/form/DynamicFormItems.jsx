// src/components/forms/DynamicFormItems.jsx
import React from "react";
import { DatePicker, Form, Input, InputNumber, Select, Upload, Switch } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

const renderDynamicFormItems = (fields) => {
  return fields.map((field) => {
    let inputComponent = <Input />;

    switch (field.type) {
      case "password":
        inputComponent = <Input.Password placeholder={field.placeholder || ""} />;
        break;

      case "select":
        inputComponent = (
          <Select placeholder={field.placeholder || "Chọn"}>
            {(field.options || []).map((opt) => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
        );
        break;

      case "date":
        inputComponent = <DatePicker placeholder={field.placeholder || ""} style={{ width: "100%" }} />;
        break;

      case "int":
      case "number":
        inputComponent = <InputNumber placeholder={field.placeholder || ""} style={{ width: "100%" }} />;
        break;

      case "float":
        inputComponent = <InputNumber placeholder={field.placeholder || ""} step={0.01} style={{ width: "100%" }} />;
        break;

      case "text":
        inputComponent = <TextArea rows={4} placeholder={field.placeholder || ""} style={{ width: "100%" }} />;
        break;

      case "upload":
        inputComponent = (
          <Upload
            name="file"
            listType="picture"
            beforeUpload={() => false}
            maxCount={1}
          >
            <button type="button" className="ant-btn text-white">
              <UploadOutlined /> Chọn ảnh
            </button>
          </Upload>
        );
        break;

      case "switch":
        inputComponent = <Switch defaultChecked />;
        break;

      default:
        inputComponent = <Input placeholder={field.placeholder || ""} />;
    }

    return (
      <Form.Item
        key={field.name}
        label={field.label}
        name={field.name}
        // valuePropName={field.type === "switch" ? "checked" : "value"}
        valuePropName={field.type === "switch" ? "checked" : field.type === "upload" ? "fileList" : "value"}
        getValueFromEvent={field.type === "upload" ? (e) => e && e.fileList : undefined}
        rules={field.rules}
      >
        {inputComponent}
      </Form.Item>
    );
  });
};

export default renderDynamicFormItems;
