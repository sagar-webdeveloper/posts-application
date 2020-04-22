const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const logger = require("./config/logger");
const sanitizer = require('express-sanitizer');
const helmet = require('helmet');
const app = express();


mongoose
    .connect(
        "mongodb+srv://sagar:" +
        process.env.MONGO_ATLAS_PW +
        "@cluster0-tkwya.mongodb.net/doyour-bit?retryWrites=true&w=majority", { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
    .then(() => {
        console.log("Testing connencted successfully")
        logger.error("Connected Succesfully");
    })
    .catch((err) => {
        console.log("Testing Connection failed!");
        logger.error("Connection failed!", err);
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(sanitizer());
app.use("/images", express.static(path.join("images")));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Content-Security-Policy", "script-src 'self' https://apis.google.com"
    );
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
});

app.use(helmet());
// Prevent opening page in frame or iframe to protect from clickjacking
app.use(helmet.xframe());

// Prevents browser from caching and storing page
app.use(helmet.noCache());

// Allow loading resources only from white-listed domains
app.use(helmet.csp());

// Allow communication only on HTTPS
app.use(helmet.hsts());

app.use((req, res, next) => {
    logger.error(req.body);
    let oldSend = res.send;
    res.send = function(data) {
        logger.error(data);
        oldSend.apply(res, arguments);
    }
    next();
})





app.use("/api/posts", postsRoutes);
app.use("/api/posts/addcomment", postsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;