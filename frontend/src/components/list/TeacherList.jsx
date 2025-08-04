import { useEffect } from "react";
import { Table, Button, message } from "antd";
import useFetchApi from "../../hooks/useFetchApi";
import { endpoints } from "../../services/api";

const TeacherList = ({ teachers, onRefresh }) => {
  const { fetchApi } = useFetchApi();

  const handleValidate = async (teacherId) => {
    const res = await fetchApi({
      url: `${endpoints['validate_teacher'](teacherId)}`,
      method: "PUT",
    });

    if (res.status === 200) {
      message.success("Xác thực giáo viên thành công!");
      onRefresh(); // Load lại danh sách sau khi xác thực
    } else {
      message.error(res?.data?.msg || "Lỗi khi xác thực giáo viên!");
    }
  };

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      render: (_, record) => `${record.last_name} ${record.first_name}`,
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phonenumber",
      key: "phonenumber",
    },
    {
      title: "Nơi công tác",
      dataIndex: "current_workplace",
      key: "current_workplace",
    },
    {
      title: "Bằng cấp",
      dataIndex: "degree",
      key: "degree",
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Button type="primary" onClick={() => handleValidate(record.id)}>
          Xác thực
        </Button>
      ),
    },
  ];

  return (
    <Table
      dataSource={teachers}
      columns={columns}
      rowKey="id"
      pagination={false}
    />
  );
};

export default TeacherList;
