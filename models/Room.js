import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description:  {
        type: String,
        default: '',
    },
    users: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: new mongoose.Types.ObjectId("63240aced4dc40450d62c486") //super admin
    }, 
    messages: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Message",
    },
    latestMessage:  Object
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
