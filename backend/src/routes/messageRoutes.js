const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { getMyMessages } = require('../controllers/messageController');

router.get('/my', auth, getMyMessages);

module.exports = router;
