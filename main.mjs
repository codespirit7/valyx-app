import { json } from "agent-base";
import fs from "fs";
import PDFParser from "pdf2json";
import path from 'path';
import mongoose from 'mongoose';

const pdfDirectory = "./pdfDirectory"; 
const outputDirectory = "./outputDirectory"; // Replace with your output directory path

// List all PDF files in the directory
fs.readdir(pdfDirectory, (err, files) => {
    if (err) {
        console.error("Error reading PDF directory:", err);
        return;
    }

    // Initialize a PDFParser for each file
    files.forEach(file => {
        const pdfParser = new PDFParser();

        pdfParser.on("pdfParser_dataError", errData => console.error("Data Error:", errData.parserError));
        pdfParser.on("pdfParser_dataReady", pdfData => {
            const outputFilename = `${outputDirectory}/${file.replace(".pdf", ".json")}`;

            console.log(`Data ready, writing to file: ${outputFilename}`);
            fs.writeFile(outputFilename, JSON.stringify(pdfData), err => {
                if (err) {
                    console.error("Error writing to file:", err);
                } else {
                    console.log("File saved successfully.");
                }
            });
        });

        const pdfFilePath = `${pdfDirectory}/${file}`;
        pdfParser.loadPDF(pdfFilePath);
    });
});


