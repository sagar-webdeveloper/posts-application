const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");
const logger = require("./config/logger");

const app = express();

mongoose
    .connect(
        "mongodb+srv://sagar:" +
        process.env.MONGO_ATLAS_PW +
        "@cluster0-tkwya.mongodb.net/doyour-bit?retryWrites=true&w=majority", { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true })
    .then(() => {
        logger.info("Connected Succesfully");
    })
    .catch((err) => {
        console.info("Connection failed!", err);
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("images")));

app.use((req, res, next) => {
    logger.error(req.body);
    let oldSend = res.send;
    res.send = function(data) {
        logger.error(data);
        oldSend.apply(res, arguments);
    }
    next();
})

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
});



app.use("/api/posts", postsRoutes);
app.use("/api/posts/addcomment", postsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;