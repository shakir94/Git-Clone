const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");



const createRepository = async (req, res) => {
  const { name, description, content, visibility, owner, issues } = req.body;
  console.log("OWNER VALUE:", owner);
console.log("OWNER TYPE:", typeof owner);


  try {
    if (!name) {
      return res.status(400).json({ message: "Repository name is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).json({ message: "Invalid repository Id" });
    }

    const newRepository = new Repository({
      name,
      description,
      content,
      visibility,
      owner,
      issues,
    });

    const result = await newRepository.save();
    res
      .status(201)
      .json({ message: "Repository Created", repositoryID: result._id });
  } catch (err) {
    console.error("Error during repo creation", err.message);
    res.status(500).json({
    message: err.message,
    error: err,
  });
  }
};

const getAllRepositories = async (req, res) => {
  try {
    const repositories = await Repository.find({})
      .populate("owner")
      .populate("issues");

    res.json({ repositories });
  } catch (err) {
    console.error("Error during fetching", err.message);
    res.status(500).send("Server Error");
  }
};

const fetchRepositoryById = async (req, res) => {
  const currentId = req.params.id;
  try {
    const repository = await Repository.findById(currentId)
      .populate("owner", "username email _id")
      .populate("issues");

    if (!repository) {
      return res.status(404).json({ message: "Repository not found" });
    }

    res.json(repository); 
  } catch (err) {
    console.error("Error during fetching", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const fetchRepositoryByName = async (req, res) => {
  const { name } = req.params;
  try {
    const repository = await Repository.find({ name })
      .populate("owner")
      .populate("issues");

    res.json({ repository });
  } catch (err) {
    console.error("Error during fetching", err.message);
    res.status(500).send("Server Error");
  }
};

const fetchRepositoryForCurrentUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const repositories = await Repository.find({ owner: userId });
    if (!repositories || repositories.length === 0) {
      return res.status(404).json({ error: "User Repositories not found" });
    }
    res.json({ message: "Repository found", repositories });
  } catch (err) {
    console.error("Error during fetching the repo", err.message);
    res.status(500).send("Server Error");
  }
};

const updateRepositoryById = async (req, res) => {
  const id = req.params.id;
  const { content, description } = req.body;

  try {
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    
    if (content) {
      repository.content.push(content);
    }
    
    if (description !== undefined) {
      repository.description = description;
    }

    const updatedRepository = await repository.save();

    res.json({
      message: "Repository updated successfully",
      repository: updatedRepository,
    });
  } catch (err) {
    console.error("Error during updating repository", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const toggleVisibilityById = async (req, res) => {
  const id = req.params.id;

  try {
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    repository.visibility = !repository.visibility;

    const updatedRepository = await repository.save();

    res.json({
      message: "Repository visibility toggled successfully",
      repository: updatedRepository,
    });
  } catch (err) {
    console.error("Error during toggling visibility");
    res.status(500).send("Server Error");
  }
};

const deleteRepositoryById = async (req, res) => {
  const id = req.params.id;
  try {
    const repository = await Repository.findByIdAndDelete(id);

    if (!repository) {
      return res.status(404).json({ message: "Repository not found" });
    }
    res.json({ message: "Repository deleted successfully", repository });
  } catch (err) {
    console.error("Error during deleting", err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  createRepository,
  getAllRepositories,
  fetchRepositoryById,
  fetchRepositoryByName,
  fetchRepositoryForCurrentUser,
  updateRepositoryById,
  toggleVisibilityById,
  deleteRepositoryById,
};
