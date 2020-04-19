const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const request = require("request");
// const LOCK_TIME = 2 * 60 * 60 * 1000;
// const MAX_LOGIN_ATTEMPTS = 5;

exports.createUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash,
            fullname: req.body.fullname
        });
        user.save()
            .then(result => {
                res.status(201).json({
                    message: "User created!",
                    result: result
                });
            })
            .catch(err => {
                res.status(500).json({
                    message: "Invalid authentication credentials!"
                });
            });
    });
}

exports.userLogin = (req, res, next) => {
    if (req.body.captcha === undefined ||
        req.body.captcha === '' ||
        req.body.captcha === null) {
        console.log("0");
        return res.json({ "success": false, message: "Please select Captcha" });
    }
    const secretKey = '6LcQGOUUAAAAABjYojglDxJxcp5PBijzfyrWh4rJ';
    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=
        ${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;

    request(verifyUrl, (err, response, body) => {
        body = JSON.parse(body);

        if (body.success !== undefined && !body.success) {
            return res.json({ "success": false, message: "Failed Captcha Veification!" });
            console.log("1");
        }
        let fetchedUser;
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    return res.status(401).json({
                        message: "Auth failed"
                    });
                }
                // if (User.userLocked && User.lockUntil > Date.now()) {
                //     console.log("user lock");
                //     return res.status(401).json({
                //         message: "You have reached maximum attempt, your account is locked temporarily, Please try after sometime"
                //     });
                // }
                fetchedUser = user;
                return bcrypt.compare(req.body.password, user.password);
            })
            .then(result => {
                if (!result) {
                    // console.log("password failed", fetchedUser);
                    // User.update({ _id: fetchedUser._id }, {
                    //     $set: {
                    //         loginAttempts: fetchedUser.loginAttempts + 1
                    //     }
                    // }).then(result => {
                    //     console.log("updated login attempt");
                    //     return res.status(401).json({
                    //         message: "Auth failed"
                    //     })
                    // })
                    return res.status(401).json({
                        message: "Auth failed"
                    })
                }
                const token = jwt.sign({
                        email: fetchedUser.email,
                        userId: fetchedUser._id,
                        fullname: fetchedUser.fullname
                    },
                    process.env.JWT_KEY, { expiresIn: "1h" }
                );
                res.status(200).json({
                    token: token,
                    expiresIn: 3600,
                    userId: fetchedUser._id
                });
            }).catch(err => {
                // console.log(err);
                // console.log("last", fetchedUser)
                // User.update({ _id: fetchedUser._id }, {
                //     $set: {
                //         loginAttempts: fetchedUser.loginAttempts + 1
                //     }
                // })
                return res.status(401).json({
                    message: "Invalid authentication credentials!"
                });
            });


    })
}