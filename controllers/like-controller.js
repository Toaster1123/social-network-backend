const { prisma } = require('../prisma/prisma-client');
const LikeController = {
  likePost: async (req, res) => {
    const { postId } = req.body;
    const userId = req.user.userId;
    if (!postId) {
      return res.status(400).json({ error: 'Не все поля заполненны' });
    }
    try {
      const existLike = await prisma.like.findFirst({
        where: { postId, userId },
      });
      if (existLike) {
        return res.status(400).json({ error: 'Вы уже поставили лайк' });
      }
      const like = await prisma.like.create({
        data: { postId, userId },
      });
      res.json(like);
    } catch (error) {
      console.error('Ошибка при нажатии лайка', error);
      res.status(500).json({ error: 'internal server  error' });
    }
  },
  unlikePost: async (req, res) => {
    const { id } = req.params;
    const userId = req.user.params;
    if (!id) {
      return res.status(400).json({ error: 'Вы уже поставили дизлайк' });
    }
    try {
      const existLike = await prisma.like.findFirst({
        where: { postId: id, userId },
      });
      if (!existLike) {
        return res.status(400).json({ error: 'Вы уже поставили лайк' });
      }
      const like = await prisma.like.deleteMany({
        where: { postId: id, userId },
      });
      res.json(like);
    } catch (error) {
      console.error('Ошибка при нажатии дизлайка', error);
      res.status(500).json({ error: 'internal server  error' });
    }
  },
};
module.exports = LikeController;
