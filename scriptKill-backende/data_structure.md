# 剧本杀小程序数据结构文档

本文档详细描述了“剧本杀”小程序后端项目的数据模型结构，该结构基于 Mongoose Schema 定义。

## 目录

- [1. 用户 (`user.js`)](#1-用户-userjs)
- [2. 剧本 (`script.js`)](#2-剧本-scriptjs)
- [3. 剧本角色 (`scriptRole.js`)](#3-剧本角色-scriptrolejs)
- [4. 剧本类型 (`type.js`)](#4-剧本类型-typejs)
- [5. 店铺 (`shop.js`)](#5-店铺-shopjs)
- [6. DM (主持人) (`dm.js`)](#6-dm-主持人-dmjs)
- [7. 预约/订单 (`reservation.js`)](#7-预约订单-reservationjs)
- [8. 个人中心 (`personalCenter.js`)](#8-个人中心-personalcenterjs)
- [9. 数据库连接 (`index.js`)](#9-数据库连接-indexjs)

---

### 1. 用户 (`user.js`)

`UserModel` - 存储用户信息。

| 字段名 | 类型 | 描述 | 关联 |
| :--- | :--- | :--- | :--- |
| `name` | `String` | 用户名 | |
| `imgUrl` | `String` | 用户头像URL | |
| `phone` | `String` | 手机号 | |
| `openId` | `String` | 微信用户的唯一标识 (应设为 `unique`) | |
| `collections` | `[ObjectId]` | 收藏的剧本ID列表 | `script` |
| `playedBefore` | `[ObjectId]` | 玩过的剧本ID列表 | `script` |
| `coupons` | `[ObjectId]` | 拥有的优惠券ID列表 | `coupon` |
| `createdAt` | `Date` | 创建时间 (自动生成) | |
| `updatedAt` | `Date` | 更新时间 (自动生成) | |

### 2. 剧本 (`script.js`)

`ScriptModel` - 存储剧本的详细信息。

| 字段名 | 类型 | 描述 | 关联 |
| :--- | :--- | :--- | :--- |
| `name` | `String` | 剧本名称 | |
| `imgUrl` | `String` | 剧本封面图片URL | |
| `price` | `Number` | 剧本价格 | |
| `description` | `String` | 剧本简介 | |
| `type` | `[ObjectId]` | 剧本类型ID列表 | `type` |
| `recommendNum` | `Object` | 推荐人数，包含 `grilNum` (女) 和 `boyNum` (男) | |
| `duration` | `String` | 剧本时长 (例如: "4-5小时") | |
| `role` | `[ObjectId]` | 剧本包含的角色ID列表 | `scriptRole` |
| `createdAt` | `Date` | 创建时间 (自动生成) | |
| `updatedAt` | `Date` | 更新时间 (自动生成) | |

### 3. 剧本角色 (`scriptRole.js`)

`ScriptRoleModel` - 存储剧本中每个角色的信息。

| 字段名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `name` | `String` | 角色名称 |
| `gender` | `String` | 角色性别 (男/女/不限) |
| `description` | `String` | 角色简介 |
| `imgUrl` | `String` | 角色图片URL |

### 4. 剧本类型 (`type.js`)

`TypeModel` - 存储剧本的分类，例如：情感、恐怖、推理等。

| 字段名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `name` | `String` | 类型名称 |

### 5. 店铺 (`shop.js`)

`ShopModel` - 存储店铺信息。

| 字段名 | 类型 | 描述 | 关联 |
| :--- | :--- | :--- | :--- |
| `name` | `String` | 店铺名称 | |
| `imgUrl` | `String` | 店铺头像或门面图URL | |
| `phone` | `String` | 店铺联系电话 | |
| `address` | `String` | 店铺地址 | |
| `businessHours` | `String` | 营业时间 (例如: "10:00-22:00") | |
| `scripts` | `[ObjectId]` | 店铺拥有的剧本ID列表 | `script` |
| `dms` | `[ObjectId]` | 店铺的DM列表 | `dm` |
| `createdAt` | `Date` | 创建时间 (自动生成) | |
| `updatedAt` | `Date` | 更新时间 (自动生成) | |

### 6. DM (主持人) (`dm.js`)

`DmModel` - 存储DM（Dungeon Master，剧本杀主持人）的信息。

| 字段名 | 类型 | 描述 | 关联 |
| :--- | :--- | :--- | :--- |
| `name` | `String` | DM姓名 | |
| `imgUrl` | `String` | DM头像URL | |
| `description` | `String` | DM简介 | |
| `shop` | `ObjectId` | 所属店铺ID | `shop` |
| `createdAt` | `Date` | 创建时间 (自动生成) | |
| `updatedAt` | `Date` | 更新时间 (自动生成) | |

### 7. 预约/订单 (`reservation.js`)

`ReservationModel` - 存储用户的预约信息，是核心的业务模型。

| 字段名 | 类型 | 描述 | 关联 |
| :--- | :--- | :--- | :--- |
| `user` | `ObjectId` | 发起预约的用户ID | `user` |
| `shop` | `ObjectId` | 预约的店铺ID | `shop` |
| `script` | `ObjectId` | 预约的剧本ID | `script` |
| `dm` | `ObjectId` | 预约的DM ID (可选) | `dm` |
| `reservationTime`| `Date` | 预约的游戏开始时间 | |
| `players` | `[Object]` | 玩家列表，每个对象包含 `user` 和 `role` | `user`, `scriptRole` |
| `status` | `String` | 订单状态: `pending`, `confirmed`, `playing`, `completed`, `cancelled` | |
| `totalPrice` | `Number` | 订单总金额 | |
| `notes` | `String` | 用户备注 | |
| `createdAt` | `Date` | 创建时间 (自动生成) | |
| `updatedAt` | `Date` | 更新时间 (自动生成) | |

### 8. 个人中心 (`personalCenter.js`)

`PersonalCenterModel` - 存储用户的扩展信息，与 `user` 模型一对一关联。

| 字段名 | 类型 | 描述 | 关联 |
| :--- | :--- | :--- | :--- |
| `address` | `String` | 用户地址 | |
| `sex` | `String` | 用户性别 | |
| `user` | `ObjectId` | 关联的用户ID | `user` |
| `createdAt` | `Date` | 创建时间 (自动生成) | |
| `updatedAt` | `Date` | 更新时间 (自动生成) | |

### 9. 数据库连接 (`index.js`)

此文件负责连接 MongoDB 数据库，并统一导出所有数据模型，方便在项目的其他地方调用。