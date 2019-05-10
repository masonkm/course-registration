// Author: Kenneth Mason

const authentication = require("./authentication");
const studentData = require("./students");
const courseData = require("./courses");

module.exports = {
    authentication: authentication,
  	students:studentData,
  	courses:courseData
};
