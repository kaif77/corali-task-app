import { notification } from "antd";

export const AntNotification = (type, title, description) => {
  notification.config({ maxCount: 1 });
  notification[type]({
    message: title,
    description: description,
  });
};
