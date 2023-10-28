const express = require("express");
const app = express();
const Transaction = require("./models/Transaction"); // Import your transaction model
const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://codespirit7:zRyhZLbby8UWQsEj@cluster0.wvcngti.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);


// Endpoint to retrieve a list of all transactions
app.get("/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// Endpoint to search for transactions within a specific date range
app.get("/transactions/search", async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const transactions = await Transaction.find({
      date: { $gte: startDate, $lte: endDate },
    });
    res.json(transactions);
  } catch (err) {
    console.error("Error searching for transactions:", err);
    res.status(500).json({ error: "Failed to search for transactions" });
  }
});

// Endpoint to get the total balance as of a specific date
app.get("/balance", async (req, res) => {
  const { date } = req.query;

  try {
    const totalBalance = await Transaction.findOne(
      { date: { $lte: date } },
      {},
      { sort: { date: -1 } }
    );
    console.log(totalBalance);
    
    res.json(totalBalance);
  } catch (err) {
    console.error("Error fetching total balance:", err);
    res.status(500).json({ error: "Failed to fetch total balance" });
  }
});

// Start the Express server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


