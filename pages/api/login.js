import connectDb from "../../utils/connectDb";
import User from "../../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
connectDb();

export default async (req, res) => {
  const { email, password } = req.body;

  try {
    //check if user exist
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).send("User with this email does not exist");
    }

    //check if password is correct
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (isCorrectPassword) {
      const payload = { userId: user._id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res.status(200).json(token);
    } else {
      res.status(401).send("Wrong Password");
    }
  } catch (err) {
    res.status(500).send("Error Logiging In User");
  }
};
