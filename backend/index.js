require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const {Server} = require("socket.io")
const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const mainRouter =require("./routes/main.router")

const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { pushRepo } = require("./controllers/push");
const { pullRepo } = require("./controllers/pull");
const { revertRepo } = require("./controllers/revert");

const argv = yargs(hideBin(process.argv))
  .command("start", "Starts a new server", {}, startServer)
  .command("init", "Initialise a new repository", {}, initRepo)
  .command(
    "add <file>",
    "Add a file to repository",
    (yargs) => {
      yargs.positional("file", {
        describe: "File to add to the staging area",
        type: "string",
      });
    },
    (argv) => {
      addRepo(argv.file);
    },
  )
  .command(
    "commit <message>",
    "commit a stages files",
    (yargs) => {
      yargs.positional("message", {
        describe: "commit message",
        type: "string",
      });
    },
    (argv) => {
      commitRepo(argv.message);
    },
  )
  .command("push", "Push commits to S3", {}, pushRepo)
  .command("pull", "Pull commits to S3", {}, pullRepo)
  .command(
    "revert <commitID>",
    "Revert a specific commit",
    (yargs) => {
      yargs.positional("commitID", {
        describe: "commit ID to revert to",
        type: "string",
      });
    },
    (argv) => {
      revertRepo(argv.commitID);
    },
  )
  .demandCommand(1, "you need at least one command")
  .help().argv;

function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(bodyParser.json());
  app.use(express.json());

  const mongoURI = process.env.MONGODB_URI;

  mongoose.connect(mongoURI)
    .then(() => console.log("MongoDB connected!"))
    .catch((err) =>
      console.error("Unable to connect:",err))

    app.use(cors({origin:"*"}))
    app.use("/",mainRouter)

   
   let user = "test"
    const httpServer = http.createServer(app)
    const io = new Server(httpServer,{
      cors: {
      origin: "*",
      methods: ["Get","Post"]
    }
    })

    io.on("connection",(socket)=>{
      socket.on("joinRoom",(userID)=>{
        console.log("======")
        console.log(user)
        console.log("======")
        socket.join(userID)
      })
    })
    
  
    const db = mongoose.connection

    db.once("open",async()=>{
      console.log("CRUD operations called")
      //CRUD OPERATIONS
    })
    httpServer.listen(port,()=>{
      console.log(`server is running on port: ${port}`)
    })
}
