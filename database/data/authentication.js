const bcrypt = require('bcrypt');
const mongoCollections = require("./mongoCollections");
const users = mongoCollections.students;
const saltRounds = 16;


const checkUsername = async (username) => {
            const studentCollection = await users();
            const studentgo = await studentCollection.findOne({ userName: username });
            if (studentgo === null) 
                { 
                    return; 
                }
            
            let uname = studentgo.userName
            return uname;
    };

const matchPassword = async (username, password) => {
        
            const studentCollection = await users();
            const studentgo = await studentCollection.findOne({ userName: username });
            const pwd = studentgo.hashedPass;

            if (username === studentgo.userName) {
                let hashedPwd  = await bcrypt.hashSync(studentgo.hashedPass, saltRounds);
                console.log(hashedPwd);

                if (bcrypt.compareSync(password, hashedPwd)) {
                    return {
                            status: true,
                            studentgo
                    }
                } else {
                    return {
                        status: false,
                        message: "The provided password is Wrong!"
                    }
                }
            }
        
        return {
            status: false,
            message: "No user found!"
        }
    };
module.exports = {
    checkUsername,
    matchPassword
};

