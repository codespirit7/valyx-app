const { google } = require("googleapis");
const fs = require("fs");
const readline = require("readline");
const TOKEN_PATH = "token.json";
const nodeCron = require("node-cron");

const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];

fs.readFile("credentials.json", (err, content) => {
  if (err) return console.log("Error loading client secret file:", err);
  authorize(JSON.parse(content), listEmails);
});



function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();

    oAuth2Client.getToken(code, (err, token) => {
      if (err)
        return console.error(
          "Error while trying to retrieve access token",
          err
        );

      oAuth2Client.setCredentials(token);

      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

async function listEmails(auth) {
  const gmail = google.gmail({ version: "v1", auth });
  
  gmail.users.messages.list(
    {
      userId: "me",
      q: "subject:Bank Statement",
    },
    (err, res) => {
      if (err) return console.log("The API returned an error: " + err);
      const messages = res.data.messages;
      let cnt = 1;
      if (messages.length) {
        messages.forEach((message) => {
          gmail.users.messages.get(
            {
              userId: "me",
              id: message.id,
            },
            (err, email) => {
              if (err) return console.log("Error getting message:", err);
              const subject = email.data.subject;

              const parts = email.data.payload.parts;
              if (parts && parts.length > 0) {
                parts.forEach((part) => {
                  if (part.filename && part.filename.endsWith(".pdf")) {
                    const attachmentId = part.body.attachmentId;
                    gmail.users.messages.attachments.get(
                      {
                        userId: "me",
                        messageId: email.data.id,
                        id: attachmentId,
                      },
                      (err, attachment) => {
                        if (err)
                          return console.log("Error getting attachment:", err);
                        const targetDirectory = "./pdfDirectory";
                        const data = attachment.data.data;
                        const pdfData = Buffer.from(data, "base64");
                        const pdfFileName = `file${cnt}.pdf`;
                        const targetFilePath = `${targetDirectory}/${pdfFileName}`;
                        fs.writeFileSync(`${targetFilePath}`, pdfData);
                        cnt++;
                        console.log(`Saved PDF attachment as ${pdfFileName}`);
                      }
                    );
                  }
                });
              }
            }
          );
        });
      } else {
        console.log("No emails found.");
      }
    }
  );
}
