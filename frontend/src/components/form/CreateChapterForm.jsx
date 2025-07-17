import { Button, Form } from "antd";
import renderDynamicFormItems from "./DynamicFormItems";

const chapterFields = [
    { name: "title", label: "Tên chương", rules: [{ required: true, message: "Vui lòng nhập tên chương" }], type: "input", placeholder: "VD: Chương 1: ..." },
    { name: "description", label: "Mô tả", type: "text", rules: [{ required: true, message: "Vui lòng mô tả chương" }], placeholder: "Mô tả nội dung chương" },
    { name: "order", label: "Thứ tự chương", type: "number", rules: [{ required: true, message: "Vui lòng điền thứ tự chương" }] },
  ]

const CreateChapterForm = ({ errorMsg, form, onFinish }) => {
    return (
      <>
      {errorMsg && (
        <div style={{ color: "red", marginBottom: 16 }}>
           {errorMsg}
        </div>
      )}
        <h3 className="text-lg font-bold mb-4">Tạo chương mới</h3>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          {renderDynamicFormItems(chapterFields)}
          <Button type="primary" htmlType="submit">Tạo chương</Button>
        </Form>
      </>
    );
  };
export default CreateChapterForm