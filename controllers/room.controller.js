import Room from "../models/Room.js";

async function getAllRooms(req, res) {
  try {
    await Room.find({})
      .lean()
      .then((result) => res.status(200).send(result))
      .catch((err) => res.status(503).send(err));
  } catch (error) {
    return res
      .send(501)
      .json({ message: "Server is Down" });
  }
}

async function getOneRoom(req, res) {
  try {
    await Room.findOne({ _id: req.params.id })
      .lean()
      .then((result) => res.status(200).send(result))
      .catch((err) => res.status(503).send(err));
  } catch (error) {
    return res
      .send(501)
      .json({ message: "Server is Down" });
  }
}

async function createRoom(req, res) {
  const { name, description, users } = req.body;
  Room.exists({ name }).then((room) => {
    if (!room) {
      try {
        console.log("Init create Room");
        const room = new Room({
          name,
          description,
          users,
        });
        room
          .save()
          .then((saved) => {
            return res.status(201).json(saved);
          })
          .catch((err) => console.error(err));
      } catch (error) {
        return res
          .send(501)
          .json({ message: "Server is Down" });
      }
    } else {
      return res.status(409).json({
        message: "Room already exists",
        status: 409,
      });
    }
  });
}

async function deleteOneRoom(req, res) {
  try {
    await Room.deleteOne({ _id: req.params.id })
      .then((result) => res.status(200).send(result))
      .catch((err) => res.status(503).send(err));
  } catch (error) {
    return res
      .send(501)
      .json({ message: "Server is Down" });
  }
}

async function updateOneRoom(req, res) {
  const { roomId } = req.params;
  Room.exists({ _id: roomId }).then((exist) => {
    if (!exist) {
      return res
        .status(404)
        .json({ message: "Room not found", status: 404 });
    }
    Room.updateOne(
      { _id: roomId },
      { latestMessage: req.body.latestMessage },
      { upsert: false }
    )
      .then((success) => {
        return res.status(200).json({
          ...success,
          messsage: "Latest message updated",
          status: 201,
        });
      })
      .catch((err) => {
        res.status(501).json({
          ...err,
          message: "Service unavailable or server is down",
          status: 501,
        });
      });
  });
}

const room = {
  getAllRooms,
  getOneRoom,
  createRoom,
  deleteOneRoom,
  updateOneRoom,
};

export default room;
