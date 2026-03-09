import { Button, Popover } from "antd";
import { Smile } from "lucide-react";
import React from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const Content = ({
  handleChange,
}: {
  handleChange: (emoji: { native: string }) => void;
}) => {
  // const [emoji, setEmoji]= useState()
  const handleEmojiSelect = (emoji: { native: string }) => {
    handleChange(emoji);
    console.log(emoji);
  };
  return <Picker data={data} onEmojiSelect={handleEmojiSelect} />;
};

const EmojiBox = ({
  handleChange,
}: {
  handleChange: (emoji: { native: string }) => void;
}) => {
  return (
    <div>
      <Popover content={<Content handleChange={handleChange} />} title="Emojis">
        <Button
          type="text"
          shape="circle"
          icon={<Smile size={20} />}
          style={{ color: "#54656f" }}
        />
      </Popover>
    </div>
  );
};

export default EmojiBox;
