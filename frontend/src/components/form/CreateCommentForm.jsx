import { Button, Form } from "antd";
import renderDynamicFormItems from "./DynamicFormItems";
import useFetchApi from "../../hooks/useFetchApi";
import { endpoints } from "../../services/api";
import { SendOutlined } from '@ant-design/icons';


const CreateCommentForm= ({lesson_id,reply_to=null,onSet}) =>{
  const [form] = Form.useForm();
  const { fetchApi } = useFetchApi();

    const commentFields = [
    { name: "content", label: "", rules: [{ required: true, message: "Vui lòng nhập nội dung" }], type: "text", placeholder: "nội dung" },
  ]
  const onFinish = async (values) =>{
    const data = {
      ...values,
      lesson_id,
      ...(reply_to ? { reply_to } : {})
    }
    const res = await fetchApi({
        url: endpoints['comments'], // ✅ endpoint tạo comment (bạn thay đúng)
        method: "POST",
        data: data,
      });
      console.log(data)
      console.log(res.data)
      if (res.status === 201 || res.status === 200) {
        console.log("Gửi bình luận thành công");
        form.resetFields();

        // Gọi lại hàm cha truyền vào:
        if (onSet) {
          onSet(res.data, reply_to); // reply mới + id comment cha
        }
      }
  }
     return (
      <div className="pt-4">
        
        <Form layout="vertical" form={form} onFinish={onFinish} onClick={(e) =>{
          e.stopPropagation();

        }}>
          {renderDynamicFormItems(commentFields)}
          <div className="flex w-full flex-row justify-end gap-4">
          <Button className="" type="primary" htmlType="submit"><SendOutlined /> gửi</Button>

          </div>
        </Form>
      </div>
    );
};
export default CreateCommentForm;