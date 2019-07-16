import React from "react";

const Notification = ({ message }) => {
  if (message.content === null) {
    return null;
  }

  if (message.success) {
    return <div className="success">{message.content}</div>;
  }

  return <div className="error">{message.content}</div>;
};

export default Notification;
