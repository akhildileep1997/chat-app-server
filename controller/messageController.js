import Chat from "../model/chatModel.js";
import Message from "../model/messageModel.js";
import {getReceiverSocketId, io} from '../index.js'

//logic for sending message
export const sendMessageController = async (req, res) => {
  try {
    const { id: receiverId } = req.params; //receiver id from params
    const { message } = req.body;
    const senderId = req.user._id; //sender id getting from protected route

    let chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (!chat) {
      chat = await Chat.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      chat.messages.push(newMessage._id);
    }
    // await chat.save();
    // await newMessage.save();
    await Promise.all([newMessage.save(), chat.save()]); // for above code do it simultaneously using
    
    //  socket implementing part
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }
    return res.status(201).send({
      success: true,
      message: "message sent successfully",
      chat: newMessage,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      success: false,
      message: "something went wrong server error",
      error: error.message,
    });
  }
};

//logic for getting the message
export const getMessageController = async (req, res) => {
  try {
    const { id: userToChatId } = req.params; //from params
    const senderId = req.user._id; //coming from protected route
    const chat = await Chat.findOne({
      participants: { $all: [senderId, userToChatId] }
    }).populate("messages");
    if (!chat) {
      return res.status(200).send({
        chat:[]
      })
    }
    return res.status(200).send({
      success: true,
      message: `messages 0f ${userToChatId} and ${senderId} fetched successfully`,
      chat:chat.messages
    })
  } catch (error) {
    console.log(error.message);
    res.status(500).send({
      success: false,
      message: "something went wrong server error",
      error: error.message,
    });
  }
};
