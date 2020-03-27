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

app.put("/api/workouts/:id", (req, res) => {
    db.Workout.findByIdAndUpdate(
        req.params.id,
        { $push: { exercises: req.body } },
        { new: true, runValidators: true }
    )
        .then(dbWorkout => {
            res.json(dbWorkout);
        })
        .catch(err => {
            res.json(err);
        });
});

app.post("/api/workouts", function (req, res) {
    db.Workout.create({})
        .then(dbWorkout => {
            res.json(dbWorkout);
        })
        .catch(err => {
            res.json(err);
        });

});



app.get("/api/workouts", (req, res) => {
    console.log("get api/workouts")
    db.Workout.find({})
        //.sort({ date: -1 })
        .then(dbWorkout => {
            //console.log(dbWorkout)

            let totalDuration = 0;
            //let workoutArr = [];

            let newDbWorkout = dbWorkout.map(workout => {
                let workoutCopy = {};

                workoutCopy.day = workout.day;
                workoutCopy.exercises = workout.exercises;

                workout.exercises.map(exercise => {
                    totalDuration += exercise.duration;

                });

                workoutCopy.totalDuration = totalDuration;

                console.log(workoutCopy)
                totalDuration = 0;
                return workoutCopy;
            });

            console.log(totalDuration);
            console.log(newDbWorkout)

            res.json(newDbWorkout);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

app.get("/api/workouts/range", (req, res) => {
    db.Workout.find({})
        .limit(7)
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
