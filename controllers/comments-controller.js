const { prisma } = require('../prisma/prisma-client');

const CommentController = {
  createComment: async (req, res) => {
    const { postId, content } = req.body;
    const userId = req.user.userId;
    if (!postId || !content) {
      return res.status(400).json({ error: 'Не все поля заполненны' });
    }
    try {
      const comment = await prisma.comment.create({
        data: {
          postId,
          userId,
          content,
        },
      });
      res.json(comment);
    } catch (error) {
      console.error('error write comment', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  deleteComment: async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
      const comment = await prisma.comment.findUnique({
        where: {
          id,
        },
      });
      if (!comment) {
        return res.status(404).json({ error: 'комментрий не найден' });
      }
      if (comment.userId !== userId) {
        return res.status(403).json({ error: 'Нет доступа' });
      }
      await prisma.comment.delete({ where: { id } });
      res.json(comment);
    } catch (error) {
      console.error('Ошибка при удалении коментария', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = CommentController;
