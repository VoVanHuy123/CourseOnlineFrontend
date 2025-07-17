import { Button, Form } from "antd";
import renderDynamicFormItems from "./DynamicFormItems";

 
 const UpdateLessonForm = ({errorMsg,form,onFinish,lesson}) => {
    const lessonFields = [
  {
    name: "title",
    label: "Tiêu đề bài học",
    type: "input",
    placeholder: "VD: Giới thiệu React",
    rules: [{ required: true, message: "Vui lòng nhập tiêu đề bài học" }],
     ...(lesson && { initialValue: lesson.title || null }),
  },
  {
    name: "description",
    label: "Mô tả",
    type: "textarea",
    placeholder: "VD: Bài học giới thiệu về React và các thành phần cơ bản...",
    rules: [{ required: true, message: "Vui lòng nhập mô tả bài học" }],
    ...(lesson && { initialValue: lesson.description || null }),
  },
  {
    name: "type",
    label: "Loại bài học",
    type: "select",
    rules: [{ required: true, message: "Vui lòng chọn loại bài học" }],
    ...(lesson && { initialValue: lesson.type || null }),
    options: [
      { label: "Video", value: "video" },
      { label: "Tệp tài liệu (PDF, Word...)", value: "file" },
      { label: "Văn bản", value: "text" }
    ],
  },
  {
    name: "order",
    label: "Thứ tự",
    type: "number",
    placeholder: "VD: 1",
    rules: [],
    ...(lesson && { initialValue: lesson.order || null }),
  },
  {
    name: "is_published",
    label: "Công khai bài học",
    type: "switch",
    initialValue: true,
    rules: [],
    ...(lesson && { initialValue: lesson.is_published || null }),
  },
  {
    name: "content_url",
    label: "Tải lên file hoặc video",
    type: "upload", // Phần xử lý upload riêng (custom render)
    rules: [{ required: false }],
    ...(lesson && { initialValue: [
            {
                uid: "-1",
                name: lesson.content_url ? lesson.content_url.split("/").pop() : "uploaded_file", // tên file từ URL
                status: "done",
                url: lesson.content_url,
            },
        ],
    } || null),
    // onChange: handleUploadChange
  },
];
    return (
      <>
        <h3 className="text-lg font-bold mb-4">Chập nhật bài học</h3>
        {errorMsg && (
          <div style={{ color: "red", marginBottom: 16 }}>
             {errorMsg}
          </div>
        )}
        <Form layout="vertical" form={form} onFinish={onFinish}>
          {renderDynamicFormItems(lessonFields)}
          {lesson.content_url && (
  <>
    {lesson.content_url.match(/\.(jpeg|jpg|png|gif)$/i) ? (
      <img
        alt={lesson.title}
        src={lesson.content_url}
        style={{ height: 180, objectFit: "cover", marginBottom: 16 }}
      />
    ) : lesson.content_url.match(/\.(mp4|webm|ogg)$/i) ? (
      <video
        controls
        style={{ height: 240, marginBottom: 16 }}
        src={lesson.content_url}
      >
        Trình duyệt không hỗ trợ video.
      </video>
    ) : (
      <a
        href={lesson.content_url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline mb-4 block"
      >
        Xem tài liệu / tải xuống
      </a>
    )}
  </>
)}

          <Button type="primary" htmlType="submit">Cập nhật bài học</Button>
        </Form>
      </>
    );
  };
export default UpdateLessonForm;