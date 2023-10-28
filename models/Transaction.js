const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  date: {
    type: String,
  },
  description: {
    type: String,
  },
  credit: {
    type: String,
    default: '0',
  },
  debit: {
    type: String,
    default: '0',
  },
  balance: {
    type: String,
  },
});

const DataModel = mongoose.model("Data", dataSchema);

module.exports = DataModel;