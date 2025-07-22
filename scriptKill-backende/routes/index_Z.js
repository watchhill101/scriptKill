var express = require('express');
var router = express.Router();
// 修改引用路径，分别引入两个模型文件
const { Appointment, Coupon, Script, Shop } = require('../module/Appointment_payment_Z');
const CarGroup = require('../module/StartCar_Z');
const InitiateCar = require('../module/Initiate_carpooling_Z');

// 新建预约
router.post('/appointments', async (req, res) => {
  try {
    // 1. 验证必要字段
    const requiredFields = ['user', 'shop', 'script', 'people', 'timeSlot', 'pricePerPerson', 'totalPrice'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        code: 1,
        msg: `缺少必要字段: ${missingFields.join(', ')}`
      });
    }

    // 2. 创建前的数据处理
    const appointmentData = {
      ...req.body,
      status: 'pending',
      createdAt: new Date()
    };

    // 3. 如果有优惠券，验证优惠券
    if (req.body.coupon) {
      appointmentData.couponAmount = req.body.couponAmount || 0;
    }

    // 4. 创建并保存预约
    const appointment = new Appointment(appointmentData);
    await appointment.save();

    // 5. 返回创建成功的预约信息
    res.status(201).json({ 
      code: 0, 
      msg: '预约成功', 
      data: appointment 
    });

  } catch (err) {
    console.error('预约创建失败:', err);
    res.status(400).json({ 
      code: 1, 
      msg: '预约失败', 
      error: err.message 
    });
  }
});

// 获取预约详情
router.get('/appointments/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('user shop script coupon');
    if (!appointment) {
      return res.status(404).json({ code: 1, msg: '未找到预约' });
    }
    res.json({ code: 0, data: appointment });
  } catch (err) {
    res.status(400).json({ code: 1, msg: '查询失败', error: err.message });
  }
});

// 获取可用优惠券列表
router.get('/coupons', async (req, res) => {
  try {
    const { userId, totalAmount } = req.query;
    
    // 查询条件：未使用的优惠券 + (用户专属券或通用券)
    const query = {
      used: false,
      expiredAt: { $gt: new Date() },
      $or: [
        { user: userId },
        { user: null }  // 通用券
      ]
    };

    const coupons = await Coupon.find(query);
    
    // 筛选满足订单金额条件的优惠券
    const availableCoupons = coupons.filter(coupon => {
      if (!coupon.condition) return true;
      const minAmount = Number(coupon.condition.match(/满(\d+)元可用/)?.[1] || 0);
      return totalAmount >= minAmount;
    });

    res.json({
      code: 0,
      data: availableCoupons
    });
  } catch (err) {
    res.status(500).json({
      code: 1,
      msg: '获取优惠券失败',
      error: err.message
    });
  }
});

// 获取剧本详情
router.get('/scripts/:id', async (req, res) => {
  try {
    const script = await Script.findById(req.params.id)
      .populate('shop');
    
    if (!script) {
      return res.status(404).json({
        code: 1,
        msg: '剧本不存在'
      });
    }

    res.json({
      code: 0,
      data: script
    });
  } catch (err) {
    res.status(500).json({
      code: 1,
      msg: '获取剧本信息失败',
      error: err.message
    });
  }
});

// 获取门店详情
router.get('/shops/:id', async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    
    if (!shop) {
      return res.status(404).json({
        code: 1,
        msg: '门店不存在'
      });
    }

    res.json({
      code: 0,
      data: shop
    });
  } catch (err) {
    res.status(500).json({
      code: 1,
      msg: '获取门店信息失败',
      error: err.message
    });
  }
});

// 获取发车列表
router.get('/car-groups', async (req, res) => {
  try {
    const { sort = 'latest', search, page = 1, pageSize = 10 } = req.query;
    
    // 构建查询条件
    const query = {
      status: { $ne: 'closed' }
    };
    
    if (search) {
      query['$or'] = [
        { 'script.name': new RegExp(search, 'i') },
        { 'script.tags': new RegExp(search, 'i') },
        { 'script.level': new RegExp(search, 'i') }
      ];
    }
    
    // 计算分页
    const skip = (page - 1) * pageSize;
    
    // 获取数据并排序
    let carGroups;
    switch (sort) {
      case 'fastest':
        carGroups = await CarGroup.find(query)
          .sort({ fillRate: -1, createdAt: -1 })
          .skip(skip)
          .limit(parseInt(pageSize));
        break;
      case 'hot':
        carGroups = await CarGroup.find(query)
          .sort({ heat: -1, createdAt: -1 })
          .skip(skip)
          .limit(parseInt(pageSize));
        break;
      default:
        carGroups = await CarGroup.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(pageSize));
    }
    
    res.json({
      code: 0,
      data: carGroups
    });
  } catch (err) {
    console.error('获取发车列表失败:', err);
    res.status(500).json({
      code: 1,
      msg: '获取发车列表失败',
      error: err.message
    });
  }
});

// 加入发车
router.post('/car-groups/:id/join', async (req, res) => {
  try {
    const { userId, gender } = req.body;
    const carGroup = await CarGroup.findById(req.params.id);

    if (!carGroup) {
      return res.status(404).json({
        code: 1,
        msg: '发车信息不存在'
      });
    }

    // 检查是否已满员
    if (carGroup.currentPeople.length >= carGroup.maxPeople) {
      return res.status(400).json({
        code: 1,
        msg: '该车已满员'
      });
    }

    // 检查性别人数限制
    const currentGenderCount = carGroup.currentPeople.filter(p => p.gender === gender).length;
    const maxGenderCount = gender === 'male' ? carGroup.requirements.male : carGroup.requirements.female;
    
    if (currentGenderCount >= maxGenderCount) {
      return res.status(400).json({
        code: 1,
        msg: `${gender === 'male' ? '男生' : '女生'}人数已满`
      });
    }

    // 加入成员
    carGroup.currentPeople.push({
      user: {
        _id: userId,
        avatar: '/堂主.png' // 默认头像
      },
      gender
    });

    // 增加热度
    carGroup.heat += 1;

    await carGroup.save();

    res.json({
      code: 0,
      msg: '加入成功',
      data: carGroup
    });
  } catch (err) {
    res.status(500).json({
      code: 1,
      msg: '加入失败',
      error: err.message
    });
  }
});

// 创建发车
router.post('/initiate-car', async (req, res) => {
  try {
    const carData = {
      ...req.body,
      status: 'pending',
      creator: {
        _id: req.body.userId,
        avatar: '/堂主.png'
      }
    };

    const initiateCar = new InitiateCar(carData);
    await initiateCar.save();

    res.json({
      code: 0,
      msg: '发车成功',
      data: initiateCar
    });
  } catch (err) {
    res.status(500).json({
      code: 1,
      msg: '发车失败',
      error: err.message
    });
  }
});

module.exports = router;