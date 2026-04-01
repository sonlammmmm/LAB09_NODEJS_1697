var express = require("express");
var router = express.Router();
const { CheckLogin } = require("../utils/authHandler");
let messageModel = require('../schemas/messages');
let multer = require('multer');
let path = require('path');
let mongoose = require('mongoose');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
let upload = multer({ storage: storage });

// GET / - lấy message cuối cùng của mỗi user mà user hiện tại nhắn tin
router.get('/', CheckLogin, async function (req, res, next) {
    try {
        let currentUser = req.user._id;

        let allMessages = await messageModel.find({
            $or: [
                { from: currentUser },
                { to: currentUser }
            ]
        }).sort({ createdAt: -1 })
            .populate('from', 'username fullName avatarUrl')
            .populate('to', 'username fullName avatarUrl');

        let map = {};
        for (let msg of allMessages) {
            let otherId = msg.from._id.toString() === currentUser.toString()
                ? msg.to._id.toString()
                : msg.from._id.toString();
            if (!map[otherId]) {
                map[otherId] = msg;
            }
        }

        res.send(Object.values(map));
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// GET /:userID - lấy toàn bộ message giữa user hiện tại và userID
router.get('/:userID', CheckLogin, async function (req, res, next) {
    try {
        let currentUser = req.user._id;
        let otherUser = req.params.userID;

        let messages = await messageModel.find({
            $or: [
                { from: currentUser, to: otherUser },
                { from: otherUser, to: currentUser }
            ]
        }).sort({ createdAt: 1 })
            .populate('from', 'username fullName avatarUrl')
            .populate('to', 'username fullName avatarUrl');

        res.send(messages);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// POST / - gửi message
router.post('/', CheckLogin, upload.single('file'), async function (req, res, next) {
    try {
        let currentUser = req.user._id;
        let to = req.body.to;
        let messageContent;

        if (req.file) {
            messageContent = {
                type: 'file',
                text: '/uploads/' + req.file.filename
            };
        } else {
            messageContent = {
                type: 'text',
                text: req.body.text
            };
        }

        let newMessage = new messageModel({
            from: currentUser,
            to: to,
            messageContent: messageContent
        });

        await newMessage.save();
        res.send(newMessage);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
