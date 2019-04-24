// Author: Kenneth Mason

const express = require("express");
const router = express.Router();
const data = require("../data");
const studentData = data.students;
const courseData = data.courses;

router.get("/:id", async (req, res) => {
  try {
    const student = await studentData.get(req.params.id);
    res.status(200).json(student);
  } catch (e) {
    res.status(404).json({ error: "Student not found" });
  }
});

router.get("/", async (req, res) => {
  try {
    const studentList = await studentData.getAll();
    res.json(studentList);
  } catch (e) {
    res.status(400).json({ error: "get /student" });
  }
});

router.post("/", async (req, res) => {
  /* new students added by post request in the JSON form
    {
    	"userName": "testUser",
    	"hashedPass": "testPass",
    	"profile": {
    	    "lastName": "testLast",
    	    "firstName": "testFirst",
    	    "studentId": 12345678,
    	    "year": 2,
    	    "credits": 0
    	}
    }
  */
  try {
    const sData = req.body;
    const newStudent = await studentData.create(sData.userName, sData.hashedPass, sData.profile.lastName, sData.profile.firstName,
      sData.profile.studentId, sData.profile.year, sData.profile.credits);
    res.status(200).json(newStudent);
  } catch (e) {
    res.status(400).json({ error: "post /student" });
  }
});

router.put("/:id", async (req, res) => {
  /*
  students updated by post request in the JSON form
    {
    	"newUser": "testUser",
    	"newPwd": "testPass",
    	"newYear": 3,
    	"newCredits": 12,
    	"newFinished": ["CS115", "CS146"],
    	"newCurrent": ["CS334", "CS546"],
    	"newHolds": true
    }

    This is a long function and kind of ugly, but the way I did it allows us to submit only the
    information we want to update, so we don't have to fill out an entire form of updated
    information every time we wish to update a student.
    Ex)
      {
        "newUser": "testUser",
        "newPwd": "testPass"
      }
      and
      {
      	"newYear": 3,
      	"newCredits": 12,
      	"newFinished": ["CS115", "CS146"],
      	"newCurrent": ["CS334", "CS546"]
      }
      both work fine.
  */
  const uData = req.body;
  try {
    await studentData.get(req.params.id);
  } catch (e) {
    res.status(404).json({ error: "student not found" });
  }

  try {
    const student = await studentData.get(req.params.id);
    let user, pwd, year, cred, fin, curr, holds;
    let userBool = uData.hasOwnProperty('newUser');
    let pwdBool = uData.hasOwnProperty('newPwd');
    let yearBool = uData.hasOwnProperty('newYear');
    let credBool = uData.hasOwnProperty('newCredits');
    let finBool = uData.hasOwnProperty('newFinished');
    let currBool = uData.hasOwnProperty('newCurrent');
    let holdBool = uData.hasOwnProperty('newHolds');
    if(!userBool){
      user = student.userName;
    }else{
      user = uData.newUser;
    }if(!pwdBool){
      pwd = student.hashedPass;
    }else{
      pwd = uData.newPwd;
    }if(!yearBool){
      year = student.profile.year;
    }else{
      year = uData.newYear;
    }if(!credBool){
      cred = student.profile.credits;
    }else{
      cred = uData.newCredits;
    }if(!finBool){
      fin = student.profile.finishedCourses;
    }else{
      fin = uData.newFinished;
    }if(!currBool){
      curr = student.profile.currentCourses;
    }else{
      curr = uData.newCurrent;
    }if(!holdBool){
      holds = student.profile.holds;
    }else{
      holds = uData.newHolds;
    }
    res.status(200).json(await studentData.update(req.params.id, user, pwd, year, cred, fin, curr, holds));
  } catch (e) {
    res.status(400).json({ error: "put student" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await studentData.get(req.params.id);
  } catch (e) {
    res.status(404).json({ error: "student not found" });
  }
  try {
    let student = await studentData.get(req.params.id);
    await studentData.remove(req.params.id);
    const deletedStudent = {
      deleted: true,
      data: student
    };
    res.json(deletedStudent);
  } catch (e) {
    res.status(400).json({ error: "delete student" });
  }
});

module.exports = router;
