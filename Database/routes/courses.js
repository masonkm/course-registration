// Author: Kenneth Mason

const express = require("express");
const router = express.Router();
const data = require("../data");
const studentData = data.students;
const courseData = data.courses;

router.get("/:id", async (req, res) => {
  try {
    const course = await courseData.getCourseById(req.params.id);
    const studentList = await studentData.getAll();
    for(let student of studentList){
      if(course.author == student._id){
        course.author = {
          _id: student._id,
          name: student.name
        };
      }
    }
    res.status(200).json(course);
  } catch (e) {
    res.status(404).json({ error: "Course not found" });
  }
});

router.get("/", async (req, res) => {
  try {
    const courseList = await courseData.getAllCourses();
    const studentList = await studentData.getAll();
    for(let course of courseList){
      for(let student of studentList){
        if(course.author == student._id){
          course.author = {
            _id: student._id,
            name: student.name
          };
        }
      }
    }
    res.json(courseList);
  } catch (e) {
    res.status(400).json({ error: "get /course" });
  }
});

router.post("/", async (req, res) => {
  try{
      let info = req.body;
      let newCourse = await courseData.addCourse(info.courseID, info.term, info.courseTitle, info.courseName,
        info.credits, info.department, info.availableSeats, info.time, info.location, info.professor,
        info.prerequisite, info.corequisite, info.decription);
      res.status(200).json(newCourse);
  }
  catch (e) {
    res.status(400).json({ error: "get /post" });
  }
});

router.put("/:id", async (req, res) => {
  const updatedData = req.body;
  try {
    await courseData.getCourseById(req.params.id);
  } catch (e) {
    res.status(404).json({ error: "Course not found" });
  }

  try {
    let course = await courseData.getCourseById(req.params.id);
    let title;
    let content;
    let titleBool = updatedData.hasOwnProperty('newTitle');
    let contentBool = updatedData.hasOwnProperty('newContent');
    if(!titleBool){
      title = course.title;
    }else{
      title = updatedData.newTitle;
    }
    if(!contentBool){
      content = course.content;
    }else{
      content = updatedData.newContent;
    }
    course.newTitle = title;
    course.newContent = content;
    let newCourse = await courseData.updateCourse(req.params.id, course);
    const studentList = await studentData.getAll();
    for(let student of studentList){
      if(newCourse.author == student._id){
        newCourse.author = {
          _id: student._id,
          name: student.name
        };
      }
    }
    res.status(200).json(newCourse);
  } catch (e) {
    res.status(400).json({ error: "put course" });
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
    const studentList = await studentData.getAll();
    for(let student of studentList){
      if(course.author == student._id){
        course.author = {
          _id: student._id,
          name: student.name
        };
      }
    }
    await courseData.removeCourse(req.params.id);
    const deletedCourse = {
      deleted: true,
      data: course
    };
    res.json(deletedCourse);
  } catch (e) {
    res.status(400).json({ error: "delete course" });
  }
});

module.exports = router;
