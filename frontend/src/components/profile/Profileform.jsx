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


  const commonFields = [
    {
      name: "username",
      label: "Tên đăng nhập",
      rules: [{ required: true, message: "Vui lòng nhập tên đăng nhập" }],
    },
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
    {
      name: "email",
      label: "Email",
      rules: [{ type: "email", message: "Email không hợp lệ" }],
    },
    {
      name: "phonenumber",
      label: "Số điện thoại",
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
      <div className="flex flex-row justify-between gap-16">
        <div className="flex flex-col items-center">
          <Avatar className="shadow-xl mb-8" shape="square" size={120} src={profileData?.avatar||defaultImage}/>
          {renderDynamicFormItems(avatarFields)}
        </div>
      <div className="flex-1">
        {[...commonFields, ...(roleFields[role] || [])].map(renderField)}
      </div>
      </div>
      
      {allowEdit && (
        <Form.Item>
          <Button className="w-full" type="primary" htmlType="submit">
            Cập nhật
          </Button>
        </Form.Item>
      )}
    </Form>
  );
};

export default ProfileForm;
