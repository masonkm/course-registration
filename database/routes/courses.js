// Author: Kenneth Mason

const express = require("express");
const router = express.Router();
const data = require("../data");
const studentData = data.students;
const courseData = data.courses;

router.get("/:id", async (req, res) => {
  try {
    const course = await courseData.getCourseById(req.params.id);
    res.status(200).json(course);
  } catch (e) {
    res.status(404).json({ error: "Course not found" });
  }
});

router.get("/", async (req, res) => {
  try {
    const courseList = await courseData.getAllCourses();
    res.json(courseList);
  } catch (e) {
    res.status(400).json({ error: "get /courses" });
  }
});

router.post("/", async (req, res) => {
  /*
  New courses can be added to the database by post request with the JSON format
    {
  	"courseID": 10581,
  	"term": "19F",
      "courseTitle": "CS546",
      "courseName": "Web Programming",
      "credits": 3,
      "department": "Computer Science",
      "availableSeats": 50,
      "time": "W 6:30pm-9pm",
      "location": "NB105",
      "professor": "Patrick Hill",
      "prerequisite": ["CS146", "CS442"],
      "corequisite": [],
      "description": "This course will provide students with a first strong approach of internet programming."
    }
    The fields time, location, professor, prerequisite, corequisite, and description can be left empty and
    will be dealt with below.
  */

  try{
      let info = req.body;
      let time, location, professor, description, prereq, coreq;
      /*The following properties can be left empty when creating a
      course if data isn't known or decided upon yet.*/
      let timeBool = info.hasOwnProperty('time');
      let locBool = info.hasOwnProperty('location');
      let profBool = info.hasOwnProperty('professor');
      let descBool = info.hasOwnProperty('description');
      let preBool = info.hasOwnProperty('prerequisite');
      let coBool = info.hasOwnProperty('corequisite');
      if(!timeBool){
        time = "TBD";
      }else{
        time = info.time;
      }if(!locBool){
        location = "TBD";
      }else{
        location = info.location;
      }if(!profBool){
        professor = "TBD";
      }else{
        professor = info.professor;
      }if(!descBool){
        description = "No description to show";
      }else{
        description = info.description;
      }if(!preBool){
        prereq = [];
      }else{
        prereq = info.prerequisite;
      }if(!coBool){
        coreq = [];
      }else{
        coreq = info.corequisite;
      }

      let newCourse = await courseData.addCourse(info.courseID, info.term, info.courseTitle, info.courseName,
        info.credits, info.department, info.availableSeats, time, location, professor,
        prereq, coreq, description);
      res.status(200).json(newCourse);
  }
  catch (e) {
    res.status(400).json({ error: "post /courses" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    await courseData.getCourseById(req.params.id);
  } catch (e) {
    res.status(404).json({ error: "Course not found" });
  }

  try {
    let info = req.body;
    let time, location, professor, description, prereq, coreq;
    let timeBool = info.hasOwnProperty('time');
    let locBool = info.hasOwnProperty('location');
    let profBool = info.hasOwnProperty('professor');
    let descBool = info.hasOwnProperty('description');
    let preBool = info.hasOwnProperty('prerequisite');
    let coBool = info.hasOwnProperty('corequisite');
    if(!timeBool){
      time = "TBD";
    }else{
      time = info.time;
    }if(!locBool){
      location = "TBD";
    }else{
      location = info.location;
    }if(!profBool){
      professor = "TBD";
    }else{
      professor = info.professor;
    }if(!descBool){
      description = "No description to show";
    }else{
      description = info.description;
    }if(!preBool){
      prereq = [];
    }else{
      prereq = info.prerequisite;
    }if(!coBool){
      coreq = [];
    }else{
      coreq = info.corequisite;
    }


    res.status(200).json(newCourse);
  } catch (e) {
    res.status(400).json({ error: "put /courses" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await courseData.getCourseById(req.params.id);
  } catch (e) {
    res.status(404).json({ error: "Course not found" });
  }
  try {
    let course = await courseData.getCourseById(req.params.id);
    await courseData.removeCourse(req.params.id);
    const deletedCourse = {
      deleted: true,
      data: course
    };
    res.json(deletedCourse);
  } catch (e) {
    res.status(400).json({ error: "delete /courses" });
  }
});

router.get("/comment/:id", async (req, res) => {
  try {
    const course = await courseData.getCourseById(req.params.id);
    res.status(200).json(course.comments);
  } catch (e) {
    res.status(404).json({ error: "Course not found" });
  }
});

router.put("/comment/:id", async (req, res) => {
  /* Comments should be added in the JSON form
      {
          "poster":{
              "id": "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310",
              "name": "Jiacheng Guo",
              "studentId": 10442082
          },
          "comment": "This class is super useful",
          "rate": 5
      }
     avgRating automatically calculated.
     Comment ID created in data/courses
  */

  try {
    await courseData.getCourseById(req.params.id);
  } catch (e) {
    res.status(404).json({ error: "Course not found" });
  }

  try {
    let info = req.body;
    const course = await courseData.getCourseById(req.params.id);
    let rateCounter = 0;
    let rates = [];
    for(let comment of course.comments){
      rates.push(comment.rate);
      rateCounter += 1;
    }
    rates.push(info.rate);
    rateCounter += 1;
    const sum = rates.reduce((a, b) => {
      return a + b;
    });
    const avgRating = sum / rateCounter;
    const updatedCourse = await courseData.addComment(req.params.id, info, avgRating);
    res.status(200).json(updatedCourse);
  } catch (e) {
    res.status(400).json({ error: "put /comment" });
  }
});

router.delete("/comment/:id/:comId", async (req, res) => {
  try {
    await courseData.getCourseById(req.params.id);
  } catch (e) {
    res.status(404).json({ error: "Course not found" });
  }

  try {
    const course = await courseData.getCourseById(req.params.id);
    let rateCounter = 0;
    let rates = [];
    let newComments = [];
    for(let comment of course.comments){
      if(comment._id != req.params.comId){
        newComments.push(comment);
        rates.push(comment.rate);
        rateCounter += 1;
      }
    }
    const sum = rates.reduce((a, b) => {
      return a + b;
    });
    const avgRating = sum / rateCounter;
    const updatedCourse = await courseData.removeComment(req.params.id, newComments, avgRating);
    res.status(200).json(updatedCourse);
  } catch (e) {
    res.status(400).json({ error: "delete /comment" });
  }
});

module.exports = router;
