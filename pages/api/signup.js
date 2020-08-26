import connectDb from "../../utils/connectDb";
import User from "../../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import isEmail from "validator/lib/isEmail";
import isLength from "validator/lib/isLength";
import Cart from "../../models/Cart";

connectDb();

export default async (req, res) => {
  const { name, email, password } = req.body;

  try {
    //Validate body
    if (!isLength(name, { min: 2, max: 30 })) {
      return res.status(422).send("Name must be 2-30 characters long");
    } else if (!isLength(password, { min: 6 })) {
      return res
        .status(422)
        .send("Password must be at least 6 characters long");
    } else if (!isEmail(email)) {
      return res.status(422).send("Enter valid Email");
    }
    //check if user exists with same email
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).send("User With This Email Already  Exist");
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    //create new user
    const newUser = await new User({ name, email, password });

    newUser.password = hashedPassword;
    await newUser.save();
    //create cart for user
    await new Cart({ user: newUser._id }).save();

    //generate token for user using jwt
    const payload = { userId: newUser._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json(token);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error Signing Up");
  }
};
