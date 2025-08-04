import { useEffect, useState } from "react";
import useFetchApi from "../../hooks/useFetchApi";
import { endpoints } from "../../services/api";
import TeacherList from "../../components/list/TeacherList";
import { Spin } from "antd";

const AdminPage = () => {
  const { loading, fetchApi } = useFetchApi();
  const [teachers, setTeachers] = useState([]);

  const loadUnValidateTeacher = async () => {
    const res = await fetchApi({
      url: endpoints["un_validate_teacher"],
    });
    if (res.status === 200) {
      setTeachers(res.data);
    }
  };

  useEffect(() => {
    loadUnValidateTeacher();
  }, []);

  return (
    <>
      <h2>Danh sách giáo viên chưa xác thực</h2>
      {loading ? (
        <Spin />
      ) : (
        <TeacherList teachers={teachers} onRefresh={loadUnValidateTeacher} />
      )}
    </>
  );
};

export default AdminPage;
