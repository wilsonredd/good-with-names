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
    interest: String,
    where: String,
    definingPhysicalFeature: String
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
        // Find user
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
        // Check if user already exists
        let user = await User.findOne({
            name: req.body.name
        });
        if (user === null) {
            // Create new user
            user = new User({
                name: req.body.name,
                path: null,
                friends: [],
            });
            user.save();

            // Create new person from user info
            let person = new Person({
                _id: user._id,
                name: req.body.name,
                path: null,
                age: "",
                interest: "",
                where: "",
                definingPhysicalFeature: "",
            });
            person.save();
        }
        res.send(user);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.put('/api/friend/:id', async(req, res) => {
    try {
        // Find user
        let user = await User.findOne({
            _id: req.params.id
        });

        if(req.body.path === "") {
            req.body.path = "/images/dummy.jpg";
        }

        // Create new friend object
        let person = new Person({
            name: req.body.name,
            path: req.body.path,
            age: req.body.age,
            interest: req.body.interest,
            where: req.body.where,
            definingPhysicalFeature: req.body.physical
        });
        person.save();

        // Push friend's id onto users friend list
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
        // Find user
        let user = await User.findOne({
            _id: req.params.id
        });
    
        friendIds = user.friends
        friends = []
        let friend = null;
    
        // For each friend id in user's friends list
        //  find person object and add it to array
        for(let i = 0; i < friendIds.length; i++) {
            friend = await Person.findOne({
                _id: friendIds[i]
            });
            friends.push(friend);
        }
        res.send(friends);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.get('/api/info/:id', async(req, res) => {
    try {
        // Find person corresponding to user
        let person = await Person.findOne({
            _id: req.params.id
        })
        res.send(person);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }

});

app.put('/api/person/:id', async(req, res) => {
    try {
        let person = await Person.findOne({
            _id: req.params.id
        });
        if(req.body.path === "") {
            req.body.path = "/images/dummy.jpg";
        }
        console.log(person)
        if(req.body.name != "") 
            person.name = req.body.name;
        if(req.body.age != "") 
            person.age = req.body.age;
        if(req.body.interest != "") 
            person.interest = req.body.interest;
        if(req.body.where != "") 
            person.where = req.body.where;
        if(req.body.physical != "") 
            person.definingPhysicalFeature = req.body.physical;
        if(req.body.path != "") 
            person.path = req.body.path;
        person.save();
        res.send(person);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.delete('/api/friend/:id/:delId', async(req, res) => {
    try {
        let user = await User.findOne({
            _id: req.params.id
        });
        console.log(req.params.delId);
        console.log(user.friends)
        const index = user.friends.indexOf(req.params.delId);
        if (index > -1) {
            user.friends.splice(index, 1);
        }
        console.log(user.friends)
        user.save();
        res.sendStatus(200);
      } catch (error) {
        console.log(error);
        res.sendStatus(500);
      }
});

app.listen(3000, () => console.log('Server listening on port 3000!'));
