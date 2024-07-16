const express = require('express');
const cors = require('cors');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const mongoose = require('mongoose');
const Analysis = require('./models/Analysis');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

require('dotenv').config();

const mongoURI = process.env.MONGO_URL;

mongoose.connect(mongoURI);

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

const allowedFileTypes = ['image/jpeg', 'image/png'];

app.post('/upload', upload.single('image'), async (req, res) => {
  const image = req.file;

  if (!image || !allowedFileTypes.includes(image.mimetype)) {
    return res.status(400).json({ error: 'Only JPG/PNG files are allowed' });
  }

  try {
    const { data: { text: imageText } } = await Tesseract.recognize(
      image.path,
      'eng',
      { logger: m => console.log(m) }
    );

    const newAnalysis = new Analysis({ text: imageText });
    await newAnalysis.save();

    res.json({ imageText });
  } catch (error) {
    console.error('Error recognizing text:', error);
    res.status(500).json({ error: 'Error recognizing text from image' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
