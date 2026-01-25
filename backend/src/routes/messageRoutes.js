const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { 
    getMyMessages, 
    deleteMessage,
    markMessageAsRead, 
} = require('../controllers/messageController');

router.get('/my', auth, getMyMessages);
router.patch('/:id/read', auth, markMessageAsRead);
//router.put('/:id/read', auth, markMessageAsRead);
// Supprimer un message reçu
router.delete('/:id', auth, deleteMessage);

module.exports = router;
