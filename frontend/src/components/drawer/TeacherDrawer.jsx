import React, { useState, useContext } from "react";
import { Button, Drawer,FloatButton, Menu  } from "antd";
import { BarChartOutlined, BookFilled, CustomerServiceOutlined,HomeFilled,MailOutlined,RightCircleOutlined } from '@ant-design/icons';
import { AuthContext } from "../../context/AuthContext"; // sửa path tùy cấu trúc dự án
import { useNavigate } from "react-router-dom";

const TeacherDrawer = () => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState('1');
  const navigate = useNavigate()

  const isTeacher = user?.role === "teacher";

  if (!isTeacher) return null; // Không hiển thị nếu không phải giáo viên

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const onClick = e => {
    setCurrent(e.key);
    const targetItem = items.find(item => item.key === e.key);
    if (targetItem && targetItem.url) {
      navigate(targetItem.url);
      setOpen(false); // đóng Drawer sau khi chuyển trang
    }
  };
  const items = [
    {
      key: '1',
      icon: <HomeFilled  />,
      label: 'Trang chủ',
      url:"/"
    },
    { 
      key: '2', 
      label: 'Tạo khóa học',
      icon: <BookFilled />,
      url:"/create"
    },
    { 
      key: '3', 
      label: 'Thống kê',
      icon: < BarChartOutlined/>,
      url:"/teacher/stats"
    },
    { key: '6', label: 'Option 6' },
  ];
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
        <Menu
        onClick={onClick}
        // style={{ width: 256 }}
        openKeys={['sub1']}
        selectedKeys={[current]}
        mode="vertical"
        theme="light"
        items={items}
        getPopupContainer={node => node.parentNode}
      />
        {/* Bạn có thể thêm link hoặc navigation tại đây */}
      </Drawer>
    </>
  );
};

export default TeacherDrawer;
