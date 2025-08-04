import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Col, Collapse, Form, Input, List, Row, Spin, message,Space,Modal, Drawer } from "antd";
import { CommentOutlined, HistoryOutlined } from '@ant-design/icons';
import useFetchApi from "../../hooks/useFetchApi";
import TextArea from "antd/es/input/TextArea";
import { endpoints } from "../../services/api";
import renderDynamicFormItems from "../../components/form/DynamicFormItems";
import CreateChapterForm from "../../components/form/CreateChapterForm";
import CreateLessonForm from "../../components/form/CreateLessonForm";
import UpdateChapterForm from "../../components/form/UpdateChapterForm";
import UpdateLessonForm from "../../components/form/UpdateLessonForm";
import CommentArea from "../../components/comment/CommentArea";
import CommentDrawer from "../../components/drawer/CommentDrawer";
import ReviewList from "../../components/review/ReviewList";
// import useFetchApi from "../hooks/useFetchApi";


const { Panel } = Collapse;


const CreateChapTerLesson = () => {
  const { id } = useParams(); // lấy id khóa học từ URL
  const { fetchApi } = useFetchApi();

  //course
  const [course, setCourse] = useState(null);

  //chapter
  const [chapters, setChapters] = useState([]);
  const [selectedChapterId, setSelectedChapterId] = useState(-1)
  const [selectedChapter, setSelectedChapter] = useState(null)
  //lesson
  const [selectedLesson, setSelectedLesson] = useState(null);

  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  const [action, setAction] = useState("create-chapter");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [form] = Form.useForm();
  const [errorMsg, setErrorMsg] = useState("");
  const [open, setOpen] = useState(false);

  //drawer
  const [openDrawer, setOpenDrawer] = useState(false);
    const showDrawer = () => {
      setOpenDrawer(true);
    };
    const onClose = () => {
      setOpenDrawer(false);
    };


    //model
  const navigate = useNavigate()

  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {

    setOpen(false);
    publicCourse();
  };
  const handleCancel = () => {
    setOpen(false);
  };

// Load course ==========================================
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
      setErrorMsg("");
      setChapters([
        ...chapters,
        {
          id: res.data.id,
          order: res.data.order,
          description: res.data.description,
          title: res.data.title,
          lessons: []
        }
      ])
    }else{
      setErrorMsg(res.error)
      messageApi.open({
          key: "createChapter",
          type: "error",
          content: res.error,
          duration: 5,
        });
    }
  }
  // update lesson ======================
  const updateChapter = async (values) => {
    messageApi.open({
              key: "updateChapter",
              type: "loading",
              content: "Đang cập nhật...",
            })
    const res = await fetchApi({
      method: "PATCH",
      url: endpoints['update_chapter'](selectedChapterId),
      data: { ...values, course_id: id },
    });
    if (res.status === 200 || res.status===204) {
      message.success("cập nhật thành công");

      messageApi.open({
        key: "updateChapter",
        type: "success",
        content: "Cập nhật thành công!",
        duration: 3,
      });
      // ✅ Reset form
      LoadChapters();
      setSelectedChapter(null)
      setErrorMsg("");
      setAction("create-chapter")
    }else{
      setErrorMsg(res.error)
      messageApi.open({
          key: "updateChapter",
          type: "error",
          content: res.error,
          duration: 5,
        });
    }
  }

  const handleDeleteLesson = (isDelete) => {
  if (isDelete) {
    setChapters(prevList =>
      prevList.map(chapter => {
        if (chapter.id === selectedChapterId) {
          return {
            ...chapter,
            lessons: chapter.lessons.filter(lesson => lesson.id !== selectedLesson?.id)
          };
        }
        return chapter;
      })
    );
    setAction("create-chapter");
    setSelectedLesson(null); // Reset bài học đang chọn nếu cần
  }
};



  // create lesson =======================================
  const createLesson = async (values) => {

    const fileList = values.content_url;
    const selectedFile = fileList && fileList.length > 0 ? fileList[0].originFileObj : null;
    
    if (!selectedFile && values.type !== "text") {
    // if (!file && values.type !== "text") {
      const msg = "Vui lòng chọn file/video phù hợp"
      message.error(msg);
      setErrorMsg(msg);
      return;
    }
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
              duration: 10
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
        const newLessonData = {
          id: res.data.id,
          title: res.data.title,
          content_url: res.data.content_url,
          order: res.data.order,
          description: res.data.description,
          chapter_id : res.data.chapter_id,
          is_published : res.data.is_published,
          type : res.data.type
        };

        const newChapters = chapters.map((chapter) => {
          if (chapter.id === selectedChapterId) {
            return {
              ...chapter,
              lessons: [...(chapter.lessons || []), newLessonData],
            };
          }
          return chapter;
        });

        setChapters(newChapters);
        form.resetFields();
        // const newChapters = updatedChapters();
        // setChapters(newChapters)
        setFile(null);
        setErrorMsg("");
      }else{
        const err = res.error || "Tạo bài học thất bại";
        // console.log(":tạo thất bại")
        messageApi.open({
              key: "createLesson",
              type: "error",
              content: res.error,
              duration:3
            })
        setErrorMsg(err);
      }
    } catch (err) {
      console.error(err);
      message.error("❌ Lỗi khi tạo bài học!");
    } finally {
      setUploading(false);
      form.resetFields();
    }
  };
  const updateLesson = async (values) => {

    const fileList = values.content_url;
    const selectedFile = fileList && fileList.length > 0 ? fileList[0].originFileObj : null;
    if (!selectedFile && values.type !== "text") {
    // if (!file && values.type !== "text") {
      const msg = "Vui lòng chọn file/video phù hợp vì loại bài học của bạn là text"
      message.error(msg);
      setErrorMsg(msg);
      return;
    }
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
              key: "updateLesson",
              type: "loading",
              content: "Đang cập nhật...",
              duration: 10
            })
      console.log("=== FormData đang gửi ===");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: [File] name=${value.name}, size=${value.size}, type=${value.type}`);
        } else {
          console.log(`${key}:`, value);
        }
      }
      // console.log("URL",endpoints['update_lesson'](selectedLesson.id))
      const res = await fetchApi({
        method : "PATCH",
        url : endpoints['update_lesson'](selectedLesson.id),
        data: formData
      })
      // console.log(endpoints['update_lesson'](selectedLesson.id))
      if(res.status === 200){
        messageApi.open({
              key: "updateLesson",
              type: "success",
              content: "Cập nhật bài học thành công...",
              duration:3
            })
        console.log("cập nhật thành công")
        message.success("Cập nhật bài học thành công!");
        form.resetFields();
        LoadChapters();
        setSelectedChapter(null)
        setFile(null);
        form.resetFields();
        setErrorMsg("");
      }else{
        const err = res.error || "Tạo bài học thất bại";
        // console.log(":tạo thất bại")
        messageApi.open({
              key: "createLesson",
              type: "error",
              content: res.error,
              duration:3
            })
        setErrorMsg(err);
      }
    } catch (err) {
      console.error(err);
      message.error("❌ Lỗi khi tạo bài học!");
    } finally {
      setUploading(false);
      form.resetFields();
    }
  };
  const renderForm = () => {
  switch (action) {
    case "create-chapter":
      return <CreateChapterForm form ={form} errorMsg = {errorMsg} onFinish={createChapter} />;
    case "update-chapter":
      return <UpdateChapterForm form ={form} errorMsg={errorMsg} onFinish={updateChapter} chapter={selectedChapter} deleted={handleDeleteChapter}/>;
    case "create-lesson":
      return <CreateLessonForm form ={form} errorMsg={errorMsg} onFinish={createLesson}/>;
    case "update-lesson":
      return <UpdateLessonForm form ={form} errorMsg={errorMsg} onFinish={updateLesson} lesson = {selectedLesson} deleted={handleDeleteLesson}/>;
    default:
      return null;
  }
};

  const publicCourse = async () => {
      const formData = new FormData();
      formData.append("is_public", true);
    try {
      await messageApi.open({
          type: "loading",
          content: "Đang phát hành...",
          duration: 10,
        });
    const response = await fetchApi({
      method : "PATCH",
      url : endpoints['update_course'](id),
      data:formData
    })
    if(response.status === 200){

      console.log(endpoints['update_course'](id))
      console.log("✅ Update success", response.data);
      messageApi.success("Phát hành thành công!")
      navigate("/")
    }else{
      messageApi.error("Phát hành khóa học thất bại.");
    }
  } catch (error) {
    console.error("❌ Update failed", error.response?.data || error.message);
  }
    };
  const handleDeleteChapter = (isDelete) => {
  if (isDelete) {
    setChapters(prevList =>
      prevList.filter(chapter => chapter.id !== selectedChapterId)
    );
    setAction("create-chapter");
    setSelectedChapter(null);
    console.log(selectedChapterId)
  }
};

const renderTitle = ()=>{
  switch (action) {
    case "create-chapter":
      return "TẠO CHƯƠNG MỚI";
    case "update-chapter":
      return `CẬP NHẬT CHƯƠNG`;
    case "create-lesson":
      return "TẠO BÀI HỌC";
    // case "update-lesson":
    //   return "CẬP NHẬT BÀI HỌC";
    default:
      return null;
  }
};
useEffect(() => {
    
  //  form.resetFields();
   if(!selectedChapter) {
    form.resetFields();
    setAction("create-chapter") 
   }
}, [selectedChapter,selectedLesson]);
  useEffect(() => {
    loadCourse();
    LoadChapters();
  }, [id]);
  if (loading) return <Spin fullscreen />;
  return (
    <>
    {contextHolder} 
      <Row gutter={[24]} className="mb-6 flex justify-center align-middle">

          <Col span={24}>
            <div  style={{ flex: 2, padding: 16,background:"#fff", borderRadius: 8,justifyContent:"center",alignItems:"center"}} className="flex flex-row shadow-md" >
              <div className="flex-1">

                <h1>{course?.title}</h1>
                <p>{course?.description}</p>
              </div>
              <div className="flex flex-row">
                {!course.is_public ? 
                <div className="mr-8">
                  <Space>
                    <Button type="primary" onClick={showModal}>
                      Phát hành
                    </Button>
                  </Space>
                  <Modal
                    open={open}
                    title="Xác Nhận Phát Hành Khóa Học"
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={(_, { OkBtn, CancelBtn }) => (
                      <>
                        {/* <Button>Custom Button</Button> */}
                        <CancelBtn/>
                        <OkBtn />
                      </>
                    )}
                  >
                    <p>PHÁT HÀNH KHÓA HỌC</p>
                    
                  </Modal>
                </div> : <></>}
      
                 <Button onClick={()=>navigate(`/courses/update/${id}`)} type="primary">Chỉnh sửa</Button>
              </div>
            </div>
          </Col>
      </Row>
      <Row gutter={24} >
        {/* Cột trái - Form nhập liệu */}
        <Col span={16} >
          <Card className="shadow-xl" title={renderTitle()}>
            {/* Form tạo Chapter hoặc Lesson */}
            <div className="flex-1 space-y-8">
              <div className="bg-white p-6 rounded shadow">
                {renderForm()}
              </div>
            </div>
          </Card>
        </Col>

        {/* Cột phải - Danh sách đã tạo */}
        <Col span={8}>
          <Card className="shadow-xl" title="Danh sách chương & bài học">
            {chapters?.length === 0 ? (
              <>
                <p style={{ textAlign: "center", color: "#999" }}>Chưa có chương nào</p>
                <div className="w-full mt-8" style={{ textAlign: "center" }}>
                  <Button onClick={() => {form.resetFields(); setAction("create-chapter"); }} type="primary">Tạo chương</Button>
                </div>
              </>

            ) : (
              <>
                <Collapse
                  accordion
                  onChange={(key) => {
                    setSelectedChapterId(Number(key));  // key chính là chapter.id được chọn
                    const selected = chapters.find((chapter) => chapter.id === Number(key));
                    // form.resetFields();
                    setSelectedChapter(selected);
                    setAction("update-chapter");
                  }}
                  items={chapters?.map((chapter) => ({
                    key: chapter.id,
                    label: chapter.title,
                    children: (
                      <>
                        <List
                          dataSource={chapter.lessons || []}
                          renderItem={(lesson) => (
                            <List.Item
                              onClick={() => {
                                setSelectedLesson(lesson);
                                setAction("update-lesson");
                              }}
                              style={{ cursor: "pointer", padding: 10 }}
                              className={`rounded-lg shadow-sm border ${!lesson.is_published ? "bg-[#AEC8A4]":""} `}
                              
                              actions={
                                lesson.is_published ? 
                                [
                                
                                <Button type="primary" onClick={(e) => {
                                  e.stopPropagation(); // không để nó trigger List.Item click
                                  setSelectedLesson(lesson)
                                  showDrawer();
                                }}>
                                  <CommentOutlined />
                                </Button>,
                                <Button onClick={()=>{
                                  navigate(`/lessons/${lesson?.id}/history`)
                                }}>
                                  <HistoryOutlined />
                                </Button>
                              ]:[]
                            }
                            >
                              {lesson.title}
                            </List.Item>
                          )}

                        />
                        <div className="w-full mt-8" style={{ textAlign: "center" }}>
                          <Button onClick={() => {form.resetFields(); setAction("create-lesson")}} type="primary">Tạo bài học</Button>
                        </div>
                      </>
                    )
                  }))}
                />
                <div className="w-full mt-8" style={{ textAlign: "center" }}>
                  <Button onClick={() => { form.resetFields(); setAction("create-chapter") }} type="primary">Tạo chương</Button>
                </div>
              </>
            )}

          </Card>
        </Col>
      </Row>

      {/* Drawer comments */}
      <Row className="mt-16  py-4 rounded-33xl">
      <CommentDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        selectedLesson={selectedLesson}
      />
      </Row>
      <Row>
            <div className="border shadow-xl mb-12 p-4 w-full rounded-md">

              <ReviewList courseId={id}/>
            </div>
      </Row>

    </>
  );
};

export default CreateChapTerLesson;
