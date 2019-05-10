// Author: Kenneth Mason

const express = require("express");
const router = express.Router();
const data = require("../data");
const studentData = data.students;
const courseData = data.courses;

// router.get("/:id", async (req, res) => {
//   try {
//     const course = await courseData.getCourseById(req.params.id);
//     res.status(200).json(course);
//   } catch (e) {
//     res.status(404).json({ error: "Course not found" });
//   }
// });

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

// JG add routes
// Registration router
router.get("/registration", async (req,res) =>{
  try{
    const loginUser = req.session.user; // no update, cannot use directly
    const user = await studentData.getByUserName(loginUser.username);
    //console.log(user);
    const registeredCourses = user.profile.registeredCourses;
    let registeredCoursesList = [];
    for(let i = 0; i<registeredCourses.length; i++){
      let temp = await courseData.getCourseByCourseTitle(registeredCourses[i]);
      registeredCoursesList.push(temp);
    }
    //console.log(registeredCoursesList);
    let booDrop = true;
    if(registeredCoursesList.length === 0){
      booDrop = false;
    }
    res.render("users/registration",{registeredCoursesList:registeredCoursesList,booDrop: booDrop});
  }catch(e){
    res.status(400).json({error: e});
  }
});

router.post("/registration/search",async(req,res) =>{
  let inputData = req.body;
  //console.log(inputData);
  let errors = "";

  if(!inputData.courseID){
    errors = "No courseID provided";
  }

  if(errors.length > 0){
    res.render("users/error",{errors:errors});
  }
  else{
    try{
      //console.log("enter try successfully");
      const course = await courseData.getCourseByCourseID(inputData.courseID);
      //console.log(course);
      req.session.course = course;
      let boo = true;
      if(course === null){
        boo = false;
      }
      res.render("users/search",{course : course, boo: boo, courseID: inputData.courseID});
    }catch(e){
      //console.log("error happened"); 
      res.status(500).json({error:e});
    }
  }
});

router.get("/registration/comment/:id", async (req, res) => {
  try {
    //console.log("enter comment router function successfully");
    const course = await courseData.getCourseById(req.params.id);
    //  console.log("in router the course is:");
    //console.log(course);
    let hasComment = false;
    if(course.comments.length !== 0){
      hasComment = true;
    }
    //res.status(200).json(course.comments);
    res.render("users/comment",{comments: course.comments, id: course._id, courseName: course.courseName, hasComment: hasComment});
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

// used for "back to course"
router.get("/registration/search/:id", async (req,res) =>{
  try {
        const course = await courseData.getCourseById(req.params.id);
        //console.log(course);
        //res.status(200).json(course);
        req.session.course = course; // Here is important!!!!!!!!
        // need req.session.course in router.post("/registration/search") too
        

        res.render("users/search",{course : course, boo: true, courseID: course.courseID});
      } catch (e) {
        res.status(404).json({ error: e });
      }
});

router.post("/registration/department", async (req,res) =>{
  let inputData = req.body;
  let errors = "";

  if(!inputData.department){
    errors = "No courseID provided";
  }

  if(errors.length > 0){
    res.render("users/error",{errors:errors});
  }
  else{
    try{
      //console.log("enter try successfully");
      const courseList = await courseData.getCourseByDepartment(inputData.department);
      //console.log(courseList);
      let boo = true;
      if(courseList.length === 0){
        boo = false;
      }
      res.render("users/department",{courses: courseList,boo: boo, department: inputData.department});
    }catch(e){
      //console.log("error happened");
      res.status(500).json({error:e});
    }
  }
});

router.post("/registration/search/register", async (req,res) =>{
  const course = req.session.course;
  const user = req.session.user; 
  // !!!cannot use this user.profile in the following function
  // !!! because the user.profile is not updated since the user login
  // console.log("Inside the router function:")
  // console.log(course);
  // console.log(user);
  req.session.course = undefined; // delete session.course
  try{
    const newStudent = await courseData.checkRegistration(course,user.username);
    //res.redirect("/mainPage");
    const hasError = false;
    res.render("users/register_result",{hasError: hasError});
  }catch(e){
    const hasError = true;
    res.render("users/register_result",{hasError:hasError,error:e});
  }
  
  
});

//registration/drop part

router.get("/registration/drop/:id", async (req,res) =>{
  try{
    const course = await courseData.getCourseById(req.params.id);
    res.render("users/drop",{course:course});
  }catch(e){
    res.status(500).json({error:e});
  }
  // try{
  //   const loginUser = req.session.user;
  //   //console.log(loginUser);
  //   //console.log(req.params.id);
  //   const course = await courseData.getCourseById(req.params.id);
  //   console.log(course);
  //   //console.log(course.courseTitle);
  //   const newStudent = await studentData.dropRegisteredCourses(loginUser.username,course.courseTitle);
  //   console.log(newStudent);
  //   const newCourse = await courseData.addOrMinusSeatByCourseID(course.courseID,1); // +1 seat
  //   console.log(newCourse);
  // }catch(e){
  //   res.status(500).json({error:e});
  // }
});

router.get("/registration/drop/yes/:id", async (req,res) =>{
  try{
    const loginUser = req.session.user;
    //console.log(loginUser);
    //console.log(req.params.id);
    const course = await courseData.getCourseById(req.params.id);
    //console.log(course);
    //console.log(course.courseTitle);
    const newStudent = await studentData.dropRegisteredCourses(loginUser.username,course.courseTitle);
    //console.log(newStudent);
    const newCourse = await courseData.addOrMinusSeatByCourseID(course.courseID,1); // +1 seat
    //console.log(newCourse);
    const hasError = false;
    res.render("users/drop_result",{hasError:hasError});
  }catch(e){
    const hasError = true;
    res.render("users/drop_result",{hasError:hasError,error:e});
  }
});






// Rating router











router.get("/rating", async(req,res) =>{
  const user = req.session.user;
  //console.log(user);
  const courseTitleList = user.profile.finishedCourses;
  //console.log(courseTitleList);
  let finishedCoursesList = [];
  try{
    for(let i =0; i<courseTitleList.length; i++){
      let curCourse = await courseData.getCourseByCourseTitle(courseTitleList[i]);
      finishedCoursesList.push(curCourse);
    };
    //console.log(finishedCoursesList);
    //console.log(finishedCoursesList);
    let hasFinishedCourse = true;
    if(finishedCoursesList.length === 0){
      hasFinishedCourse = false;
    }
    res.render("users/rating",{student: user.profile, finishedCourses: finishedCoursesList, hasFinishedCourse: hasFinishedCourse});
  }catch(e){
    //console.log("sadfadsfadsf");
    res.status(500).json({error:e});
  }
});

router.get("/rating/details/:id", async (req,res) =>{
  try{
    //console.log("enter router details");
    const course = await courseData.getCourseById(req.params.id);
    const user = req.session.user;
    // console.log(course);
    // console.log(user);
    const comment = await courseData.getCommentForCourseByUsername(course.courseID,user.username);
    //console.log("comment is " + comment);
    let hasComment = true;
    if(!comment){
      //console.log("enter if");
      hasComment = false;
    }
    //console.log(hasComment);
    res.render("users/details",{hasComment: hasComment,comment:comment,id:course._id});
  }catch(e){
    res.status(500).json({error:e});
  }
});

//make a new comment for course id
router.get("/rating/newComment/:id", async (req,res) =>{
  try{
    const course = await courseData.getCourseById(req.params.id);
    req.session.course = course;
  //console.log(course);
  // we also need poster ID which may be known by middleware!!!!!!!
  //Here , we assume poster is gjc921019
  //const student = await studentData.get("9168b669-412c-43a9-9856-4bc5d5266632");
  //console.log(student);
    res.render("users/newComment");
  }catch(e){
    res.status(500).json({error:e});
  }
});

router.post("/rating/newComment/post", async (req,res) =>{
  let inputData = req.body;
  //console.log(inputData);
  let comment = inputData.comment;
  //console.log(comment);
  let rateInt = parseInt(inputData.rating);
  //console.log(rateInt);
  const user = req.session.user;
  const course = req.session.course;
  req.session.course = undefined; // delete session.course
  //console.log(course);
  // let comment = {
  //   poster: {
  //     id:user.profile._id,
  //     username:user.username,
  //     studentId:user.profile.studentId
  //   },
  //   comment: inputData.content,
  //   rate: rateInt
  // };
  //console.log(comment);
  try{
    //const course = await courseData.getCourseById(inputData.course_id);
    //console.log(course);
    //let avgRateInt = parseInt(course.avgRating);
    // if(typeof(avgRateInt) === "number"){
    //   console.log(avgRateInt);
    // }
    //await courseData.addComment(inputData.course_id,comment,avgRateInt);
    await courseData.addCommentByCourseID(course.courseID,user.username,comment,rateInt);
    const newCourse = await courseData.updateAvgRatingByCourseID(course.courseID);
    //console.log(newCourse);
    const hasError = false;
    res.render("users/rating_result",{hasError:hasError,operation: "Create"});
  }catch(e){
    const hasError = true;
    res.render("users/rating_result",{hasError:hasError,error:e});
  }
});

// change a previous comment for course id
router.get("/rating/changeComment/:id", async (req,res) =>{
  try{
    const course = await courseData.getCourseById(req.params.id);
    req.session.course = course;
    res.render("users/changeComment");
  }catch(e){
    res.status(500).json({error:e});
  } 
});

router.post("/rating/changeComment/post", async (req,res) =>{
  let inputData = req.body;
  //console.log(inputData);
  let comment = inputData.comment;
  //console.log(comment);
  let rateInt = parseInt(inputData.rating);
  //console.log(rateInt);
  const user = req.session.user;
  const course = req.session.course;
  req.session.course = undefined; // delete session.course
  //console.log(course);
  // let comment = {
  //   poster: {
  //     id:user.profile._id,
  //     username:user.username,
  //     studentId:user.profile.studentId
  //   },
  //   comment: inputData.content,
  //   rate: rateInt
  // };
  //console.log(comment);
  try{
    //const course = await courseData.getCourseById(inputData.course_id);
    //console.log(course);
    //let avgRateInt = parseInt(course.avgRating);
    // if(typeof(avgRateInt) === "number"){
    //   console.log(avgRateInt);
    // }
    //await courseData.addComment(inputData.course_id,comment,avgRateInt);
    await courseData.changeCommentByCourseID(course.courseID,user.username,comment,rateInt);
    const newCourse = await courseData.updateAvgRatingByCourseID(course.courseID);
    // console.log("newCourse is:");
    // console.log(newCourse);
    const hasError = false;
    res.render("users/rating_result",{hasError:hasError,operation: "Change"});
  }catch(e){
    const hasError = true;
    res.render("users/rating_result",{hasError:hasError,error:e});
  }
});

// delete a comment for course id
router.get("/rating/deleteComment/:id", async (req,res) =>{
  try{
    const course = await courseData.getCourseById(req.params.id);
    const user = req.session.user;
    await courseData.deleteCommentByCourseID(course.courseID,user.username);
    const newCourse = await courseData.updateAvgRatingByCourseID(course.courseID);
    // console.log("newCourse is:");
    // console.log(newCourse);
    const hasError = false;
    res.render("users/rating_result",{hasError:hasError,operation: "Delete"});
  }catch(e){
    const hasError = true;
    res.render("users/rating_result",{hasError:hasError,error:e});
  } 
});





module.exports = router;
