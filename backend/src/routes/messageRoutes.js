const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { 
    getMyMessages, 
    deleteMessage,
    markMessageAsRead,
    replyToMessage,
    getMySentMessages,
} = require('../controllers/messageController');

router.get('/my', auth, getMyMessages);
router.patch('/:id/read', auth, markMessageAsRead);
//router.put('/:id/read', auth, markMessageAsRead);
router.post('/:id/reply', auth, replyToMessage);
// Supprimer un message reçu
router.delete('/:id', auth, deleteMessage);
router.get('/sent', auth, getMySentMessages);


module.exports = router;
