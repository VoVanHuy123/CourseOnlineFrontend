import { Button, Form } from "antd";
import renderDynamicFormItems from "./DynamicFormItems";



const UpdateChapterForm = ({ errorMsg, form, onFinish,chapter }) => {
    console.log(chapter)
    // console.log(chapter)
    // const chapterFields=[
    //         { name: "title", label: "Tên chương", rules: [{ required: true, message: "Vui lòng nhập tên chương" }], type: "input", placeholder: "VD: Chương 1: ..." },
    //         { name: "description", label: "Mô tả", type: "text", rules: [{ required: true, message: "Vui lòng mô tả chương" }], placeholder: "Mô tả nội dung chương" },
    //         { name: "order", label: "Thứ tự chương", type: "number", rules: [{ required: true, message: "Vui lòng điền thứ tự chương" }] },
    //     ]

    const chapterFields = [
  {
    name: "title",
    label: "Tên chương",
    rules: [{ required: true, message: "Vui lòng nhập tên chương" }],
    type: "input",
    placeholder: "VD: Chương 1: ...",
    ...(chapter && { initialValue: chapter.title || null }),
  },
  {
    name: "description",
    label: "Mô tả",
    type: "text",
    rules: [{ required: true, message: "Vui lòng mô tả chương" }],
    placeholder: "Mô tả nội dung chương",
    ...(chapter && { initialValue: chapter.description || null }),
  },
  {
    name: "order",
    label: "Thứ tự chương",
    type: "number",
    rules: [{ required: true, message: "Vui lòng điền thứ tự chương" }],
    ...(chapter && { initialValue: chapter.order || null }),
  },
];

     return (
      <>
      {errorMsg && (
        <div style={{ color: "red", marginBottom: 16 }}>
           {errorMsg}
        </div>
      )}
        <h3 className="text-lg font-bold mb-4">Cập nhật chương</h3>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          {renderDynamicFormItems(chapterFields)}
          <Button type="primary" htmlType="submit">Cập nhật</Button>
        </Form>
      </>
    );
  };
export default UpdateChapterForm