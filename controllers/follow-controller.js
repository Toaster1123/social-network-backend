const { prisma } = require('../prisma/prisma-client');

const FollowController = {
  followUser: async (req, res) => {
    const { followingId } = req.body;
    const userId = req.user.userId;

    if (followingId === userId) {
      return res.status(500).json({ error: 'Запрещённая операция' });
    }
    try {
      const existingSubscription = await prisma.follows.findFirst({
        where: {
          AND: [{ followerid: userId }, { followingId }],
        },
      });
      if (existingSubscription) {
        return res.status(400).json({ error: 'подписка уже существует' });
      }
      await prisma.follows.create({
        data: {
          follower: {
            connect: { id: userId },
          },
          following: {
            connect: { id: followingId },
          },
        },
      });
      res.status(201).json({ message: 'подписка успешнор создана' });
    } catch (error) {
      console.error('follow error', error);
      res.status(500).json({ error: 'internal server error' });
    }
  },
  unFollowUser: async (req, res) => {
    const { followingId } = req.body;
    const userId = req.user.userId;
    try {
      const follows = await prisma.follows.findFirst({
        where: {
          AND: [
            { followerid: userId },
            {
              followingId,
            },
          ],
        },
      });
      if (!follows) {
        return res.status(404).json({ error: 'вы не подписаны на этого пользователя' });
      }
      await prisma.follows.delete({
        where: { id: follows.id },
      });
      res.status(201).json({ message: 'вы успешнор отписались' });
    } catch (error) {
      console.error('unfollow error', error);
      res.status(500).json({ error: 'internal server error' });
    }
  },
};
module.exports = FollowController;
