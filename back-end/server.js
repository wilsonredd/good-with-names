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

app.get('/api/login', async (req, res)  => {
    try{
        let user = await User.findOne({
            name: req.query.name
        });
        res.send(user)
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.post('/api/signup', async (req, res)  => {
    try{
        let user = await User.findOne({
            name: req.body.name
        });
        if (user === null) {
            user = new User({
                name: req.body.name,
                path: null,
                friends: [],
            });
            user.save();
        }
        res.send(user);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.put('/api/friend/:id', async(req, res) => {
    try {
        let user = await User.findOne({
            _id: req.params.id
        });
        console.log(user)
        let person = new Person({
            name: req.body.name,
            path: req.body.path,
            age: "",
            interests: [],
            where: "",
            physFeatures: [],
        });
        person.save();

        user.friends.push(person._id);
        console.log(user.friends);
        user.save()
        res.send(person);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
});

app.get('/api/friends/:id', async(req, res) => {
    try{
        let user = await User.findOne({
            _id: req.params.id
        });
    
        friendIds = user.friends
        friends = []
        let friend = null;
    
        for(let i = 0; i < friendIds.length; i++) {
            friend = await Person.findOne({
                _id: friendIds[i]
            });
            friends.push(friend);
        }
        console.log(friends)
        res.send(friends);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.listen(3000, () => console.log('Server listening on port 3000!'));
