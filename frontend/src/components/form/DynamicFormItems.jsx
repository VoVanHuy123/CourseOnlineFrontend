// // src/components/forms/DynamicFormItems.jsx
// import React from "react";
// import { DatePicker, Form, Input, InputNumber, Select, Upload, Switch } from "antd";
// import { UploadOutlined } from "@ant-design/icons";

// const { TextArea } = Input;
// const { Option } = Select;

// const renderDynamicFormItems = (fields, options = {}) => {
//   const { onUploadChange } = options;
//   return fields.map((field) => {
//     let inputComponent = <Input />;

//     switch (field.type) {
//       case "password":
//         inputComponent = <Input.Password placeholder={field.placeholder || ""} />;
//         break;

//       case "select":
//         inputComponent = (
//           <Select placeholder={field.placeholder || "Chọn"}>
//             {(field.options || []).map((opt) => (
//               <Option key={opt.value} value={opt.value}>
//                 {opt.label}
//               </Option>
//             ))}
//           </Select>
//         );
//         break;

//       case "date":
//         inputComponent = <DatePicker placeholder={field.placeholder || ""} style={{ width: "100%" }} />;
//         break;

//       case "int":
//       case "number":
//         inputComponent = <InputNumber placeholder={field.placeholder || ""} style={{ width: "100%" }} />;
//         break;

//       case "float":
//         inputComponent = <InputNumber placeholder={field.placeholder || ""} step={0.01} style={{ width: "100%" }} />;
//         break;

//       case "text":
//         inputComponent = <TextArea rows={4} placeholder={field.placeholder || ""} style={{ width: "100%" }} />;
//         break;

//       case "upload":
//         inputComponent = (
//           <Upload
//             name="file"
//             listType="picture"
//             beforeUpload={() => false}
//             maxCount={1}
//             //  onChange={ onUploadChange}
//             //  onChange={field.onChange || onUploadChange}
//           >
//             <button type="button" className="ant-btn text-white">
//               <UploadOutlined /> Chọn ảnh
//             </button>
//           </Upload>
//         );
//         break;

//       case "switch":
//         inputComponent = <Switch defaultChecked = {field.initialValue} />;
//         break;

//       default:
//         inputComponent = <Input placeholder={field.placeholder || ""} />;
//     }

//     return (
//       <Form.Item
//         key={field.name}
//         label={field.label}
//         name={field.name}
//         // valuePropName={field.type === "switch" ? "checked" : "value"}
//         initialValue={field.initialValue}
//         valuePropName={field.type === "switch" ? "checked" : field.type === "upload" ? "fileList" : "value"}
//         getValueFromEvent={field.type === "upload" ? (e) => e && e.fileList : undefined}
//         rules={field.rules}
//       >
//         {inputComponent}
//       </Form.Item>
//     );
//   });
// };

// export default renderDynamicFormItems;

import React from "react";
import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Switch,
  TimePicker,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Option } = Select;

const renderDynamicFormItems = (fields, options = {}) => {
  const { onUploadChange, record = {}, disabled = false,readOnly=false } = options;

  return fields.map((field) => {
    const isDisabled = field.disabled ?? disabled;
    const isReadOnly = field.readOnly ||readOnly;
    const value = record[field.name];

    let inputComponent = <Input />;

    switch (field.type) {
      case "password":
        inputComponent = (
          <Input.Password
            className="border border-black"
            placeholder={field.placeholder || ""}
            readOnly={isReadOnly}
            autoComplete="off"
          />
        );
        break;
      default:
        inputComponent = (
          <Input
            className="border border-black"
            placeholder={field.placeholder || ""}
            readOnly={isReadOnly}
          />
        );
        break;
      case "text":
        inputComponent = <TextArea className="border border-black placeholder-gray-500" rows={4} placeholder={field.placeholder || ""} style={{ width: "100%" }} />;
        break;
      case "select":
        if (isReadOnly) {
          const selected = field.options?.find((opt) => opt.value === value);
          inputComponent = (
            <Select
              value={value}
              open={false} // khóa dropdown
              className="border border-black rounded-md"
              style={{
                backgroundColor: "#fff",
                color: "#000",
                fontWeight: "normal",
              }}
            >
              {selected ? (
                <Option value={selected.value}>{selected.label}</Option>
              ) : null}
            </Select>
          );
        } else {
          inputComponent = (
            <Select
              className="border border-black rounded-md"
              placeholder={field.placeholder || "Chọn"}
              onChange={field.onChange}
            >
              {(field.options || []).map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
          );
        }
        break;

      case "number":
      case "int":
      case "float":
        inputComponent = (
          <InputNumber
            style={{ width: "100%" }}
            placeholder={field.placeholder || ""}
            readOnly={isReadOnly}
            className="border border-black"
            step={field.type === "float" ? 0.01 : 1}
          />
        );
        break

      case "date":
        inputComponent = (
          <DatePicker
            style={{ width: "100%" }}
            className="border border-black"
            placeholder={field.placeholder || ""}
            format="DD/MM/YYYY"
            inputReadOnly={isReadOnly}
            open={isReadOnly ? false : undefined}  // <- khóa popup khi readOnly
            allowClear = {isReadOnly ? false : undefined}
          />
        );
        break;

      case "time":
        inputComponent = (
          <TimePicker
            format="HH:mm"
            placeholder={field.placeholder || ""}
            style={{ width: "100%" }}
            className="border border-black"
            inputReadOnly={isReadOnly}
          />
        );
        break;

      case "upload":
        inputComponent = (
          <Upload
            name="file"
            listType="picture"
            beforeUpload={() => false}
            maxCount={1}
            disabled={isReadOnly}
          >
            <button type="button" className="ant-btn text-white">
              <UploadOutlined /> {field.title}
            </button>
          </Upload>
        );
        break;
        

      case "switch":
        inputComponent = (
          <Switch
            defaultChecked={field.initialValue}
            disabled={isReadOnly}
          />
        );
        break;
    case "email":
      inputComponent = (
        <Input
          type="email"
          className="border border-black"
          placeholder={field.placeholder || "Nhập email"}
          readOnly={isReadOnly}
        />
      );
      break;
    }

     return (
      <Form.Item
        key={field.name}
        label={field.label}
        name={field.name}
        // valuePropName={field.type === "switch" ? "checked" : "value"}
        initialValue={field.initialValue}
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
