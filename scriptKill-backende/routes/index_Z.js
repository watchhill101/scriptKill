var express = require('express');
var router = express.Router();
const mongoose = require('mongoose'); 
// 修改引用路径，使用正确的Script模型
const { Appointment, Coupon, Shop } = require('../module/Appointment_payment_Z');
const ScriptModel = require('../module/script'); // 导入正确的Script模型
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
    // 检查ID格式是否有效
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        code: 1,
        msg: '无效的剧本ID格式'
      });
    }

    const script = await ScriptModel.findById(req.params.id);
    
    if (!script) {
      return res.status(404).json({
        code: 1,
        msg: '剧本不存在'
      });
    }

    // 使用安全的访问方式，避免undefined错误
    // 格式化响应数据，确保前端可以正确显示
    const formattedScript = {
      _id: script._id,
      name: script.name || '未命名剧本',
      cover: script.imgUrl || '/default-cover.png', 
      description: script.description || '暂无描述',
      price: script.price || 0,
      playerCount: script.recommendNum 
        ? `${(script.recommendNum.boyNum || 0) + (script.recommendNum.grilNum || 0)}人本` 
        : '未知人数',
      duration: script.duration || '未知时长',
      tags: Array.isArray(script.type) ? script.type.map(t => t.toString()) : [],
      difficulty: '进阶', // 默认难度
      type: '情感', // 默认类型
      // 其他前端可能需要的字段
      rating: 4.8, // 默认评分
      totalRatings: 128, // 默认评价数量
      ratingStats: {1: 2, 2: 3, 3: 10, 4: 50, 5: 63}, // 评分分布
      characters: Array.isArray(script.role) 
        ? script.role.map((roleId, index) => ({
            id: roleId,
            name: `角色${index + 1}`,
            avatar: '/default-avatar.png'
          }))
        : []
    };

    res.json({
      code: 0,
      data: formattedScript
    });
  } catch (err) {
    console.error('获取剧本详情失败:', err); // 添加服务器日志
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

// 获取发车详情 
router.get('/car-groups/:id', async (req, res) => {
  try {
    const carGroup = await CarGroup.findById(req.params.id);
    
    if (!carGroup) {
      return res.status(404).json({
        code: 1,
        msg: '发车信息不存在'
      });
    }

    res.json({
      code: 0,
      data: carGroup
    });
  } catch (err) {
    res.status(500).json({
      code: 1,
      msg: '获取发车详情失败',
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

    // 统计当前性别人数
    const currentMaleCount = carGroup.currentPeople.filter(p => p.gender === 'male').length;
    const currentFemaleCount = carGroup.currentPeople.filter(p => p.gender === 'female').length;
    
    // 检查性别人数限制
    if (gender === 'male' && currentMaleCount >= carGroup.requirements.male) {
      return res.status(400).json({
        code: 1,
        msg: '男生人数已满'
      });
    }
    
    if (gender === 'female' && currentFemaleCount >= carGroup.requirements.female) {
      return res.status(400).json({
        code: 1,
        msg: '女生人数已满'
      });
    }

    // 加入成员
    carGroup.currentPeople.push({
      user: {
        _id: userId,
        avatar: '/堂主.png'
      },
      gender
    });

    // 增加热度
    carGroup.heat += 1;

    // 检查是否满员，更新状态
    const newMaleCount = carGroup.currentPeople.filter(p => p.gender === 'male').length;
    const newFemaleCount = carGroup.currentPeople.filter(p => p.gender === 'female').length;
    
    if (newMaleCount >= carGroup.requirements.male && newFemaleCount >= carGroup.requirements.female) {
      carGroup.status = 'full';
    }

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

// 获取剧本列表（用于发起拼车页面）- 优化分页逻辑
router.get('/scripts', async (req, res) => {
  try {
    const { tag, page = 1, pageSize = 10 } = req.query;
    
    let query = {};
    if (tag && tag !== '全部' && tag !== '') {
      query.tags = { $in: [tag] };
    }
    
    // 计算跳过的记录数
    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    
    // 获取总数
    const total = await Script.countDocuments(query);
    
    // 获取分页数据
    const scripts = await Script.find(query)
      .skip(skip)
      .limit(parseInt(pageSize))
      .sort({ createdAt: -1 });
    
    // 计算是否还有更多数据
    const hasMore = skip + scripts.length < total;
    
    res.json({
      code: 0,
      data: scripts,
      pagination: {
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        total,
        hasMore
      }
    });
  } catch (err) {
    console.error('获取剧本列表失败:', err);
    res.status(500).json({
      code: 1,
      msg: '获取剧本列表失败',
      error: err.message
    });
  }
});

// 优化创建发车接口
router.post('/initiate-car', async (req, res) => {
  try {
    const { script, date, timeSlot, maxPeople, requirements, userId } = req.body;
    
    // 数据验证
    if (!script || !date || !timeSlot || !maxPeople || !requirements || !userId) {
      return res.status(400).json({
        code: 1,
        msg: '缺少必要参数'
      });
    }
    
    // 验证时间格式
    if (!timeSlot.start || !timeSlot.end) {
      return res.status(400).json({
        code: 1,
        msg: '时间段格式错误'
      });
    }
    
    // 验证人数配置
    if (requirements.male + requirements.female !== maxPeople) {
      return res.status(400).json({
        code: 1,
        msg: '男女人数配置与总人数不符'
      });
    }
    
    const carData = {
      script, // 包含 introduction 字段
      date: new Date(date),
      timeSlot,
      maxPeople,
      requirements,
      currentPeople: [{
        user: {
          _id: userId,
          avatar: '/堂主.png'
        },
        gender: 'male' // 默认创建者性别，实际应该从用户信息获取
      }],
      creator: {
        _id: userId,
        avatar: '/堂主.png'
      },
      status: 'pending',
      heat: 1 // 创建时默认热度为1
    };

    const initiateCar = new InitiateCar(carData);
    await initiateCar.save();

    res.json({
      code: 0,
      msg: '发车成功',
      data: initiateCar
    });
  } catch (err) {
    console.error('创建发车失败:', err);
    res.status(500).json({
      code: 1,
      msg: '发车失败',
      error: err.message
    });
  }
});

// 获取发起的拼车列表
router.get('/initiate-cars', async (req, res) => {
  try {
    const { userId } = req.query;
    
    const query = userId ? { 'creator._id': userId } : {};
    
    const cars = await InitiateCar.find(query)
      .sort({ createdAt: -1 });
    
    res.json({
      code: 0,
      data: cars
    });
  } catch (err) {
    res.status(500).json({
      code: 1,
      msg: '获取发车列表失败',
      error: err.message
    });
  }
});

// 获取发起拼车详情 (新增)
router.get('/initiate-cars/:id', async (req, res) => {
  try {
    const initiateCar = await InitiateCar.findById(req.params.id);
    
    if (!initiateCar) {
      return res.status(404).json({
        code: 1,
        msg: '拼车信息不存在'
      });
    }

    res.json({
      code: 0,
      data: initiateCar
    });
  } catch (err) {
    res.status(500).json({
      code: 1,
      msg: '获取拼车详情失败',
      error: err.message
    });
  }
});

// 拼车支付成功后添加到发车列表
router.post('/carpool-payment', async (req, res) => {
  try {
    const { carId, peopleCount, genderAllocation, note, phone, couponId, totalAmount, userId, source } = req.body;

    // 获取原始拼车数据
    const originalCar = source === 'initiate' ? 
      await InitiateCar.findById(carId) : 
      await CarGroup.findById(carId);

    if (!originalCar) {
      return res.status(404).json({
        code: 1,
        msg: '拼车信息不存在'
      });
    }

    // 验证性别分配
    const currentMale = originalCar.currentPeople.filter(p => p.gender === 'male').length;
    const currentFemale = originalCar.currentPeople.filter(p => p.gender === 'female').length;
    const remainingMale = originalCar.requirements.male - currentMale;
    const remainingFemale = originalCar.requirements.female - currentFemale;

    if (genderAllocation.male > remainingMale || genderAllocation.female > remainingFemale) {
      return res.status(400).json({
        code: 1,
        msg: '性别人数超出需求限制'
      });
    }

    // 检查剩余位置
    const remainingSlots = originalCar.maxPeople - originalCar.currentPeople.length;
    if (peopleCount > remainingSlots) {
      return res.status(400).json({
        code: 1,
        msg: `剩余位置不足，只能预约${remainingSlots}人`
      });
    }

    // 创建新成员列表
    const newMembers = [];
    
    // 添加男生
    for (let i = 0; i < genderAllocation.male; i++) {
      newMembers.push({
        user: {
          _id: new mongoose.Types.ObjectId(), // 使用ObjectId而不是字符串
          avatar: '/堂主.png'
        },
        gender: 'male'
      });
    }
    
    // 添加女生
    for (let i = 0; i < genderAllocation.female; i++) {
      newMembers.push({
        user: {
          _id: new mongoose.Types.ObjectId(), // 使用ObjectId而不是字符串
          avatar: '/堂主.png'
        },
        gender: 'female'
      });
    }

    // 创建新的发车信息或更新现有信息
    let carGroup;
    if (source === 'initiate') {
      const isCreator = originalCar.creator._id.toString() === userId;
      
      if (isCreator) {
        // 创建者支付时，从购买人数中减去创建者本身
        const adjustedMembers = newMembers.slice(0, peopleCount - 1);
        
        carGroup = new CarGroup({
          script: originalCar.script,
          date: originalCar.date,
          timeSlot: originalCar.timeSlot,
          maxPeople: originalCar.maxPeople,
          requirements: originalCar.requirements,
          currentPeople: [
            ...originalCar.currentPeople, // 已包含创建者
            ...adjustedMembers
          ],
          status: 'pending',
          heat: (originalCar.heat || 0) + peopleCount
        });
      } else {
        carGroup = new CarGroup({
          script: originalCar.script,
          date: originalCar.date,
          timeSlot: originalCar.timeSlot,
          maxPeople: originalCar.maxPeople,
          requirements: originalCar.requirements,
          currentPeople: [
            ...originalCar.currentPeople,
            ...newMembers
          ],
          status: 'pending',
          heat: (originalCar.heat || 0) + peopleCount
        });
      }
    } else {
      // 更新现有发车
      originalCar.currentPeople.push(...newMembers);
      originalCar.heat = (originalCar.heat || 0) + peopleCount;
      carGroup = originalCar;
    }

    await carGroup.save();

    res.json({
      code: 0,
      msg: '支付成功',
      data: {
        carGroupId: carGroup._id,
        orderId: `ORDER_${Date.now()}`,
        amount: totalAmount,
        genderAllocation
      }
    });

  } catch (err) {
    console.error('拼车支付失败:', err);
    res.status(500).json({
      code: 1,
      msg: '支付失败',
      error: err.message
    });
  }
});

module.exports = router;