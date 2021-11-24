const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
    tweetId: {
        type: String,
        trim: true,
        required: true,
    },
    text: {
        type: String,
        trim: true,
        required: true,
    },
    author_id: {
        type: String,
        trim: true,
        required: true,
    },
    author_name: {
        type: String,
        trim: true,
        required: true,
    },
    author_username: {
        type: String,
        trim: true,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Tweet', tweetSchema);