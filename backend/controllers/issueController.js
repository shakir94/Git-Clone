const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

const createIssue = async (req, res) => {
  const { title, description } = req.body;
  const { id } = req.params;

  try {
    const issue = new Issue({
      title,
      description,
      repository: id,
    });
    await issue.save();
    res.status(201).json({ message: "Created", issue });
  } catch (err) {
    console.error("Error during creating issue", err.message);
    res.status(500).send("Server Error");
  }
};

const updateIssueById = async (req, res) => {
  const { title, description, status } = req.body;
  const { id } = req.params;
  
  try {
    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    if (title !== undefined) issue.title = title;
    if (description !== undefined) issue.description = description;
    if (status !== undefined) issue.status = status;

    await issue.save();
    res.json({ message: "Issue updated", issue });

  } catch (err) {
    console.error("Error during updating issue", err.message);  // Fixed message
    res.status(500).json({ message: "Server Error" });
  }
};;

const deleteIssueById = async(req, res) => {
  const {id} = req.params

  try{
     const issue = await Issue.findByIdAndDelete(id)

     if(!issue){
      return res.status(404).json({error:"Issue not found"})
     }

     res.json({message:"Issue deleted"})
  }catch (err) {
    console.error("Error during deleting issue", err.message);  // Fixed message
    res.status(500).json({ message: "Server Error" });
  }
};

const getAllIssue = async(req, res) => {
  const {id} = req.params;

  try{
    const issues = await Issue.find({repository: id});
    
    if(issues.length === 0){
      return res.status(404).json({error: "No issues found"});
    }

    res.status(200).json({message: "All issues fetched successfully", issues});

  }catch (err) {
    console.error("Error during fetching issue", err.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const getIssueById = async(req, res) => {
 const {id} = req.params

 try{
      const issue = await Issue.findById(id)

      if(!issue){
      return res.status(404).json({error:"No issue found"});
    }
      res.json({message:"Issue found",issue})
 }catch (err) {
    console.error("Error during fetching issue", err.message);
    res.status(500).json({ message: "Server Error" });
  }

};

module.exports = {
  getIssueById,
  getAllIssue,
  deleteIssueById,
  updateIssueById,
  createIssue,
};
