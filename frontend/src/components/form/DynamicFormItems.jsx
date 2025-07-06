// src/components/forms/DynamicFormItems.jsx
import React from "react";
import { Form, Input, Select } from "antd";

const { Option } = Select;

const renderDynamicFormItems = (fields) => {
  return fields.map((field) => {
    let inputComponent = <Input />;

    if (field.type === "password") {
      inputComponent = <Input.Password />;
    } else if (field.type === "select") {
      inputComponent = (
        <Select placeholder={field.placeholder || "Chọn"}>
          {(field.options || []).map((opt) => (
            <Option key={opt.value} value={opt.value}>
              {opt.label}
            </Option>
          ))}
        </Select>
      );
    }

    return (
      <Form.Item
        key={field.name}
        label={field.label}
        name={field.name}
        rules={field.rules}
      >
        {inputComponent}
      </Form.Item>
    );
  });
};

export default renderDynamicFormItems;
