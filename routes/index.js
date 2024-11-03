const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  UserController,
  PostController,
  LikeController,
  FollowController,
} = require('../controllers');
const authenticateToken = require('../middleware/auth');
const CommentController = require('../controllers/comments-controller');

const destination = 'uploads';

const storage = multer.diskStorage({
  destination,
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploads = multer({ storage: storage });

// роуты пользователя
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/current', authenticateToken, UserController.current);
router.get('/users/:id', authenticateToken, UserController.getUserById);
router.put('/users/:id', authenticateToken, UserController.updateUser);
// роуты постов
router.post('/posts', authenticateToken, PostController.createPost);
router.get('/posts', authenticateToken, PostController.getAllPost);
router.get('/posts/:id', authenticateToken, PostController.getPostById);
router.delete('/posts/:id', authenticateToken, PostController.deletePost);
// роуты комментариев
router.post('/comments', authenticateToken, CommentController.createComment);
router.delete('/comments/:id', authenticateToken, CommentController.deleteComment);
// роуты лайков
router.post('/likes', authenticateToken, LikeController.likePost);
router.delete('/likes/:id', authenticateToken, LikeController.unlikePost);
// роуты подписок
router.post('/follow', authenticateToken, FollowController.followUser);
router.delete('/follow/:id', authenticateToken, FollowController.unFollowUser);

module.exports = router;
