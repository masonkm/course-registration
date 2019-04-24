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
  console.log("here");
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
  if (!decription || typeof(description) !== "string") throw "You must provide a decription";

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
    decription: description,
    comments: [],
    avgRating : NULL
  };
  const newInsertInformation = await courseCollection.insertOne(newCourse);
  const newId = newInsertInformation.insertedId;
  return await getcourseById(newId);
};

const removeCourse = async(id) => {
  const courseCollection = await courses();
  const deletionInfo = await courseCollection.removeOne({ _id: id });
  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete course with id of ${id}`;
  }
};

const updateCourse = async(id, updatedCourse) => {
  // TODO: update course properties
  const courseCollection = await courses();
  const updatedCourseData = {};
  if (updatedCourse.newTitle) {
    updatedCourseData.title = updatedCourse.newTitle;
  }
  if (updatedCourse.newContent) {
    updatedCourseData.content = updatedCourse.newContent;
  }

  let updateCommand = {
    $set: updatedCourseData
  };
  const query = {
    _id: id
  };
  await courseCollection.updateOne(query, updateCommand);

  return await getCourseById(id);
};

module.exports = {
  getAllCourses,
  getCourseById,
  addCourse,
  removeCourse,
  updateCourse
};
