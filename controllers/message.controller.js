import Message from "../models/Message.js";
import User from "../models/User.js";
import {Server} from "socket.io";

// const io = Server(process.env.SOCKET_PORT, {
//   cors: {
//     origin: "http://localhost:1234",
//   },
// });

// io.on("connection", (socket) => {
//   console.log("Connection established");

//   getAllMessages()
//     .then((results) => {
//       socket.emit("mostRecentMessages", results.reverse());
//     })
//     .catch((error) => {
//       socket.emit("mostRecentMessages", []);
//     });

//   socket.on("newChatMessage", (data) => {
//     //send event to every single connected socket
//     const msgData = {
//       sender: {
//         user_name: data.name,
//         user_avatar: data.avatar,
//       },
//       body: {
//         text:data.message,
//         attachment: data.attachment??''
//       },
//     };
//     User.findOne({ name: sender.name })
//       .then(async (user) => {
//         const message = new Message({
//           sender: user,
//           body
//         })
//         message.save()
//         .then(saved=> {
//           io.emit("newChatMessage", saved)
//           return res.status(201).json(saved)
//         })
//         // return res.status(200).json(sender)
//       })
//       .catch((err) => console.error(err));
//     // try {
//     //   const message = new Message(msgData);
//     //   message
//     //     .save()
//     //     .then(() => {
//     //       io.emit("newChatMessage", msgData);
//     //     })
//     //     .catch((error) => console.log("error: " + error));
//     // } catch (e) {
//     //   console.log("error: " + e);
//     // }

//   });
//   socket.on("disconnect", () => {
//     console.log("connection disconnected");
//   });
// });

async function getAllMessages(req, res) {
  const { roomId } = req.params;
  console.log("RoomID:")
  console.log(roomId)
  
  try {
    await Message.find({ room: roomId })
      .lean()
      .then((result) => {
        // io.on("connection", _=>{
        //   return result
        // })
        return res.status(200).send(result)
      })
      .catch((err) => res.status(501).send(err));
  } catch (error) {
    return res
      .status(503)
      .send({ message: "Server is Down" });
  }
}

async function getOneMessage(req, res) {
  try {
    await Message.findOne({ _id: req.params.id })
      .lean()
      .then((result) => res.status(200).send(result))
      .catch((err) => res.status(503).send(err));
  } catch (error) {
    return res
      .send(501)
      .json({ message: "Server is Down" });
  }
}

async function createMessage(req, res) {
  // const body = req.body
  try {
    console.log("Init create Message");

    User.findOne({ name: req.body.sender })
      .then(async (user) => {
        if (user) {
          const message = new Message({
            sender: user.name,
            user,
            body: {
              text: req.body.body.text,
            },
            room: req.body.room
          });
          message.save().then((saved) => {
            return res.status(201).json(saved);
          });
        } else {
          return res
            .status(404)
            .json({ message: "No user found" });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(503).send({ ...err });
      });
  } catch (error) {
    return res
      .send(501)
      .json({ message: "Server is Down" });
  }
}

async function deleteOneMessage(req, res) {
  try {
    await Message.deleteOne({ _id: req.params.id })
      .then((result) => res.status(200).send(result))
      .catch((err) => res.status(503).send(err));
  } catch (error) {
    return res
      .send(501)
      .json({ message: "Server is Down" });
  }
}

const message = {
  getAllMessages,
  getOneMessage,
  createMessage,
  deleteOneMessage,
};

export default message;
