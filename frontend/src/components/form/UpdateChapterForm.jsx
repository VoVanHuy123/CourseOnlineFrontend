import { Button, Form, Popconfirm } from "antd";
import renderDynamicFormItems from "./DynamicFormItems";
import { useEffect } from "react";
import { endpoints } from "../../services/api";
import useFetchApi from "../../hooks/useFetchApi";



const UpdateChapterForm = ({ errorMsg, form, onFinish,chapter,deleted  }) => {
  const {loading,fetchApi}=useFetchApi();
const onDeleted=async()=>{
  const res = await fetchApi({
      method : "DELETE",
      url:endpoints['delete_chapter'](chapter?.id)
    })
    if(res.status === 200 ) {
      if(deleted) deleted(true);
      form.resetFields();
    }
}
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
useEffect(() => {
  if (chapter) {
    form.setFieldsValue({
      title: chapter.title,
      description: chapter.description,
      order: chapter.order,
    });
  }
}, [chapter]);

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
          <div className="flex flex-row gap-4">
            <Button className="w-full" type="primary" htmlType="submit">Cập nhật chương</Button>
            <Popconfirm
                title="Bạn có chắc chắn muốn xóa?"
                onConfirm={() => onDeleted()}
                okText="Xóa"
                cancelText="Hủy"
            >
                {/* <a className='bg-[#DC3C22] text-white rounded-md py-1.5 px-4' style={{ color: 'white' }}>Xóa</a> */}
                <Button className="w-full" color="danger" variant="solid">Xóa chương</Button>
            </Popconfirm>
          </div>
        </Form>
      </>
    );
  };
export default UpdateChapterForm