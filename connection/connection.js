const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE)
    .then(() => {
        console.log('DB CONNECTED')
    }).catch(error => Throw(error));