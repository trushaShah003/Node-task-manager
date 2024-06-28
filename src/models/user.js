const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Enter a valid email!");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 7,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error("passwords cannot contain the key 'password' !");
        }
      },
    },
    age: {
      type: Number,
      validate(value) {
        if (value < 0) {
          throw new Error("Age must be a positive integer!");
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "author",
});

//instance method for generating jwt tokens
userSchema.methods.generateToken = async function () {
  const user = this;

  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();

  delete userObj.password;
  delete userObj.tokens;
  delete userObj.avatar;

  return userObj;
};

// module method for login

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email: user not found!");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid password!");
  }

  return user;
};

// Middleware : to hash password before saving
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

userSchema.pre("findOneAndDelete", async function (next) {
  const user = this;
  // console.log("useruser", user);
  console.log("id", user._conditions._id);

  try {
    await Task.deleteMany({ author: user._conditions._id });
    next();
  } catch (e) {
    console.log("error :", e);
    next(e);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
