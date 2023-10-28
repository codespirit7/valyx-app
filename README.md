# valyx-

1. git clone

2. Installing all the dependencies for the project.
  ``` npm install ```

3. Set up a Google Cloud Project and enable the Gmail API:

a. Go to the Google Cloud Console (https://console.cloud.google.com/).
b. Create a new project or select an existing one.
c. Enable the Gmail API:

In the left-hand navigation pane, click on "APIs & Services" > "Library."
Search for "Gmail API" and enable it for your project.
d. Configure the OAuth consent screen by clicking on the "OAuth consent screen" in the same navigation pane. Follow the prompts to fill in the required information.
e. Create OAuth 2.0 credentials. Go to "APIs & Services" > "Credentials" and click "Create credentials" to create a new OAuth client ID. Choose "Desktop app" for the application type.
f. Add 'credentials.json' with the path to your OAuth client credentials file.
```
{
    "installed": {
      "client_id": "YOUR_CLIENT_ID",
      "project_id": "YOUR_PROJECT_ID",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://accounts.google.com/o/oauth2/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_secret": "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",
      "redirect_uris": ["urn:ietf:wg:oauth:2.0:oob", "http://localhost:5000"]
    }
}
```

4. The project is divided into four parts.
   A. To retrieve the attached pdf from Gmail with varying addresses and the same subject, store it in pdfDirectory folder.
      ```node script.js```
      After running the script it will ask for Google authentication.

   B. Extract the data from multiple pdf and store it in JSON data in outputDirectory folder.
      ```node main.mjs```

   C. Save the extracted JSON data on MongoDB database.
      ```node database.mjs```

  Note: For continously running the script
        1. install pm2
        ```npm install pm2```
        2. run all the above script
        ```pm2 start script.js```
        ```pm2 start main.mjs```
        ```pm2 start database.mjs```
   
   D. start the express server for interacting with the parsed bank statement data.
      ```npm run start```

5. Testing API with POSTMAN/ThunderClient
      API Endpoints:
      1. API endpoint to retrieve a list of parsed transactions.

        ```http://localhost:3000/transactions/```

      2. API endpoint to search for transactions within a specific date range.

        ```http://localhost:3000/transactions/search?startDate=08-08-2023&endDate=10-08-2023```

      3. API endpoint to get the total balance as of a specific date.

         ```https://localhost:3000/balance?date = 2023-08-08```
    

