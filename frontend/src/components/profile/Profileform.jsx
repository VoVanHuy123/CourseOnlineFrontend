import React, { useEffect } from "react";
import { Avatar, Button, Form, Input, Select } from "antd";
import renderDynamicFormItems from "../form/DynamicFormItems";
import defaultImage from '../../assets/img/avatar.png';

const { Option } = Select;

const ProfileForm = ({
  profileData = {},
  role = "student",
  allowEdit = false,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (profileData) form.setFieldsValue(profileData);
  }, [profileData]);

  const avatarFields = [
    {
      name: "avatar",
      type: "upload",
      title: "Thay ảnh",
      initialValue: Array.isArray(profileData?.avatar)
        ? profileData.avatar
        : profileData?.avatar
          ? [
            {
              uid: "-1",
              name: profileData.avatar.split("/").pop(),
              status: "done",
              url: profileData.avatar,
            },
          ]
          : [],
    },
  ];
  useEffect(() => {
    if (profileData) {
      const mappedData = {
        ...profileData,
        gender: profileData.gender?.split(".")[1]?.toLowerCase() || "",
        avatar: typeof profileData.avatar === "string" && profileData.avatar
          ? [
            {
              uid: "-1",
              name: profileData.avatar.split("/").pop(),
              status: "done",
              url: profileData.avatar,
            },
          ]
          : [],
      };
      form.setFieldsValue(mappedData);
    }
  }, [profileData]);

  const nameFields = [
    {
      name: "first_name",
      label: "Họ",
      rules: [{ required: true, message: "Vui lòng nhập họ" }],
    },
    {
      name: "last_name",
      label: "Tên",
      rules: [{ required: true, message: "Vui lòng nhập tên" }],
    },


  ]
  const contactFields = [

    {
      name: "phonenumber",
      label: "Số điện thoại",
    },
    {
      name: "email",
      label: "Email",
      rules: [{ type: "email", message: "Email không hợp lệ" }],
    },

  ]
  const commonFields = [
    {
      name: "username",
      label: "Tên đăng nhập",
      rules: [{ required: true, message: "Vui lòng nhập tên đăng nhập" }],
    },


  ];

  const roleFields = {
    student: [
      { name: "student_code", label: "Mã sinh viên", rules: [{ required: true }] },
      { name: "university", label: "Trường", rules: [{ required: true }] },
      {
        name: "gender",
        label: "Giới tính",
        type: "select",
        options: [
          { label: "Nam", value: "male" },
          { label: "Nữ", value: "female" },
          { label: "Khác", value: "other" },
        ],
      },
    ],
    teacher: [
      { name: "current_workplace", label: "Nơi công tác", rules: [{ required: true }] },
      { name: "degree", label: "Học vị", rules: [{ required: true }] },
    ],
    admin: [], // Có thể thêm nếu cần
  };

  useEffect(()=>{
    if(profileData){
      form.setFieldValue({
        first_name : profileData?.first_name,
        username : profileData?.username,
        last_name : profileData?.last_name,
        phonenumber : profileData?.phonenumber,
        email : profileData?.email,
        student_code : profileData?.student_code,
        university : profileData?.university,
        gender : profileData?.gender,
        current_workplace : profileData?.current_workplace,
        degree : profileData?.degree,
      })
    }
  },[profileData])

  const renderField = (field) => {
    const { name, label, rules, type, options } = field;
    if (type === "select") {
      return (
        <Form.Item key={name} name={name} label={label} rules={rules}>
          <Select disabled={!allowEdit}>
            {options.map((opt) => (
              <Option key={opt.value} value={opt.value}>
                {opt.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
      );
    }

    return (
      <Form.Item key={name} name={name} label={label} rules={rules}>
        <Input disabled={!allowEdit} />
      </Form.Item>
    );
  };

  return (
    <Form className="" layout="vertical" form={form} onFinish={onSubmit}>
      <div className="flex flex-row justify-between gap-8">
        <div className="flex flex-col items-center border border-black p-8 rounded-md">
          <Avatar className="shadow-xl mb-8" shape="square" size={150} src={profileData?.avatar || defaultImage} />
          {renderDynamicFormItems(avatarFields)}
        </div>
        <div className="flex-1 border border-black p-8 rounded-md">
          {/* {[...commonFields].map(renderField)} */}

          {renderDynamicFormItems(commonFields)}
          <div className="flex flex-row w-full gap-4 flex-1">

            {renderDynamicFormItems(nameFields)}
          </div>
          <div className="flex flex-row w-full gap-4 flex-1">

            {renderDynamicFormItems(contactFields)}
          </div>
        </div>
      </div>
      <div className="w-full border border-black my-8 p-8 rounded-md">

        {[...(roleFields[role] || [])].map(renderField)}
      </div>

      {allowEdit && (
        <div className="w-full flex justify-center">
          
        <Form.Item>
          <Button className="min-w-64 h-12" type="primary" htmlType="submit">
            Cập nhật
          </Button>
        </Form.Item>
        </div>
      )}
    </Form>
  );
};

export default ProfileForm;
