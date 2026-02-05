const fs = require("fs").promises;
const path = require("path");
const {
  ListObjectsV2Command,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
//ListObjectsV2Command = S3 bucket mein files ki list lene ka command, GetObjectCommand = S3 se file download karne ka command

const { s3Client, S3_BUCKET } = require("../config/aws-config");

async function pullRepo() {
  const repoPath = path.resolve(process.cwd(), ".shakirGit");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: S3_BUCKET,
      Prefix: "commits/",
    });

    const data = await s3Client.send(listCommand);
    const objects = data.Contents;

    for (const object of objects) {
      const key = object.Key;
      const commitDir = path.join(
        commitsPath,
        path.dirname(key).split("/").pop(),
      );

      await fs.mkdir(commitDir, { recursive: true });

      const getCommand = new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
      });

      const fileData = await s3Client.send(getCommand);
      const chunks = [];
      for await (const chunk of fileData.Body) {
        chunks.push(chunk);
      }
      const fileContent = Buffer.concat(chunks);

      await fs.writeFile(path.join(repoPath, key), fileContent);
    }
    console.log("File is pulled from from s3.");
  } catch (err) {
    console.error("Unable to pull:", err);
  }
}

module.exports = { pullRepo };
