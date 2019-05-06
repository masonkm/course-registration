//Jiacheng Guo
const dbConnection = require("../database/data/mongoConnection")
const data = require("../database/data");
const students = data.students;
const courses = data.courses;

const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase();
    const JG = await students.create("gjc921019","password","Guo","Jiacheng",10442082,2,9);
    const YL = await students.create("ly930919","password","Li","Yi",10442083,2,9);
    const course1 = await courses.addCourse(1,"fall","cs546","Web Programming",3,"Computer Science",10,"Tuesday 6pm to 9pm","NB 115","Patric Hill",["cs561","cs570"],[],"blabla");
    const course2 = await courses.addCourse(2,"fall","cs570","Data Structure",3,"Computer Science",5,"Monday 6pm to 9pm","Babbio 108","Jack Lee",[],["cs571"],"blabla");
    const course3 = await courses.addCourse(3,"fall","cs571","Data Structure Lab",1,"Computer Science",8,"Tuesday 3pm to 5pm", "Babbio 120","Jack Lee",[],["cs570"],"blabla");
    const course4 = await courses.addCourse(4,"fall","cs561","Database Management",3,"Computer Science",4,"Wednesday 3pm to 5pm", "Babbio 220","Sam Lee",[],[],"blabla");
    const course5 = await courses.addCourse(5,"Spring","ee551","Introduction to Python",3,"Electrical Engineering",5,"Tuesday 10Am to 1pm", "Babbio 307","Sam Will",[],[],"blabla");
    const course6 = await courses.addCourse(6,"fall","ee 510","Digital Singal Processing",3,"Electrical Engineering",0,"Tuesday 6pm to 9pm", "Babbio 106","Michel Wang",[],[],"blabla");
    console.log("Done seeding");
    await db.serverConfig.close();
};

main().catch(console.log);