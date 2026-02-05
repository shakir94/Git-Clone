const fs = require("fs").promises;
const path = require("path");
const { PutObjectCommand } = require("@aws-sdk/client-s3");//used to upload files on s3

const { s3Client, S3_BUCKET } = require("../config/aws-config");

async function pushRepo() {
    const repoPath = path.resolve(process.cwd(), ".shakirGit");
    const commitsPath = path.join(repoPath, "commits");

    try {
        const commitsDir = await fs.readdir(commitsPath);
        for (const commitDir of commitsDir) {
            const commitPath = path.join(commitsPath, commitDir);
            const files = await fs.readdir(commitPath);

            for (const file of files) {
                const filePath = path.join(commitPath, file);
                const fileContent = await fs.readFile(filePath);

                const params = {
                    Bucket: S3_BUCKET,
                    Key: `commits/${commitDir}/${file}`,
                    Body: fileContent
                };

                const command = new PutObjectCommand(params);
                await s3Client.send(command);
            }
        }

        console.log(`All commits is pushed to S3`);
    } catch (err) {
        console.error('Error pushing to S3:', err);
    }
}

module.exports = { pushRepo };