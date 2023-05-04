import React, { useState, useEffect } from "react";
import { Table, Modal, Form, Input, Select, Button } from "antd";
import { nanoid } from "nanoid";
import { User } from "../../interfaces/User";
import { UserFormValues } from "../../interfaces/UserFormValues";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./table.css";
import Chart from "../chart/Chart";

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
        <span className="table-btns-container">
          <Button
            className="edit-user-btn"
            type="link"
            onClick={() => handleEdit(user)}
          >
            Edit
          </Button>
          <Button
            className="delete-user-btn"
            type="link"
            onClick={() => handleDelete(user.id)}
          >
            Delete
          </Button>
        </span>
      ),
    },
  ];

  const navigate = useNavigate();



  return (
    <>
    <div style={{display: "none"}}>
    <Chart />
    </div>
      {isDeleteAlertVisible && (
        <Modal
          title="Success"
          open={isDeleteAlertVisible}
          onOk={() => setIsDeleteAlertVisible(false)}
        >
          User deleted successfully
        </Modal>
      )}
      <h1 className="dashboard-title">Users Dashboard</h1>
      <Button className="add-user-btn" type="primary" onClick={handleAdd}>
        Add User
      </Button>
      <Button
        className="go-to-chart-btn"
        type="primary"
        onClick={() => navigate("/chart")}
      >
        Explore Chart
      </Button>
      <Table dataSource={users} columns={columns} rowKey="id" />

      <Modal
        title={selectedUser ? "Edit User" : "Add User"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="form-row">
          <Form form={form} initialValues={selectedUser}>
            <div className="form-col">
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
            </div>

            <div className="form-col">
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
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default UserTable;




























