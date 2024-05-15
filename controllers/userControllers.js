const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const createUser = async (req, res) => {

    // 1. Check incoming data
    console.log(req.body);


    // 2. Destructure the incoming data
    const { firstName, lastName, email, password } = req.body;

    // 3. Validate the data (if empty, stop the process and send response)
    if (!firstName || !lastName || !email || !password) {
        // res.send("Please enter all fields!")
        return res.json({
            "success": false,
            "message": "Pleasse enter all fields!"
        })
    }



    // 4.  Error Handling (Try Catch)

    try {

        // 5. Check if the user is already registered
        const existingUser = await userModel.findOne({ email: email })

        // 5.1 if user found: Send response 
        if (existingUser) {
            return res.json({
                "success": false,
                "message": "User Already Exists!"
            })
        }

        // Hashing/Encryption of the password
        const randomSalt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, randomSalt)


        // 5.2 if user is new:

        const newUser = new userModel({
            //Database Fields  : Client's Value
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword
        })

        // Save to database
        await newUser.save()

        // send the respose
        res.json({
            "success": true,
            "message": "User Created Successfully!"
        })

        // 5.2.1 Hash the password
        // 5.2.2 Save to the database
        // 5.2.3 Send Successful response

    } catch (error) {
        console.log(error)
        res.json({
            "success": false,
            "message": "Internal server Error!"
        })
    }



    // 5.2.4 

}
// write a logic for login
// const login = async (req, res) => {
//     const { email, password } = req.body

//     if (!email && !password) {
//         return res
//             .status(400)
//             .json({ success: false, message: "Fill in all the required fields" })
//     }
//     try {
//         const userExists = await User.findOne({ email })
//         if (!userExists) {
//             return res
//                 .status(400)
//                 .json({ success: false, message: "Invalid email address" })
//         }
//         // converrt the hassed  password using bcrypt
//         const user = await bcrypt.compare(password, userExists.password)
//         if (!user) {
//             return res
//                 .status(401)
//                 .json({ success: false, message: "Invalid email or password!!" })
//         } else {
//             return res
//                 .status(200)
//                 .json({ success: true, message: "Logged in successfull!" })
//         }
//     } catch (error) {
//         res
//             .status(500)
//         .json({ success: false, message: "Internal server error:${error}"})
//     }
// }




// exporting
module.exports = {
    createUser
}