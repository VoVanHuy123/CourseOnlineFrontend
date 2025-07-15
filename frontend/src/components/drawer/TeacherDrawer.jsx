import React, { useState, useContext } from "react";
import { Button, Drawer,FloatButton  } from "antd";
import { CustomerServiceOutlined,RightCircleOutlined } from '@ant-design/icons';
import { AuthContext } from "../../context/AuthContext"; // sửa path tùy cấu trúc dự án

const TeacherDrawer = () => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  const isTeacher = user?.role === "teacher";

  if (!isTeacher) return null; // Không hiển thị nếu không phải giáo viên

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      
      <FloatButton
      shape="circle"
      type="primary"
      style={{ insetInlineEnd: 1400 }}
      icon={<RightCircleOutlined />}
      onClick={showDrawer}
    />
      <Drawer
        title="Menu giáo viên"
        placement="left"
        closable
        onClose={onClose}
        open={open}
      >
        <p>Quản lý khóa học</p>
        <p>Thêm bài học</p>
        <p>Thống kê</p>
        {/* Bạn có thể thêm link hoặc navigation tại đây */}
      </Drawer>
    </>
  );
};

export default TeacherDrawer;
