import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Card, Col, Collapse, Form, Input, List, Row, Spin, message } from "antd";
import useFetchApi from "../../hooks/useFetchApi";
import TextArea from "antd/es/input/TextArea";
import { endpoints } from "../../services/api";
import renderDynamicFormItems from "../../components/form/DynamicFormItems";
// import useFetchApi from "../hooks/useFetchApi";

const { Panel } = Collapse;


const CreateChapTerLesson = () => {
  const { id } = useParams(); // lấy id khóa học từ URL
  const { fetchApi } = useFetchApi();
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [selectedChapterId, setSelectedChapterId] = useState(-1)
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const [isCreateChapter, setIsCreateChapter] = useState(true);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [form] = Form.useForm();
  const loadCourse = async () => {
    try {
      const res = await fetchApi({
        method: "GET",
        url: `/courses/${id}`, // API lấy khóa học
      });

      if (res.status === 200) setCourse(res.data);
    } catch (err) {
      message.error("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  // Chapter===================================================
  const LoadChapters = async () => {
    try {
      const chapterRes = await fetchApi({
        method: "GET",
        url: endpoints['course-chapters'](id), // API lấy chương + bài học
      });
      if (chapterRes.status === 200) setChapters(chapterRes.data);
    } catch (err) {
      message.error("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };
  const createChapter = async (values) => {
    messageApi.open({
              key: "createChapter",
              type: "loading",
              content: "Đang tạo chương...",
            })
    const res = await fetchApi({
      method: "POST",
      url: endpoints["chapters"],
      data: { ...values, course_id: id },
    });
    if (res.status === 201) {
      message.success("Tạo chương thành công");

      messageApi.open({
        key: "createChapter",
        type: "success",
        content: "Tạo chương thành công!",
        duration: 3,
      });
      // ✅ Reset form
      form.resetFields();
      setChapters([
        ...chapters,
        {
          id: res.data.id,
          order: res.data.order,
          title: res.data.title,
          lessons: []
        }
      ])
    }else{
      messageApi.open({
          key: "createChapter",
          type: "error",
          content: res.error,
          duration: 5,
        });
    }
  }
  const chapterFields = [
    { name: "title", label: "Tên chương", rules: [{ required: true, message: "Vui lòng nhập tên chương" }], type: "input", placeholder: "VD: Chương 1: ..." },
    { name: "description", label: "Mô tả", type: "text", rules: [{ required: true, message: "Vui lòng mô tả chương" }], placeholder: "Mô tả nội dung chương" },
    { name: "order", label: "Thứ tự chương", type: "number", rules: [{ required: true, message: "Vui lòng điền thứ tự chương" }] },
  ]
  const CreateChapterForm = () => {
    return (
      <>
        <h3 className="text-lg font-bold mb-4">Tạo chương mới</h3>
        <Form layout="vertical" form={form} onFinish={createChapter}>
          {renderDynamicFormItems(chapterFields)}
          <Button type="primary" htmlType="submit">Tạo chương</Button>
        </Form>
      </>
    );
  };
  // Lesson ============================================
  // const handleUploadChange = (info) => {
  //   // const selectedFile = info.file.originFileObj;
  //   const fileList = values.content_url;
  //   const selectedFile = fileList && fileList.length > 0 ? fileList[0].originFileObj : null;
  //   setFile(selectedFile);
  // };
  const lessonFields = [
  {
    name: "title",
    label: "Tiêu đề bài học",
    type: "input",
    placeholder: "VD: Giới thiệu React",
    rules: [{ required: true, message: "Vui lòng nhập tiêu đề bài học" }],
  },
  {
    name: "description",
    label: "Mô tả",
    type: "textarea",
    placeholder: "VD: Bài học giới thiệu về React và các thành phần cơ bản...",
    rules: [{ required: true, message: "Vui lòng nhập mô tả bài học" }],
  },
  {
    name: "type",
    label: "Loại bài học",
    type: "select",
    rules: [{ required: true, message: "Vui lòng chọn loại bài học" }],
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
  },
  {
    name: "is_published",
    label: "Công khai bài học",
    type: "switch",
    initialValue: true,
    rules: [],
  },
  {
    name: "content_url",
    label: "Tải lên file hoặc video",
    type: "upload", // Phần xử lý upload riêng (custom render)
    rules: [{ required: false }],
    // onChange: handleUploadChange
  },
];

  
  const CreateLessonForm = () => {
    return (
      <>
        <h3 className="text-lg font-bold mb-4">Tạo bài học mới</h3>
        <Form layout="vertical" form={form} onFinish={createLesson}>
          {renderDynamicFormItems(lessonFields)}
          <Button type="primary" htmlType="submit">Tạo bài học</Button>
        </Form>
      </>
    );
  };
  const createLesson = async (values) => {
    console.log("vào")
    console.log(values)

    const fileList = values.content_url;
    const selectedFile = fileList && fileList.length > 0 ? fileList[0].originFileObj : null;
    
    if (!selectedFile && values.type !== "text") {
    // if (!file && values.type !== "text") {
      message.error("Vui lòng chọn file/video phù hợp");
      return;
    }
    console.log("vào 1")
    const formData = new FormData();
    for (const key in values) {
      if (key === "content_url") continue;
      formData.append(key, values[key]);
    }
    formData.append("chapter_id",selectedChapterId)
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    try {
      setUploading(true);
      messageApi.open({
              key: "createLesson",
              type: "loading",
              content: "Đang tạo bài học...",
            })
      console.log("=== FormData đang gửi ===");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: [File] name=${value.name}, size=${value.size}, type=${value.type}`);
        } else {
          console.log(`${key}:`, value);
        }
      }
      const res = await fetchApi({
        method : "POST",
        url : endpoints['lessons'],
        data: formData
      })
      if(res.status === 201){
        messageApi.open({
              key: "createLesson",
              type: "success",
              content: "Tạo bài học thành công...",
              duration:3
            })
        console.log("tạo thành công")
        message.success("✅ Tạo bài học thành công!");
        form.resetFields();
        setFile(null);
      }else{
        console.log(":tạo thất bại")
        messageApi.open({
              key: "createLesson",
              type: "error",
              content: res.error,
              duration:3
            })
      }
    } catch (err) {
      console.error(err);
      message.error("❌ Lỗi khi tạo bài học!");
    } finally {
      setUploading(false);
    }
  };
  useEffect(() => {
    loadCourse();
    LoadChapters();
  }, [id]);
  if (loading) return <Spin fullscreen />;
  return (
    <>
    {contextHolder} 
      <Row gutter={[24]} className="mb-6">
        <Col span={24}>
          <div style={{ flex: 2, padding: 16, background: "#fff", borderRadius: 8 }}>
            <h1>{selectedLesson?.title || course?.title}</h1>
            <p>{selectedLesson?.description || course?.description}</p>
          </div>
        </Col>
      </Row>
      <Row gutter={24}>
        {/* Cột trái - Form nhập liệu */}
        <Col span={16}>
          <Card title={isCreateChapter ? "Tạo chương" : "Tạo chương / bài học"}>
            {/* Form tạo Chapter hoặc Lesson */}
            <div className="flex-1 space-y-8">
              <div className="bg-white p-6 rounded shadow">
                
                {isCreateChapter ? <CreateChapterForm /> : <CreateLessonForm />}
              </div>
            </div>
          </Card>
        </Col>

        {/* Cột phải - Danh sách đã tạo */}
        <Col span={8}>
          <Card title="Danh sách chương & bài học">
            {chapters.length === 0 ? (
              <>
                <p style={{ textAlign: "center", color: "#999" }}>Chưa có chương nào</p>
                <div className="w-full mt-8" style={{ textAlign: "center" }}>
                  <Button onClick={() => { setIsCreateChapter(true) }} type="primary">Tạo chương</Button>
                </div>
              </>

            ) : (
              <>
                <Collapse
                  accordion
                  onChange={(key) => {
                    setSelectedChapterId(key);  // key chính là chapter.id được chọn
                  }}
                  items={chapters.map((chapter) => ({
                    key: chapter.id,
                    label: chapter.title,
                    children: (
                      <>
                        <List
                          dataSource={chapter.lessons || []}
                          renderItem={(lesson) => (
                            <List.Item
                              onClick={() => setSelectedLesson(lesson)}
                              style={{ cursor: "pointer" }}
                            >
                              {lesson.title}
                            </List.Item>
                          )}

                        />
                        <div className="w-full mt-8" style={{ textAlign: "center" }}>
                          <Button onClick={() => { setIsCreateChapter(false) }} type="primary">Tạo bài học</Button>
                        </div>
                      </>
                    )
                  }))}
                />
                <div className="w-full mt-8" style={{ textAlign: "center" }}>
                  <Button onClick={() => { setIsCreateChapter(true) }} type="primary">Tạo chương</Button>
                </div>
              </>
            )}

          </Card>
        </Col>
      </Row>
    </>
  );
};

export default CreateChapTerLesson;
