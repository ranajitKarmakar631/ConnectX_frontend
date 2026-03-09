import { Dropdown, MenuProps, Space } from "antd";
import React, { useState, useRef, useEffect } from "react";
import { IoMdNotifications } from "react-icons/io";

const NotificationButton = () => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ offsetX: number; offsetY: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current = {
      offsetX: e.clientX - position.x,
      offsetY: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !dragRef.current) return;

    setPosition({
      x: e.clientX - dragRef.current.offsetX,
      y: e.clientY - dragRef.current.offsetY,
    });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const screenWidth = window.innerWidth;
    const buttonWidth = 60;

    const snapX =
      position.x + buttonWidth / 2 < screenWidth / 2
        ? 10
        : screenWidth - buttonWidth - 10;

    setPosition((prev) => ({
      ...prev,
      x: snapX,
    }));
  };

  // Attach move & up to window for smoother dragging
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  });
  const items: MenuProps["items"] = [
    {
      label: (
        <a
          href="https://www.antgroup.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          1st menu item
        </a>
      ),
      key: "0",
    },
    {
      label: (
        <a
          href="https://www.aliyun.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          2nd menu item
        </a>
      ),
      key: "1",
    },
    {
      type: "divider",
    },
    {
      label: "3rd menu item",
      key: "3",
    },
  ];
  return (
    <div
      onDoubleClick={handleMouseDown}
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        background:
          "linear-gradient(-45deg, #1677ff, #69b1ff, #40a9ff, #91caff)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        cursor: isDragging ? "grabbing" : "grab",
        boxShadow: "0 5px 40px grey",
        zIndex: 999,
        transition: isDragging ? "none" : "left 0.3s ease",
      }}
    >
      <Dropdown menu={{ items }} trigger={["click"]}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            <IoMdNotifications style={{ fontSize: "30px", color: "black" }} />
          </Space>
        </a>
      </Dropdown>
    </div>
  );
};

export default NotificationButton;
