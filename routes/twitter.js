const express = require('express');
const router=express.Router();
const {getRules,setRules,deleteRules,getTweets}=require('../controllers/twitter');


router.get('/get-rules',getRules);

router.post('/set-rules',setRules);

router.delete('/delete-rules',deleteRules);

router.get('/get-tweets',getTweets);
module.exports=router;