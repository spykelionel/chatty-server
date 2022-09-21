import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
        type: String,
        required: true,
      },
    user: Object,
    body: {
      text: {
        type: String,
        required: true,
      },
      attachment: {
        type: [String],
        default: "",
      }
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
