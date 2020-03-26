const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true });


//Routes

// Update just one note by an id
app.post("/api/workouts/id", function(req, res) {
    // When searching by an id, the id needs to be passed in
    // as (mongojs.ObjectId(IDYOUWANTTOFIND))
    console.log(req.body);
    // Update the note that matches the object id
    db.Workout.update(
      {
        _id: mongojs.ObjectId(req.params.id)
      },
      {
        // Set the title, note and modified parameters
        // sent in the req's body.
        
        $push: {
          exercise: req.body,
          modified: Date.now()
        }
      },
      function(error, edited) {
        // Log any errors from mongojs
        if (error) {
          console.log(error);
          res.send(error);
        }
        else {
          // Otherwise, send the mongojs response to the browser
          // This will fire off the success function of the ajax request
          console.log(edited);
          res.send(edited);
        }
      }
    );
  });

app.get("/api/workouts", (req, res) => {
    db.Workout.find({})
      //.sort({ date: -1 })
      .then(dbWorkout => {
        res.json(dbWorkout);
      })
      .catch(err => {
        res.status(400).json(err);
      });
  });
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/exercise", (req, res) => {
    res.sendFile(path.join(__dirname, "public/exercise.html"));
});

app.get("/workout", (req, res) => {
    res.sendFile(path.join(__dirname, "public/workout.html"));
});

app.get("/stats", (req, res) => {
    res.sendFile(path.join(__dirname, "public/stats.html"));
});


// Start the server
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
});
