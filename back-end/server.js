const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/names', {
  useNewUrlParser: true
});

// Configure multer so that it will upload to '../front-end/public/images'
const multer = require('multer');
const upload = multer({
  dest: '../front-end/public/images/',
  limits: {
    fileSize: 10000000
  }
});

// Create a scheme for users in the system
const userSchema = new mongoose.Schema({
    name: String,
    path: String,
    friends: [String],
});

// Create a scheme for users in the system
const personSchema = new mongoose.Schema({
    name: String,
    path: String,
    age: String,
    interests: [String],
    where: String,
    physFeatures: [String],
    friends: [String]
});

const User = mongoose.model('User', userSchema);
const Person = mongoose.model('Person', personSchema);


// Upload a photo. Uses the multer middleware for the upload and then returns
// the path where the photo is stored in the file system.
app.post('/api/photos', upload.single('photo'), async (req, res) => {
    // Just a safety check
    if (!req.file) {
      return res.sendStatus(400);
    }
    res.send({
      path: '/images/' + req.file.filename
    });
});

app.listen(3000, () => console.log('Server listening on port 3000!'));
