const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
});

const Analysis = mongoose.model('Analysis', AnalysisSchema);

module.exports = Analysis;
