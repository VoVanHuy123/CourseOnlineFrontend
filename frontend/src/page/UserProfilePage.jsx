import React, { useContext, useEffect, useState } from "react";
import { data, useLocation, useParams } from "react-router-dom";
import { Spin, message } from "antd";
import ProfileForm from "../components/profile/Profileform";
import useFetchApi from "../hooks/useFetchApi";
import { endpoints } from "../services/api";
import { AuthContext } from "../context/AuthContext";

const UserProfilePage = () => {
  const { id, role } = useParams(); // route phải có dạng /profile/:role/:id
  const location = useLocation();
  const allowEdit = location.state?.allowEdit || false;
  const { fetchApi } = useFetchApi();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
    const [messageApi, contextHolder] = message.useMessage();
    const {login,token} = useContext(AuthContext);

  const loadProfile = async () => {
    try {
      let url = "";

      if (role === "student") url = endpoints['get_student'](id);
      else if (role === "teacher") url = endpoints['get_teacher'](id);
      else if (role === "admin") url = `/users/${id}`; // hoặc URL phù hợp

      const res = await fetchApi({ method: "GET", url });
      if (res.status === 200) {
        console.log(res.data)
        setProfile(res.data);
      } else {
        message.error("Không thể tải dữ liệu người dùng");
      }
    } catch (err) {
      console.error(err);
      message.error("Lỗi server khi tải thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (values) => {
    const fileList = values.avatar;
    const selectedFile = fileList && fileList.length > 0 ? fileList[0].originFileObj : null;

    const formData = new FormData();

    // Thêm các trường còn lại
    for (const key in values) {
      if (key === "avatar") continue;
      formData.append(key, values[key]);
    }

    // Truyền file ảnh nếu có
    if (selectedFile) {
      formData.append("avatar", selectedFile);
    }

    // Nếu không có file được chọn và người dùng muốn xóa ảnh
    // if (!selectedFile && values.remove_avatar === true) {
    if (!selectedFile) {
      formData.append("null_avatar", "");
    }
  for (let [key, value] of formData.entries()) {
  console.log(key, value);
}
    try {
      messageApi.open({
              key: "updatePfofile",
              type: "loading",
              content: "Đang cập nhật...",
              duration:0
            })
      const res = await fetchApi({
        method: "PATCH",
        url: `${endpoints['auth']}/${role}s/${id}`,
        data: formData,
      });

      if (res.status === 200) {
        messageApi.open({
              key: "updatePfofile",
              type: "success",
              content: "Cập nhật thành công",
              duration:3
            })
        login(res.data,token)
        message.success("Cập nhật thành công");
        setProfile(res.data);
      } else {
        messageApi.open({
              key: "updatePfofile",
              type: "error",
              content: "Cập nhật thất bại",
              duration:3
            })
        message.error("Cập nhật thất bại");
      }
    } catch (err) {
      console.error(err);
      message.error("Lỗi server khi cập nhật");
    }
  };

  useEffect(() => {
     loadProfile();
  }, [id, role]);

  if (loading) return <Spin fullscreen />;

  return (
    <div className="p-8 bg-white rounded shadow-md max-w-5xl mx-auto w-full relative z-10">
      <h1 className="text-2xl font-semibold mb-8 text-center ">Thông tin người dùng</h1>
      {contextHolder}
      <ProfileForm
        profileData={profile}
        role={role}
        allowEdit={allowEdit}
        onSubmit={handleUpdate}
      />
    </div>
  );
};

export default UserProfilePage;
