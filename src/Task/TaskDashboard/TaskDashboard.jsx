import React, { useEffect, useState } from "react";
import {
  AutoComplete,
  Button,
  Col,
  Input,
  Popconfirm,
  Row,
  Space,
  Table,
  Tag,
} from "antd";
import {
  DeleteTwoTone,
  EditTwoTone,
  EyeTwoTone,
  PlusOutlined,
} from "@ant-design/icons";
import TaskCreate from "../TaskCreate/TaskCreate";
import TaskSingleView from "../TaskSingleView/TaskSingleView";
import axiosPrivate from "../../common/configs/axios";
import "./TaskDashboard.css";
import { AntNotification } from "../../common/notification/Notification";

const TaskDashboard = () => {
  const [open, setOpen] = useState(false);
  const [task, setTask] = useState(null);
  const [showProjectView, setProjectView] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [tempData, setTempData] = useState(null);
  const [data, setData] = useState(null);

  const fetchData = () => {
    let tasks = [];
    axiosPrivate
      .get("task", {})
      .then((response) => {
        if (response.status === 200) {
          setData(response.data.task);
          setTempData(response.data.task);
          response.data.task.forEach((data) => {
            tasks.push({
              value: data.name,
              label: data.name,
              id: data._id,
            });
          });
          setTask(tasks);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
    setSelectedData(null);
  };

  const dataSelected = (data, type) => {
    setSelectedData(data);
    if (type === "view") {
      showProjectViewDrawer();
    } else {
      showDrawer();
    }
  };

  const showProjectViewDrawer = () => {
    setProjectView(true);
  };

  const onCloseProjectView = () => {
    setProjectView(false);
    setSelectedData(null);
  };

  const confirm = (data) => {
    axiosPrivate
      .delete("task/" + data._id)
      .then((response) => {
        if (response.status === 200) {
          AntNotification(
            "success",
            "Task Deleted",
            response.data.success.message
          );
          fetchData();
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 404) {
          AntNotification(
            "error",
            "Task Not Found",
            error.response.data.error.message
          );
        } else {
          AntNotification("error", "Server Error", "Please try again later");
        }
      });
  };

  const cancel = () => {
    console.log();
    // message.error("Click on No");
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (_, { status }) => {
        let color = "geekblue";
        if (status === "created") {
          color = "orange";
        }
        if (status === "completed") {
          color = "green";
        }
        if (status === "closed") {
            color = "red";
          }
        return (
          <Tag color={color} key={status}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (_, { dueDate }) => {
        return dueDate.split("T")[0];
      },
    },
    {
      title: "Created By",
      dataIndex: "assignee",
      key: "assignee",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <EyeTwoTone
            onClick={() => dataSelected(record, "view")}
            style={{ cursor: "pointer", fontSize: 18 }}
          />
          <EditTwoTone
            onClick={() => dataSelected(record, "edit")}
            twoToneColor="#cea455"
            style={{ cursor: "pointer", fontSize: 18 }}
          />
          <Popconfirm
            title="Delete"
            description="Are you sure to delete this task?"
            onConfirm={() => confirm(record)}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <DeleteTwoTone
              // onClick={() => confirm(record)}
              twoToneColor="red"
              style={{ cursor: "pointer", fontSize: 18 }}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const onSearch = (value) => {
    const searchValues = data.filter((task) => {
      return task.name === value;
    });
    setTempData(searchValues);
  };

  useEffect(() => {
    setTempData(data);
  }, []);

  const resetData = () => {
    setTempData(data);
  };

  return (
    <>
      <div className="task-container">
        <TaskCreate
          onClose={onClose}
          open={open}
          editData={selectedData}
          fetchData={fetchData}
        />
        {selectedData && (
          <TaskSingleView
            onClose={onCloseProjectView}
            open={showProjectView}
            record={selectedData}
          />
        )}
        <Space direction="vertical" style={{ display: "flex" }}>
          <Row>
            <Col xs={12} sm={16} md={12} lg={16} xl={20}>
              <h2 className="task-sub-title">Task Dashboard</h2>
            </Col>
            <Col xs={12} sm={8} md={12} lg={8} xl={4}>
              <div className="btn">
                <Button onClick={showDrawer} type="primary">
                  <PlusOutlined
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                    }}
                  />{" "}
                  New Task
                </Button>
              </div>
            </Col>
          </Row>
          <div className="task-search">
            <AutoComplete
              onClear={resetData}
              allowClear={true}
              style={{
                width: "100%",
                padding: "10px 5px",
              }}
              options={task}
              filterOption={(inputValue, option) =>
                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
                -1
              }
            >
              <Input.Search
                size="large"
                placeholder="Search Task"
                onSearch={onSearch}
              />
            </AutoComplete>
          </div>
          <div className="table-view">
            <Table
              columns={columns}
              pagination={{ pageSize: 10 }}
              dataSource={tempData}
            />
          </div>
        </Space>
      </div>
    </>
  );
};

export default TaskDashboard;
