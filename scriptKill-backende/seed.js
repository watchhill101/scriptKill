const mongoose = require('mongoose');
const { UserModel } = require('./module/user');
const { ShopModel } = require('./module/shop');
const { ScriptModel } = require('./module/script');
const { DmModel } = require('./module/dm');
const { ReservationModel } = require('./module/reservation');
const { ScriptRoleModel } = require('./module/scriptRole');
const { TypeModel } = require('./module/type');
const { PersonalCenterModel } = require('./module/personalCenter');

const main = async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/scriptKill");
  console.log("数据库连接成功");
  await seedDatabase();
  await mongoose.disconnect();
  console.log("数据库连接已断开");
}

main().catch(err => console.error(err));

const seedDatabase = async () => {
  try {
    try {
      // Drop index to avoid duplicate key error during development
      try {
        await UserModel.collection.dropIndex('openId_1');
        console.log('openId index dropped');
      } catch (error) {
        if (error.codeName !== 'IndexNotFound') {
          console.error('Error dropping index:', error);
          throw error;
        }
        // Index not found is fine, means it's the first run
      }

      await Promise.all([
        UserModel.deleteMany({}),
        ShopModel.deleteMany({}),
        ScriptModel.deleteMany({}),
        DmModel.deleteMany({}),
        ReservationModel.deleteMany({}),
        ScriptRoleModel.deleteMany({}),
        TypeModel.deleteMany({}),
        PersonalCenterModel.deleteMany({}),
      ]);
      console.log('数据库集合已清空');
    } catch (error) {
      console.error('清空集合失败:', error);
      throw error;
    }

    let types, roles, script, dm, shop, users;

    try {
      types = await TypeModel.insertMany([
        { name: '情感' },
        { name: '推理' },
        { name: '恐怖' },
        { name: '欢乐' },
      ]);
      console.log('剧本类型已创建');
    } catch (error) {
      console.error('创建剧本类型失败:', error);
      throw error;
    }

    try {
      roles = await ScriptRoleModel.insertMany([
        { name: '侦探', gender: '男', description: '负责揭开真相' },
        { name: '医生', gender: '女', description: '拥有治疗能力' },
        { name: '富商', gender: '男', description: '案件的关键人物' },
        { name: '女演员', gender: '女', description: '掌握着重要线索' },
      ]);
      console.log('剧本角色已创建');
    } catch (error) {
      console.error('创建剧本角色失败:', error);
      throw error;
    }

    try {
      script = await ScriptModel.create({
        name: '消失的档案',
        imgUrl: 'http://example.com/script.jpg',
        price: 68,
        description: '一桩离奇的失踪案，背后隐藏着惊天秘密。',
        type: [types[1]._id, types[2]._id],
        recommendNum: { grilNum: 2, boyNum: 2 },
        duration: '4小时',
        role: roles.map(r => r._id),
      });
      console.log('剧本已创建');
    } catch (error) {
      console.error('创建剧本失败:', error);
      throw error;
    }

    try {
      dm = await DmModel.create({
        name: 'DM-小明',
        imgUrl: 'http://example.com/dm.jpg',
        description: '金牌主持人，带你沉浸式体验。',
      });
      console.log('DM已创建');
    } catch (error) {
      console.error('创建DM失败:', error);
      throw error;
    }

    try {
      shop = await ShopModel.create({
        name: '迷雾剧场',
        imgUrl: 'http://example.com/shop.jpg',
        phone: '13800138000',
        address: 'XX市XX区XX街道123号',
        businessHours: '10:00 - 24:00',
        scripts: [script._id],
        dms: [dm._id],
      });
      dm.shop = shop._id;
      await dm.save();
      console.log('店铺已创建');
    } catch (error) {
      console.error('创建店铺失败:', error);
      throw error;
    }

    try {
      users = await UserModel.insertMany([
        { name: '玩家A', imgUrl: 'http://example.com/userA.jpg', phone: '13900139000', openId: 'openid_A' },
        { name: '玩家B', imgUrl: 'http://example.com/userB.jpg', phone: '13700137000', openId: 'openid_B' },
      ]);
      console.log('用户已创建');
    } catch (error) {
      console.error('创建用户失败:', error);
      throw error;
    }

    try {
      await PersonalCenterModel.create({
          user: users[0]._id,
          address: 'XX市XX小区',
          sex: '男'
      });
      console.log('个人中心信息已创建');
    } catch (error) {
      console.error('创建个人中心信息失败:', error);
      throw error;
    }

    try {
      await ReservationModel.create({
        user: users[0]._id,
        shop: shop._id,
        script: script._id,
        dm: dm._id,
        reservationTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
        players: [
          { user: users[0]._id, role: roles[0]._id },
          { user: users[1]._id, role: roles[1]._id },
        ],
        status: 'confirmed',
        totalPrice: 136,
        notes: '请准备好零食。',
      });
      console.log('预约订单已创建');
    } catch (error) {
      console.error('创建预约订单失败:', error);
      throw error;
    }

    console.log('🎉 模拟数据全部插入成功！');

  } catch (error) {
    // The main catch block will now catch errors from any of the specific steps.
  }
};

seedDatabase();