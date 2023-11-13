import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Space,
} from "antd";
import React, { useEffect } from "react";
import { projectStatus } from "../../common/constants";
import { AntNotification } from "../../common/notification/Notification";
import axiosPrivate from "../../common/configs/axios";
import dayjs from "dayjs";
const { Option } = Select;

const TaskCreate = ({ onClose, open, editData, fetchData }) => {
  const [form] = Form.useForm();
  const onReset = () => {
    onClose();
    form.resetFields();
  };

  const onFinish = (values) => {
    const selectedDate = new Date(
      new Date(values.dueDate.$d).toLocaleDateString("en-US", {
        timeZone: "Asia/Kolkata",
      })
    );
    const task = {
      name: values.name,
      status: editData ? values.status.value : values.status,
      assignee: values.assignee,
      dueDate:
        selectedDate.getFullYear() +
        "-" +
        (selectedDate.getMonth() + 1) +
        "-" +
        selectedDate.getDate(),
      description: values.description,
    };

    if (!editData) {
      axiosPrivate
        .post("task", task)
        .then((response) => {
          if (response.status === 201) {
            AntNotification(
              "success",
              response.statusText,
              response.data.success.message
            );
            fetchData();
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status === 400) {
            AntNotification(
              "error",
              error.response.statusText,
              error.response.data.error.message
            );
          } else {
            AntNotification(
              "error",
              "Server Error",
              "There was an error processing the request"
            );
          }
        });
    }

    if (editData) {
      axiosPrivate
        .put("task/" + editData._id, task)
        .then((response) => {
          if (response.status === 200) {
            AntNotification(
              "success",
              response.statusText,
              response.data.success.message
            );
            fetchData();
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status === 400) {
            AntNotification(
              "error",
              error.response.statusText,
              error.response.data.error.message
            );
          } else {
            AntNotification(
              "error",
              "Server Error",
              "There was an error processing the request"
            );
          }
        });
    }

    onReset();
    onClose();
  };

  useEffect(() => {
    if (editData) {
      form.setFieldsValue({
        name: editData.name,
        assignee: editData.assignee,
        status: projectStatus.filter(
          (status) => status.value === editData.status
        ),
        dueDate: dayjs(editData.dueDate, "YYYY-MM-DD"),
        description: editData.description,
      });
    }
    // eslint-disable-next-line
  }, [editData]);

  const onSubmit = () => {
    form.submit();
  };

  return (
    <>
      <Drawer
        title={editData ? "Update Project" : "Create a New Project"}
        width={720}
        onClose={onReset}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
        extra={
          <Space>
            <Button
              onClick={onSubmit}
              type="primary"
              style={{
                background: "#5cb85c",
                fontWeight: 600,
              }}
            >
              {editData ? "Update" : "Create"}
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" onFinish={onFinish} size="large" form={form}>
          <Row gutter={8}>
            <Col span={24}>
              <Form.Item
                name="name"
                label="Task Name"
                rules={[
                  {
                    required: true,
                    message: "Please enter task name",
                  },
                ]}
              >
                <Input placeholder="Please enter task name" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="assignee"
                label="Assignee"
                rules={[
                  {
                    required: true,
                    message: "Please select an assignee",
                  },
                ]}
              >
                <Input placeholder="Please enter assignee name" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="status"
                label="Status"
                rules={[
                  {
                    required: true,
                    message: "Please select a status",
                  },
                ]}
              >
                <Select placeholder="Please select the Project Status">
                  <Option value="created">Created</Option>
                  <Option value="in-progress">In Progress</Option>
                  <Option value="completed">Completed</Option>
                  <Option value="closed">Closed</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="dueDate"
                label="Due Date"
                rules={[
                  {
                    required: true,
                    message: "Please choose the due date",
                  },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  {
                    required: true,
                    message: "Please enter description",
                  },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Please enter description"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
};

export default TaskCreate;
