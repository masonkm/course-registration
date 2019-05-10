// Author: Kenneth Mason

const mongoCollections = require("./mongoCollections");
const students = mongoCollections.students;
const uuid = require("node-uuid");

  const get = async (id) =>{
    if (!id) throw "You must provide an id to search for";
    const studentCollection = await students();
    const studentgo = await studentCollection.findOne({ _id: id });
    if (studentgo === null) throw "No student with that id";
    return studentgo;
  };

  const getAll = async () => {
    const studentCollection = await students();
    return await studentCollection.find({}).toArray();
  };

  const getByUserName = async(userName) =>{
    if (!userName) throw "You must provide a userName to search for";
    const studentCollection = await students();
    const studentgo = await studentCollection.findOne({userName: userName});
    if (studentgo === null) throw "No student with that id";
    return studentgo;
  }

  const create = async (user, pwd, last, first, studentId, year, credits) => {
    if (!user || typeof(user) !== "string") throw "You must provide a username";
    if (!pwd || typeof(pwd) !== "string") throw "You must provide a password";
    if (!last || typeof(last) !== "string") throw "You must provide a last name for your student";
    if (!first || typeof(first) !== "string") throw "You must provide a first name for your student";
    if (!studentId || typeof(studentId) !== "number") throw "You must provide a student ID";
    if (!year || typeof(year) !== "number") throw "You must provide a year";
    if(credits !== 0){
      /*If credits is set equal to 0, if(!credits) will return true, thereby throwing an error. checking
      credits !== 0 is necessary to circumvent that*/
      if (!credits || typeof(credits) !== "number") throw "You must provide number of completed credits";
    }

    const studentCollection = await students();
    const id = uuid.v4();

    const newstudent = {
      _id: id,
      userName: user,
      hashedPass: pwd,
      profile: {
        _id: id,
        lastName: last,
        firstName: first,
        studentId: studentId,
        year: year,
        credits: credits,
        finishedCourses: [],
        currentCourses: [],
        registeredCourses: [],
        holds: false
      }
    };

    const insertInfo = await studentCollection.insertOne(newstudent);
    if (insertInfo.insertedCount === 0) console.log("Could not add student");
    const newId = insertInfo.insertedId;

    const student = await get(newId);
    return student;
  };

  const remove = async (id) =>{
    if (!id) throw "You must provide an id to search for";
    const studentCollection = await students();
    const student = await get(id);
    const deletionInfo = await studentCollection.removeOne({ _id: id });

    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete student with id of ${id}`;
    }
    return student;
  };

  const deleteAll = async () =>{
    const studentCollection = await students();
    const deletionInfo = await studentCollection.remove();
    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete student with id of ${id}`;
    }
  };

  const update = async (id, user, pwd, year, credits, finished, current, holds) =>{
    if (!id || typeof(id) !== "string") throw "You must provide an ID";
    if (!user || typeof(user) !== "string") throw "You must provide a username";
    if (!pwd || typeof(pwd) !== "string") throw "You must provide a password";
    if (!year || typeof(year) !== "number") throw "You must provide a year";
    if(credits !== 0){
      if (!credits || typeof(credits) !== "number") throw "You must provide number of completed credits";
    }
    if (!Array.isArray(finished)) throw "You must provide an array of finished courses";
    if (!Array.isArray(current)) throw "You must provide an array of current enrollments";
    if(holds !== false){
      if (!holds || typeof(holds) !== "boolean") throw "You must provide a boolean";
    }

    const studentCollection = await students();
    let student = await get(id);
    let updatedStudent = {
      _id: id,
      userName: user,
      hashedPass: pwd,
      profile: {
        _id: id,
        lastName: student.profile.lastName,
        firstName: student.profile.firstName,
        studentId: student.profile.studentId,
        year: year,
        credits: credits,
        finishedCourses: finished,
        currentCourses: current,
        holds: holds
      }
    };

    const updatedInfo = await studentCollection.replaceOne({ _id: id }, updatedStudent);
    if (updatedInfo.modifiedCount === 0) {
      console.log("No updates");
    }
    return await get(id);
  };

  const updateFinishedCourses = async (userName, FinishedCourses) =>{
    if(!userName) throw "You must provide a userName";
    if(!FinishedCourses) throw "You must provide finishedCourses";

    if(typeof(userName)!=="string"){
      throw "UserName is not a string";
    }

    const studentCollection = await students();

    await studentCollection.updateOne({userName: userName},{$set: { "profile.finishedCourses": FinishedCourses }});
    //await studentCollection.updateOne({_id: student._id},{$set: { "profile.finishedCourses": FinishedCourses }});
    return await getByUserName(userName);
    //console.log(newStudent);
  }

  const updateCurrentCourses = async (userName, CurrentCourses) =>{
    if(!userName) throw "You must provide a userName";
    if(!CurrentCourses) throw "You must provide currentCourses";

    if(typeof(userName)!=="string"){
      throw "UserName is not a string";
    }

    const studentCollection = await students();

    await studentCollection.updateOne({userName: userName},{$set: { "profile.currentCourses": CurrentCourses }});
    return await getByUserName(userName);
  };

  const addRegisteredCourses = async (userName, RegisteredCourse) =>{
    if(!userName) throw "You must provide a userName";
    if(!RegisteredCourse) throw "You must provide RegisteredCourses";

    if(typeof(userName)!=="string"){
      throw "UserName is not a string";
    }

    const studentCollection = await students();

    const targetStudent = await getByUserName(userName);
    // console.log("targetStudent is :")
    // console.log(targetStudent);
    let registeredCoursesList = targetStudent.profile.registeredCourses;
    registeredCoursesList.push(RegisteredCourse);
    await studentCollection.updateOne({userName: userName},{$set: { "profile.registeredCourses": registeredCoursesList }});
    return await getByUserName(userName);
  };

  const dropRegisteredCourses = async (userName, RegisteredCourse) =>{
    if(!userName) throw "You must provide a userName";
    if(!RegisteredCourse) throw "You must provide a RegisteredCourse";

    if(typeof(userName)!=="string"){
      throw "UserName is not a string";
    }

    if(typeof(RegisteredCourse) !=="string"){
      throw "RegisteredCourse is not a string";
    }

    const studentCollection = await students();

    const targetStudent = await getByUserName(userName);
    // console.log("targetStudent is :")
    // console.log(targetStudent);
    let registeredCoursesList = targetStudent.profile.registeredCourses;
    let newRegisteredCoursesList = [];
    for(let i=0; i<registeredCoursesList.length; i++){
      if(registeredCoursesList[i]!==RegisteredCourse){
        newRegisteredCoursesList.push(registeredCoursesList[i]);
      }
    }
    await studentCollection.updateOne({userName: userName},{$set: { "profile.registeredCourses": newRegisteredCoursesList }});
    return await getByUserName(userName);
  };





module.exports = {
  get,
  getAll,
  getByUserName,
  create,
  remove,
  update,
  deleteAll,
  updateFinishedCourses,
  updateCurrentCourses,
  addRegisteredCourses,
  dropRegisteredCourses
};
