import multer from "multer";
import bcrypt from 'bcrypt'
import User from "../models/User.js";
// import fileUploader from "./fileUploader.js";

const dev = multer.diskStorage({
  destination: (req, res, cb) => {
    return cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    try {
      console.log("uploading....")
      cb(
        null,
        new Date().toISOString() + "_" + file.originalname
      );
      console.log("finished uploading.")
    } catch (error) {
      console.log("ERROR UPLOADING:", error)
    }
  },
});
const storage = multer.memoryStorage();
const uploads = multer({ storage });

async function getAllUsers(req, res) {
  try {
    await User.find({})
      .lean()
      .select("_id name rooms avatar createdAt")
      .then((result) => res.status(200).send(result))
      .catch((err) => res.status(503).send(err));
  } catch (error) {
    return res
      .send(501)
      .json({ message: "Server is Down" });
  }
}

async function getOneUser(req, res) {
  try {
    await User.findOne({ _id: req.params.id })
      .lean()
      .select("_id name rooms avatar createdAt")
      .then((result) => res.status(200).send(result))
      .catch((err) => res.status(503).send(err));
  } catch (error) {
    return res
      .send(501)
      .json({ message: "Server is Down" });
  }
}

async function createUser(req, res) {
  try {
    console.log("Init create user");
    User.exists({ name: req.body.name })
      .then(async (result) => {
        if (!result) {
          try {
            const salt = 10;
            bcrypt.hash(req.body.password, salt)
              .then( async (password)=>{
                const user = new User({
                  ...req.body,
                  password,
                  avatar_url: req.file?.path ?? "",
                });
                console.log("creating user.....");
                await user
                  .save()
                  .then((result) => {
                    return res.status(201).send(result);
                  })
                  .catch((err) => {
                    console.log(err)
                    return res.status(501).send({...err, state: "Caught here...."});
                  });
              })
              .catch(hashError=>{
                console.log(hashError)
                return res.status(501).json({
                  message: "Could not hash this password",
                  status: 501
                })
              })
            
          } catch (error) {
            console.log("CATCH_BLOCK",error);
          }
        } else {
          res.status(409).json({
            message: "Name already Exist",
            status_code: 409
          });
        }
      })
      .catch((err) => console.error(err));
  } catch (error) {
    return res
      .send(501)
      .json({ message: "Server is Down" });
  }
}

async function deleteOneUser(req, res) {
  try {
    await User.deleteOne({ _id: req.params.id })
      .then((result) => res.status(200).send(result))
      .catch((err) => res.status(503).send(err));
  } catch (error) {
    return res
      .send(501)
      .json({ message: "Server is Down" });
  }
}

const uploadAvatar = uploads.single("user_avatar");

const user = {
  getAllUsers,
  getOneUser,
  createUser,
  deleteOneUser,
  uploadAvatar,
};

export default user;
