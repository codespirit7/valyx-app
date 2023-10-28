import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import DataModel from "./models/Transaction.js";


// Replace with your MongoDB connection string
mongoose.connect(
  "mongodb+srv://<username>:<password>@cluster0.wvcngti.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Function to read JSON files from a directory
function readJsonFilesFromDirectory(directory) {
  const files = fs.readdirSync(directory);
  const jsonFiles = files.filter((file) => path.extname(file).toLowerCase() === '.json');
  return jsonFiles.map((file) => path.join(directory, file));
}

//  data extraction logic - Modify this as needed
function extractDataFromJsonFile(filePath) {
  const fileData = fs.readFileSync(filePath, 'utf8');
  const jsonData = JSON.parse(fileData);

  const filteredFields = [];
  for (let element of jsonData.Pages[0].Fields) {
    let id_ = element.id.Id;
    if (id_.substring(0, 3) === "F02") {
      filteredFields.push(element);
    }
  }

  const transformedData = [];

  for (let i = 0; i < filteredFields.length; i += 5) {
    let date, desc, debit, credit, balance;
    for (let j = 0; j < 5; j++) {
      let data = filteredFields[i + j];
      if (data !== undefined) {
        if (data.id.Id.substring(data.id.Id.length - 1) === "a") {
          date = data.V;
        } else if (data.id.Id.substring(data.id.Id.length - 1) === "b") {
          desc = data.V;
        } else if (data.id.Id.substring(data.id.Id.length - 1) === "c") {
          credit = data.V;
        } else if (data.id.Id.substring(data.id.Id.length - 1) === "d") {
          debit = data.V;
        } else if (data.id.Id.substring(data.id.Id.length - 1) === "e") {
          balance = data.V;
        }
      }
    }

    const transformedEntry = {
      date: date,
      description: desc,
      credit: credit, 
      debit: debit,
      balance: balance,
    };

    transformedData.push(transformedEntry);
  }

  return transformedData;
}

const directoryPath = './outputDirectory/'; // Update this with the directory path containing your JSON files

const jsonFiles = readJsonFilesFromDirectory(directoryPath);

jsonFiles.forEach((filePath) => {
  const extractedData = extractDataFromJsonFile(filePath);
  console.log(extractedData);

  // Create a new Mongoose document for each entry and save it to the database
  extractedData.forEach((entry) => {
    const dataDocument = new DataModel(entry);
    dataDocument.save()
      .then(() => {
        console.log('Data saved to MongoDB successfully');
      })
      .catch((err) => {
        console.error('Error saving data to MongoDB:', err);
      });
  });
});

