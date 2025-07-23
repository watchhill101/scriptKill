const express = require('express');
const router = express.Router();
const Ranking = require('../module/ranking');

// 获取排行榜数据（按分数降序）
router.get('/', async (req, res) => {
  try {
    const rankings = await Ranking.find()
      .sort({ points: -1 })
      .limit(10);

    res.json(rankings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('服务器错误');
  }
});

module.exports = router;