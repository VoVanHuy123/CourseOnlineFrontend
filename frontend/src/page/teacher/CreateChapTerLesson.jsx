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
  const [selectedChapterId,setSelectedChapterId]=useState(-1)
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isCreateChapter,setIsCreateChapter] = useState(true);

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
    const res = await fetchApi({
        method: "POST",
        url: endpoints["chapters"],
        data: { ...values, course_id: id },
        });
        if(res.status===201){
            message.success("Tạo chương thành công");

            // ✅ Reset form
            form.resetFields();
            setChapters([
                ...chapters,
                {
                    id: res.data.id,
                    order: res.data.order,
                    title: res.data.title,
                    lessons:[]
                }
            ])
        }
    }

  useEffect(() => {
    loadCourse();
    LoadChapters();
  }, [id]);

  


  const chapterFields = [
    { name: "title", label: "Tên chương", rules: [{ required: true, message: "Vui lòng nhập tên chương" }], type: "input", placeholder: "VD: Chương 1: ..." },
    { name: "description", label: "Mô tả", type: "text", rules: [{ required: true, message: "Vui lòng mô tả chương" }], placeholder: "Mô tả nội dung chương" },
    { name: "order", label: "Thứ tự chương", type: "number", rules: [{ required: true, message: "Vui lòng điền thứ tự chương" }] },
  ]
  const CreateChapterForm = () =>{
    return (
    <Form layout="vertical" form={form} onFinish={createChapter}>
        {renderDynamicFormItems(chapterFields)}
        <Button type="primary" htmlType="submit">Tạo chương</Button>
    </Form>
    );
  };
  const CreateLessonForm = () =>{
    return (
    <Form layout="vertical" form={form} onFinish={createChapter}>
        {renderDynamicFormItems(chapterFields)}
        <Button type="primary" htmlType="submit">Tạo bai hoc</Button>
    </Form>
    );
  };
  
  if (loading) return <Spin fullscreen />;
  console.log("chapters",chapters.length)
  return (
    <>
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
            <Card title="Tạo chương / bài học">
            {/* Form tạo Chapter hoặc Lesson */}
            <div className="flex-1 space-y-8">
                <div className="bg-white p-6 rounded shadow">
                    <h3 className="text-lg font-bold mb-4">Tạo chương mới</h3>
                    {isCreateChapter?<CreateChapterForm/>:<CreateLessonForm/>}
                </div>
            </div>
            </Card>
        </Col>

        {/* Cột phải - Danh sách đã tạo */}
        <Col span={8}>
            <Card title="Danh sách chương & bài học">
                {chapters.length === 0 ? (
                    <>
                        <p style={{ textAlign : "center", color: "#999" }}>Chưa có chương nào</p>
                        <div className="w-full mt-8" style={{ textAlign: "center" }}>
                            <Button onClick={()=>{setIsCreateChapter(true)}} type="link">Tạo chương</Button>
                        </div>
                    </>
                    
                    ) : (
                    <>
                        <Collapse
                            accordion
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
                                </>
                            )
                            }))}
                        />
                        <div className="w-full mt-8" style={{ textAlign: "center" }}>
                            <Button onClick={()=>{setIsCreateChapter(true)}} type="link">Tạo chương</Button>
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
