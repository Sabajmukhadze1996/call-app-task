import React, { useState, useEffect } from "react";
import { Table, Modal, Form, Input, Select, Button } from "antd";
import { nanoid } from "nanoid";
import { User } from "../../interfaces/User";
import { UserFormValues } from "../../interfaces/UserFormValues";
import axios from "axios";

const { Option } = Select;

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null | any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteAlertVisible, setIsDeleteAlertVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/users");
        setUsers(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleEdit = async (user: User) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleDelete = async (userId: string | number) => {
    try {
      await axios.delete(`http://localhost:4000/users/${userId}`);
      setUsers(users.filter((user) => user.id !== userId));

      setIsDeleteAlertVisible(true);
      setTimeout(() => {
        setIsDeleteAlertVisible(false);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = async () => {
    setSelectedUser(null);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values: UserFormValues) => {
      const user = {
        id: selectedUser ? selectedUser.id : nanoid(),
        name: values.name,
        email: values.email,
        gender: values.gender,
        address: { street: values.street, city: values.city },
        phone: values.phone,
      };

      const method = selectedUser ? "PUT" : "POST";
      const url = selectedUser
        ? `http://localhost:4000/users/${selectedUser.id}`
        : "http://localhost:4000/users";
      fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      }).then(() => {
        if (selectedUser) {
          setUsers(users.map((u) => (u.id === selectedUser.id ? user : u)));
        } else {
          setUsers([...users, user]);
        }
        setIsModalVisible(false);
      });
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (address: { street: string; city: string }) => {
        return `${address.street}, ${address.city}`;
      },
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Action",
      key: "action",
      render: (text: string, user: User) => (
        <span>
          <Button type="link" onClick={() => handleEdit(user)}>
            Edit
          </Button>
          <Button type="link" onClick={() => handleDelete(user.id)}>
            Delete
          </Button>
        </span>
      ),
    },
  ];

  return (
    <>
      {isDeleteAlertVisible && (
        <Modal
          title="Success"
          open={isDeleteAlertVisible}
          onOk={() => setIsDeleteAlertVisible(false)}
        >
          User deleted successfully
        </Modal>
      )}

      <Button type="primary" onClick={handleAdd}>
        Add User
      </Button>
      <Table dataSource={users} columns={columns} rowKey="id" />

      <Modal
        title={selectedUser ? "Edit User" : "Add User"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} initialValues={selectedUser}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="gender" label="Gender">
            <Select>
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="street"
            label="Street"
            rules={[{ required: true, message: "Please enter street" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="city"
            label="City"
            rules={[{ required: true, message: "Please enter city" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[
              { required: true, message: "Please enter phone number" },
              {
                pattern: /^\+?[0-9]+$/,
                message: "Please enter a valid phone number",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserTable;

// import { useEffect, useState } from "react";
// import { Table, Button, Modal, Form, Input, Select } from "antd";
// import { ColumnsType } from "antd/es/table";
// import axios from "axios";
// import { User } from "../../types/User"

// const { Option } = Select;

// const columns: ColumnsType<User> = [
//   {
//     title: "ID",
//     dataIndex: "id",
//     key: "id",
//   },
//   {
//     title: "Name",
//     dataIndex: "name",
//     key: "name",
//   },
//   {
//     title: "Email",
//     dataIndex: "email",
//     key: "email",
//   },
//   {
//     title: "Gender",
//     dataIndex: "gender",
//     key: "gender",
//   },
//   {
//     title: "Address",
//     dataIndex: ["address", "street"],
//     key: "address",
//     render: (text: string, record: User) => (
//       <span>
//         {record.address.street}, {record.address.city}
//       </span>
//     ),
//   },
//   {
//     title: "Phone",
//     dataIndex: "phone",
//     key: "phone",
//   },
//   {
//     title: "Actions",
//     key: "actions",
//     render: (text: string, record: User) => (
//       <span>
//         <Button type="primary" danger onClick={() => handleDelete(record.id)}>
//           Delete
//         </Button>
//         <Button type="primary" onClick={() => handleEdit(record)}>
//           Edit
//         </Button>
//       </span>
//     ),
//   },
// ];

// const UsersTable = () => {
//   const [data, setData] = useState<User[]>([]);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [editingUser, setEditingUser] = useState<User | undefined>();
//   const [form] = Form.useForm();

//   const handleEdit = (user: User) => {
//     setEditingUser(user);
//     form.setFieldsValue(user);
//     setIsModalVisible(true);
//   };

//   const handleSave = () => {
//     form.validateFields().then((values) => {
//       if (editingUser) {
//         axios
//           .put(`http://localhost:4000/users/${editingUser.id}`, values)
//           .then(() => {
//             setData(
//               data.map((user) =>
//                 user.id === editingUser.id
//                   ? { ...editingUser, ...values }
//                   : user
//               )
//             );
//             setIsModalVisible(false);
//           });
//       } else {
//         axios.post(`http://localhost:4000/users`, values).then((response) => {
//           setData([...data, response.data]);
//           setIsModalVisible(false);
//         });
//       }
//       form.resetFields();
//       setEditingUser(undefined);
//     });
//   };

//   useEffect(() => {
//     axios.get("http://localhost:4000/users").then((response) => {
//       setData(response.data);
//     });
//   }, []);

//   return (
//     <>
//       <Button type="primary" onClick={() => setIsModalVisible(true)}>
//         Add User
//       </Button>
//       <Table dataSource={data} columns={columns} />

//       <Modal
//         title={editingUser ? "Edit User" : "Add User"}
//         open={isModalVisible}
//         onCancel={() => {
//           setIsModalVisible(false);
//           form.resetFields();
//           setEditingUser(undefined);
//         }}
//         onOk={handleSave}
//       >
//         <Form form={form} layout="vertical">
//           <Form.Item
//             label="Name"
//             name="name"
//             rules={[{ required: true, message: "Please enter name" }]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item
//             label="Email"
//             name="email"
//             rules={[
//               { required: true, message: "Please enter email" },
//               { type: "email", message: "Please enter a valid email" },
//             ]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item
//             label="Phone Number"
//             name="phone"
//             rules={[
//               { required: true, message: "Please enter phone number" },
//               {
//                 pattern: /^[0-9]+$/,
//                 message: "Please enter a valid phone number",
//               },
//             ]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item
//             label="Gender"
//             name="gender"
//             rules={[{ required: true, message: "Please select gender" }]}
//           >
//             <Select>
//               <Option value="male">Male</Option>
//               <Option value="female">Female</Option>
//             </Select>
//           </Form.Item>
//           <Form.Item label="Street" name={["address", "street"]}>
//             <Input />
//           </Form.Item>
//           <Form.Item label="City" name={["address", "city"]}>
//             <Input />
//           </Form.Item>
//         </Form>
//       </Modal>
//     </>
//   );
// };

// const handleDelete = (id: number) => {
//   axios.delete(`http://localhost:4000/users/${id}`).then((user: any) => {
//     return setData((prevData: any) =>
//       prevData.filter((user: User) => user.id !== id)
//     );
//   });
// };

// function setData(arg0: (prevData: any) => any): any {
//   return window.location.reload(), alert("user deleted successfully");
// }

// function handleEdit(record: User): void {
//   throw new Error("Function not implemented.");
// }

// export default UsersTable;
