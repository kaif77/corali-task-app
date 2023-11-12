import { Col, Divider, Drawer, Row } from "antd";
import React from "react";
import { projectStatus } from "../../common/constants";
import "./TaskSingleView.css";
const DescriptionItem = ({ title, content }) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">{title}:</p>
    {content}
  </div>
);

const TaskSingleView = ({ open, onClose, record }) => {
  return (
    <>
      <Drawer
        width={640}
        placement="right"
        onClose={onClose}
        open={open}
        title="Task Details"
      >
        <p className="site-description-item-profile-p">{record.name}</p>
        <Row>
          <Col span={12}>
            <DescriptionItem title="First Name" content={record?.name} />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem title="Assigned To" content={record.assignee} />
          </Col>

          <Col span={12}>
            <DescriptionItem
              title="Task Status"
              content={
                projectStatus.find((status) => status.value === record.status)
                  .label.toUpperCase()
              }
            />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem
              title="Created Date"
              content={record.createdAt.split("T")[0]}
            />
          </Col>
          <Col span={12}>
            <DescriptionItem
              title="Due Date"
              content={record.dueDate.split("T")[0]}
            />
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={24}>
            <DescriptionItem
              title="Description"
              content={record?.description}
            />
          </Col>
        </Row>
      </Drawer>
    </>
  );
};

export default TaskSingleView;
