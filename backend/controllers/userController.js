const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb");

dotenv.config();
const uri = process.env.MONGODB_URI;

let client;

async function connectionClient() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
}

const signUp = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    await connectionClient();
    const db = client.db("Git");
    const userCollection = db.collection("users");

    const user = await userCollection.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "User already exists!" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = {
      username,
      password: hashPassword,
      email,
      repositories: [],
      followedUsers: [],
      starRepos: [],
    };
    const result = await userCollection.insertOne(newUser);

    const token = jwt.sign(
      { id: result.insertedId },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "2h" },
    );
    res.json({ token, userId:result.insertedId});
  } catch (err) {
    console.error("Error during signup", err.message);
    res.status(500).send("Server error");
  }
};

const logIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    await connectionClient();
    const db = client.db("Git");
    const userCollection = db.collection("users");

    const user = await userCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "2h",
    });
    res.json({ token, userId: user._id });
  } catch (err) {
    console.log("Error during login", err.message);
    res.status(500).send("Server error");
  }
};

const getAllUsers = async (req, res) => {
  try {
    await connectionClient();
    const db = client.db("Git");
    const userCollection = db.collection("users");

    const users = await userCollection.find({}).toArray();
    res.json({ users });
  } catch (err) {
    console.error("Error during fetching:", err.message);
    res.status(500).send("Server Error");
  }
};

const getUserProfile = async (req, res) => {
  const currentId = req.params.id;
  try {
    await connectionClient();
    const db = client.db("Git");
    const userCollection = db.collection("users");
    const user = await userCollection.findOne({
      _id: new ObjectId(currentId),
    });
    res.send(user);
    if (!user) {
      res.status(400).send("user not found");
    }
  } catch (err) {
    console.error("Error during fetching:", err.message);
    res.status(500).send("Server Error");
  }
};

const updateUserProfile = async (req, res) => {
  const currentId = req.params.id;
  const { email, password } = req.body;
  try {
    await connectionClient();
    const db = client.db("Git");
    const userCollection = db.collection("users");

    let updateFields = { email };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateFields.password = hashedPassword;
    }
    const result = await userCollection.findOneAndUpdate(
      {
        _id: new ObjectId(currentId),
      },
      { $set: updateFields },
      { returnDocument: "after" },
    );
    if (!result) {
      return res.status(400).json({ message: "User not found" });
    }
    res.send(result);
  } catch (err) {
    console.error("Error during updating:", err.message);
    res.status(500).send("Server Error");
  }
};

const deleteUserProfile = async (req, res) => {
  const currentId = req.params.id;
  try {
    await connectionClient();
    const db = client.db("Git");
    const userCollection = db.collection("users");

    const result = await userCollection.deleteOne({
      _id: new ObjectId(currentId),
    });

    if (result.deleteCount === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    res.send("User deleted");
  } catch (err) {
    console.error("Error during deleting:", err.message);
    res.status(500).send("server Error");
  }
};

module.exports = {
  getAllUsers,
  signUp,
  logIn,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
