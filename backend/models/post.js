const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    imagePath: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    comments: [{ message: String, date: String, commentBy: String }],
    postType: { type: String, required: true },
    postBy: { type: String, required: true },
    postedTime: { type: String, required: true }
});

module.exports = mongoose.model("Post", postSchema);