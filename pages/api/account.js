import jwt from "jsonwebtoken";

import User from "../../models/User";

import connectDb from "../../utils/connectDb";

connectDb();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await handleGetRequest(req, res);
      break;
    case "PUT":
      await handlePutRequest(req, res);
      break;
    default:
      res.status(405).send(`Method ${req.method} not allowed`);
      break;
  }
};

const handleGetRequest = async (req, res) => {
  //check if request has token

  if (!("authorization" in req.headers)) {
    return res.status(401).send("No authorization token");
  }

  try {
    //Access token from request header and
    //verify it to get userId stored in it
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );

    //Get user by Id
    const user = await User.findOne({ _id: userId });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    res.status(403).send("Invalid token");
  }
};

//Handle Put Request

const handlePutRequest = async (req, res) => {
  const { _id, role } = req.body;

  try {
    await User.findByIdAndUpdate({ _id }, { role });
    res.status(203).send("User Updated");
  } catch (err) {
    res.status(403).send("Update Failed");
  }
};
