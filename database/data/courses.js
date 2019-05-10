// Author: Kenneth Mason

const mongoCollections = require("./mongoCollections");
const courses = mongoCollections.courses;
const students = require("./students");
const uuid = require("node-uuid");

const getAllCourses = async() => {
  const courseCollection = await courses();
  return await courseCollection.find({}).toArray();
};

const getCourseById = async(id)=> {
  //  console.log("enter getCourseById");
  //  console.log(id);
  if(!id) throw "You must provide a _id";
  const courseCollection = await courses();
  const course = await courseCollection.findOne({ _id: id });
  //console.log(course);
  if (!course){
    throw "course not found";
  } 
  return course;
};

const addCourse = async(cid, term, title, name, credits, dept, seats, time, location, prof, prereq, coreq, description)=> {
  if (!cid || typeof(cid) !== "number") throw "You must provide a course ID";
  if (!title || typeof(title) !== "string") throw "You must provide a title";
  if (!term || typeof(term) !== "string") throw "You must provide a term";
  if (!name || typeof(name) !== "string") throw "You must provide a name";
  if (!dept || typeof(dept) !== "string") throw "You must provide a department";
  if (!time || typeof(time) !== "string") throw "You must provide a time";
  if (!location || typeof(location) !== "string") throw "You must provide a location";
  if (!prof || typeof(prof) !== "string") throw "You must provide the professor";
  if(credits !== 0){
    if (!credits || typeof(credits) !== "number") throw "You must provide number of completed credits";
  }
  if(seats !== 0){
    if (!seats || typeof(seats) !== "number") throw "You must provide number of available seats";
  }
  if (!prereq || !Array.isArray(prereq)) throw "You must provide an array of prerequisites";
  if (!coreq || !Array.isArray(coreq)) throw "You must provide an array of corequisites";
  if (!description || typeof(description) !== "string") throw "You must provide a decription";

  const courseCollection = await courses();
  const newCourse = {
    _id: uuid.v4(),
    courseID: cid,
    term: term,
    courseTitle: title,
    courseName: name,
    credits: credits,
    department: dept,
    availableSeats: seats,
    time: time,
    location: location,
    professor: prof,
    prerequisite: prereq,
    corequisite: coreq,
    description: description,
    comments: [],
    avgRating : null
  };

  const newInsertInformation = await courseCollection.insertOne(newCourse);
  const newId = newInsertInformation.insertedId;
  return await getCourseById(newId);
};

const removeCourse = async(id) => {
  const courseCollection = await courses();
  const deletionInfo = await courseCollection.removeOne({ _id: id });
  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete course with id of ${id}`;
  }
};

const updateCourse = async(id, term, seats, time, location, prof, prereq, coreq, description, avgRating) => {
  if (!term || typeof(term) !== "string") throw "You must provide a term";
  if (!time || typeof(time) !== "string") throw "You must provide a time";
  if (!location || typeof(location) !== "string") throw "You must provide a location";
  if (!prof || typeof(prof) !== "string") throw "You must provide the professor";
  if(seats !== 0){
    if (!seats || typeof(seats) !== "number") throw "You must provide number of available seats";
  }
  if (!prereq || !Array.isArray(prereq)) throw "You must provide an array of prerequisites";
  if (!coreq || !Array.isArray(coreq)) throw "You must provide an array of corequisites";
  if (!description || typeof(description) !== "string") throw "You must provide a decription";
  if(avgRating !== 0){
    if (!avgRating || typeof(avgRating) !== "number") throw "You must provide number as a rating";
  }

  const courseCollection = await courses();
  let course = await getCourseById(id);
  const newCourse = {
    _id: uuid.v4(),
    courseID: cid,
    term: term,
    courseTitle: title,
    courseName: name,
    credits: credits,
    department: dept,
    availableSeats: seats,
    time: time,
    location: location,
    professor: prof,
    prerequisite: prereq,
    corequisite: coreq,
    description: description,
    comments: course.comments,
    avgRating : avgRating
  };

  const updatedInfo = await courseCollection.replaceOne({ _id: id }, newCourse);
  if (updatedInfo.modifiedCount === 0) {
    console.log("No updates");
  }
  return await getCourseById(id);
};

const addComment = async(id, comment, avgRating) => {
  if (!comment.poster) throw "You must provide the posting student";
  if (!comment.poster.id) throw "You must provide the posting student's id";
  if (!comment.poster.username) throw "You must provide the posting student's username";
  if (!comment.poster.studentId) throw "You must provide the posting student's student ID";
  if (!comment.comment || typeof(comment.comment) !== "string") throw "You must provide a comment";
  if(comment.rate !== 0){
    if (!comment.rate || typeof(comment.rate) !== "number") throw "You must provide a rating";
  }
  if(avgRating !== 0){
    if (!avgRating || typeof(avgRating) !== "number") throw "You must provide number as a rating";
  }
  const courseCollection = await courses();
  let course = await getCourseById(id);
  const commentId = uuid.v4();
  comment._id = commentId;
  course.comments.push(comment);
  course.avgRating = avgRating;

  const updatedInfo = await courseCollection.replaceOne({ _id: id }, course);
  if (updatedInfo.modifiedCount === 0) {
    console.log("No updates");
  }
  return await getCourseById(id);
};

const removeComment = async(id, newComments, avgRating) => {
  if (!newComments || !Array.isArray(newComments)) throw "You must provide an array of comments";
  if(avgRating !== 0){
    if (!avgRating || typeof(avgRating) !== "number") throw "You must provide number as a rating";
  }
  const courseCollection = await courses();
  let course = await getCourseById(id);
  course.comments = newComments;
  course.avgRating = avgRating;

  const updatedInfo = await courseCollection.replaceOne({ _id: id }, course);
  if (updatedInfo.modifiedCount === 0) {
    console.log("No updates");
  }
  return await getCourseById(id);
};

//added by JG
async function getCourseByCourseID(ID){
  //console.log("enter function successfully");
  //console.log("id is " + ID);
  if(ID === undefined){
    throw "Input is empty";
  }
  if(typeof(ID) !== "string" ) {
    throw "Input is not a string";
  }

  for(let i = 0; i<ID.length; i++){
      if(ID.charAt(i)!="0" &&
      ID.charAt(i)!="1" &&
      ID.charAt(i)!="2" &&
      ID.charAt(i)!="3" &&
      ID.charAt(i)!="4" &&
      ID.charAt(i)!="5" &&
      ID.charAt(i)!="6" &&
      ID.charAt(i)!="7" &&
      ID.charAt(i)!="8" &&
      ID.charAt(i)!="9"){
          throw "Input is illegal"
      }
  }

  let ID_num = parseInt(ID);
  let coursesData = await getAllCourses();

  for (let i =0; i< coursesData.length; i++){
    if(coursesData[i].courseID === ID_num){
      return coursesData[i];
    }
  }
  return null;
};

async function getCourseByDepartment(dep){
  //console.log("enter GCBD successfully");
  if(dep === undefined){
    throw "Input is empty";
  }
  if(typeof(dep) !== "string" ) {
    throw "Input is not a string";
  }

  let coursesData = await getAllCourses();

  let courseList = [];

  for (let i =0; i< coursesData.length; i++){
    if(coursesData[i].department == dep){
      courseList.push(coursesData[i]);
    }
  }
  return courseList;
};

async function getCourseByCourseTitle(title){
  if(title === undefined){
    throw "Input is empty";
  }
  if(typeof(title) !== "string" ) {
    throw "Input is not a string";
  }
  let coursesData = await getAllCourses();

  for (let i =0; i< coursesData.length; i++){
    if(coursesData[i].courseTitle == title){
      return coursesData[i];
    }
  }
  return null;

};

async function checkRegistration(course,username){
  if(!course) throw "req.session.course is null";
  if(!username) throw "req.session.user.username is null";

  const user = await students.getByUserName(username);
  // console.log("Inside of data function:");
  //console.log(user);

  const finishedCourse = user.profile.finishedCourses;
  const currentCourse = user.profile.currentCourses;
  const registeredCourse = user.profile.registeredCourses;
  //console.log(registeredCourse);
  const prerequisite = course.prerequisite;
  let neededCourse = [];
  // check whether the student has already learned this course
  for(let i = 0; i<finishedCourse.length; i++){
    if(course.courseTitle === finishedCourse[i]){
      throw "You have already finished this course";
    }
  }
  // check whether the student is enrolled in this course now
  for(let i = 0; i<currentCourse.length; i++){
    if(course.courseTitle === currentCourse[i]){
      throw "You are enrolled in this course in the current term";
    }
  }
  // check whether the student has registered the course 
  for(let i = 0; i<registeredCourse.length; i++){
    if(course.courseTitle === registeredCourse[i]){
      throw "You have already registered the course in next term";
    }
  }
  // check the prerequisite
  for(let i = 0; i<prerequisite.length; i++){
    let boo = false;
    for(let j = 0; j<finishedCourse.length; j++){
      if(finishedCourse[j] === prerequisite[i]){
        boo = true;
        break;
      }
    }
    for(let k = 0; k<currentCourse.length; k++){
      if(currentCourse[k] === prerequisite[i]){
        boo = true;
        break;
      }
    }
    if(!boo){
      neededCourse.push(prerequisite[i]);
    }
  }
  //console.log("needed is: "+neededCourse);
  if(neededCourse.length === 0){ 
    // pass prerequisite test
    const courseList = course.corequisite;
    courseList.push(course.courseTitle); // put all corequisite together
    //console.log("CourseList is " + courseList);
    // check student's data correction, in case somehow he has cs570 but no cs571
    for(let i = 0; i< courseList.length; i++){
      // finished course
      for(let j = 0; j<finishedCourse.length; j++){
        if(courseList[i]===finishedCourse[j]){
          throw "error in student's seed data (corequisite,finished)";
        }
      }
      //current course
      for(let k = 0; k<currentCourse.length; k++){
        if(courseList[i]===currentCourse[k]){
          throw "error in student's seed data (corequisite,current)";
        }
      }
      //registered course
      for(let l = 0; l<registeredCourse.length; l++){
        if(courseList[i]===registeredCourse[l]){
          throw "error in student's seed data (corequisite,registered)";
        }
      }
    }

    //check availabe seat for all courses in courseList
    for(let i = 0; i<courseList.length; i++){
      const courseGo = await getCourseByCourseTitle(courseList[i]);
      if(courseGo.availableSeats === 0){
        throw "No available seat for " + courseList[i];
      }
    }
    //register all courses in courseList
    for(let i = 0; i<courseList.length; i++){
      const courseGo = await getCourseByCourseTitle(courseList[i]);
      await students.addRegisteredCourses(username,courseList[i]);
      await addOrMinusSeatByCourseID(courseGo.courseID,-1);// minus seat
    }
    const newStudent = await students.getByUserName(username);
    return newStudent;
    //console.log(newStudent);
  }
  else{ // do not pass prerequisite test
    //console.log("Enter do not pass prerequisite");
    throw "missing prerequisite course " + neededCourse;
  }
};

const addOrMinusSeatByCourseID = async (courseID,value) =>{
  if(!courseID) throw "You must provide a courseID";
  if(!value) throw "You must provide a value";

  if(typeof(courseID)!=="number"){
    throw "courseID is not a number";
  }

  if(typeof(value)!=="number"){
    throw "value is not a number";
  }

  const courseCollection = await courses();

  // input has to be string for getCourseByCourseID function
  const targetCourse = await getCourseByCourseID(courseID.toString());
  // console.log("targetStudent is :")
  // console.log(targetStudent);
  let originalSeat = targetCourse.availableSeats;
  let newSeat = originalSeat+value;
  await courseCollection.updateOne({courseID: courseID},{$set: { availableSeats: newSeat }});
  return await getCourseByCourseID(courseID.toString());
};

async function addCommentByCourseID(courseID,username,comment,rate){
  if(!courseID) throw "You must provide a courseID";
  if(!username) throw "You must provide a username";
  if(!comment) throw "You must provide a comment";
  if(!rate) throw "You must provide a rating";


  if(typeof(courseID)!=="number"){
    throw "Input courseID is not a number";
  }

  if(typeof(username)!=="string"){
    throw "username is not a string";
  }

  if(typeof(comment)!=="string"){
    throw "comment is not a string";
  }

  if(typeof(rate)!=="number"){
    throw "rate is not a number";
  }

  let newComment = {
    poster: username,
    comment: comment,
    rate: rate
  }

  const courseCollection = await courses();

  // input has to be string for getCourseByCourseID function
  const targetCourse = await getCourseByCourseID(courseID.toString());
  // console.log("targetStudent is :")
  // console.log(targetStudent);
  let commentsList = targetCourse.comments;
  commentsList.push(newComment);
  await courseCollection.updateOne({courseID: courseID},{$set: { comments: commentsList }});
  
  return await getCourseByCourseID(courseID.toString());

};

async function changeCommentByCourseID(courseID,username,comment,rate){
  if(!courseID) throw "You must provide a courseID";
  if(!username) throw "You must provide a username";
  if(!comment) throw "You must provide a comment";
  if(!rate) throw "You must provide a rating";


  if(typeof(courseID)!=="number"){
    throw "Input courseID is not a number";
  }

  if(typeof(username)!=="string"){
    throw "username is not a string";
  }

  if(typeof(comment)!=="string"){
    throw "comment is not a string";
  }

  if(typeof(rate)!=="number"){
    throw "rate is not a number";
  }

  let newComment = {
    poster: username,
    comment: comment,
    rate: rate
  }

  const courseCollection = await courses();

  // input has to be string for getCourseByCourseID function
  const targetCourse = await getCourseByCourseID(courseID.toString());
  // console.log("targetStudent is :")
  // console.log(targetStudent);
  let commentsList = targetCourse.comments;
  // find the comment which is to be changed
  for(let i = 0; i< commentsList.length; i++){
    if(commentsList[i].poster === username){
      // console.log("old comment is:");
      // console.log(commentsList[i]);
      commentsList[i] = newComment;
    }
  }
  await courseCollection.updateOne({courseID: courseID},{$set: { comments: commentsList }});
  
  return await getCourseByCourseID(courseID.toString());
};

async function deleteCommentByCourseID(courseID,username){
  if(!courseID) throw "You must provide a courseID";
  if(!username) throw "You must provide a username";

  if(typeof(courseID)!=="number"){
    throw "Input courseID is not a number";
  }

  if(typeof(username)!=="string"){
    throw "username is not a string";
  }

  const courseCollection = await courses();

  // input has to be string for getCourseByCourseID function
  const targetCourse = await getCourseByCourseID(courseID.toString());
  // console.log("targetStudent is :")
  // console.log(targetStudent);
  let commentsList = targetCourse.comments;
  let newCommentsList = [];
  // find the comment which is to be changed
  for(let i = 0; i< commentsList.length; i++){
    if(commentsList[i].poster !== username){
      newCommentsList.push(commentsList[i]);
    }
  }
  await courseCollection.updateOne({courseID: courseID},{$set: { comments: newCommentsList }});
  
  return await getCourseByCourseID(courseID.toString());
};


async function updateAvgRatingByCourseID(courseID){
  if(!courseID) throw "You must provide a courseID";

  if(typeof(courseID)!=="number"){
    throw "Input courseID is not a number";
  }

  const courseCollection = await courses();

  const targetCourse = await getCourseByCourseID(courseID.toString());

  const commentsList = targetCourse.comments;

  if(commentsList.length === 0){
    await courseCollection.updateOne({courseID: courseID},{$set: { avgRating: null }});
  }
  else{
    let sum = 0;
    let count = 0;
    for(let i = 0; i<commentsList.length; i++){
      sum = sum+commentsList[i].rate;
      count++;
    }
    const avgRating = sum/count;
    await courseCollection.updateOne({courseID: courseID},{$set: { avgRating: avgRating }});
    return await getCourseByCourseID(courseID.toString());
  }

};

async function getCommentForCourseByUsername(courseID,username){
  if(!courseID) throw "You must provide a courseID";
  if(!username) throw "You must provide a username";

  if(typeof(courseID) !=="number"){
    throw "Input courseID is not a number";
  }
  if(typeof(username) !=="string"){
    throw "Input username is not a string";
  }

  const course = await getCourseByCourseID(courseID.toString());

  const commentsList = course.comments;
  for (let i =0; i<commentsList.length; i++){
    if(commentsList[i].poster === username){
      return commentsList[i]; // we assume everyone could only make one comment for a specific course
    }
  }
  return null;
};






module.exports = {
  getAllCourses,
  getCourseById,
  addCourse,
  removeCourse,
  updateCourse,
  addComment,
  removeComment,
  getCourseByCourseID,
  getCourseByDepartment,
  getCourseByCourseTitle,
  checkRegistration,
  addOrMinusSeatByCourseID,
  addCommentByCourseID,
  changeCommentByCourseID,
  deleteCommentByCourseID,
  updateAvgRatingByCourseID,
  getCommentForCourseByUsername
};
