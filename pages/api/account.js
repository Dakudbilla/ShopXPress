import jwt from "jsonwebtoken";

import User from "../../models/User";

import connectDb from "../../utils/connectDb";

connectDb();

export default async (req, res) => {
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
