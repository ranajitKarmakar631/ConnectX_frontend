import { Button, Popover } from "antd";
import { Smile } from "lucide-react";
import React, { useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const Content = ({handleChange}:{handleChange:any}) => {
  // const [emoji, setEmoji]= useState()
   const handleEmojiSelect = (emoji : any) => {
    handleChange(emoji)
    console.log(emoji);
  }
  return <Picker data={data} onEmojiSelect={handleEmojiSelect}  />;
};

const EmojiBox = ({handleChange}:{handleChange:any}) => {
  return (
    <div>
      <Popover content={<Content handleChange={handleChange}/>} title="Emojis">
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
