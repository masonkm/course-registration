// Author: Kenneth Mason

const mongoCollections = require("./mongoCollections");
const courses = mongoCollections.courses;
const students = require("./students");
const uuid = require("node-uuid");

const getAllCourses = async(id) => {
  const courseCollection = await courses();
  return await courseCollection.find({}).toArray();
};

const getCourseById = async(id)=> {
  const courseCollection = await courses();
  const course = await courseCollection.findOne({ _id: id });
  if (!course) throw "course not found";
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
  if (!comment.poster.name) throw "You must provide the posting student's name";
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

module.exports = {
  getAllCourses,
  getCourseById,
  addCourse,
  removeCourse,
  updateCourse,
  addComment,
  removeComment
};
