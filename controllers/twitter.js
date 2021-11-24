// const socketIo = require('socket.io');
const needle = require('needle');
const TOKEN = process.env.TWITTER_BEARER_TOKEN;

const rulesURL = 'https://api.twitter.com/2/tweets/search/stream/rules'
const streamURL =
    'https://api.twitter.com/2/tweets/search/stream?tweet.fields=public_metrics&expansions=author_id'
// const rules = [{ value: 'coding' }]
const Tweet = require('../models/tweet');

exports.getRules = async (req, res) => {
    const response = await needle('get', rulesURL, {
        headers: {
            Authorization: `Bearer ${TOKEN}`,
        },
    })
    console.log(response.body)
    return res.json(response.body);
}

exports.setRules = async (req, res) => {
    if (!req.body) {
        return res.json({ error: 'Body can not be empty.' })
    }
    const rules = req.body.rules;
    const data = {
        add: rules,
    }

    const response = await needle('post', rulesURL, data, {
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
        },
    })

    return res.json(response.body);
}

// Delete stream rules
exports.deleteRules = async (req, res) => {
    if (!req.body) {
        return res.json({ error: 'Body can not be empty.' })
    }
    let rules = req.body.rules;
    const data = {
        delete: {
            ids: rules,
        },
    }

    const response = await needle('post', rulesURL, data, {
        headers: {
            'content-type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
        },
    })

    return res.json(response.body)
}


exports.streamTweets = async (socket) => {
    const stream = needle.get(streamURL, {
        headers: {
            Authorization: `Bearer ${TOKEN}`,
        },
    })

    stream.on('data', (data) => {
        try {
            if (data.length > 20) {
                // console.log(data.length,"ssssssssss");
                const parsedData = JSON.parse(data);
                let obj = {
                    tweetId: parsedData.data.id,
                    text: parsedData.data.text,
                    author_id: parsedData.data.author_id,
                    author_name: parsedData.includes.users[0].username,
                    author_username: parsedData.includes.users[0].name,
                }
                let tweet = new Tweet(obj);
                tweet.save((err, tweet) => {
                    if (err) {
                        console.log(err)
                    } else {
                        // console.log(tweet,"tweettweet")
                        socket.emit('tweet', tweet)
                    }
                })
            }
        } catch (error) {
            console.log(error)
            // return error
        }
    })

}

exports.getTweets = async (req, res) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 25

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const results = {}

    if (endIndex < await Tweet.countDocuments().exec()) {
        results.next = {
            page: page + 1,
            limit: limit
        }
    }

    if (startIndex > 0) {
        results.previous = {
            page: page - 1,
            limit: limit
        }
    }
    try {
        results.results = await Tweet.find().limit(limit).skip(startIndex).exec()
        res.status(200).json({
            status:200,
            data:results
        });
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}