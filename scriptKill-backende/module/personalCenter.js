const mongoose = require('mongoose')

const personalCenterSchema = new mongoose.Schema({
  address: String,//地址
  sex: String, //性别
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }
},{
  timestamps: true
})

const PersonalCenterModel = mongoose.model('personalCenter', personalCenterSchema,'personalCenter');

module.exports = { PersonalCenterModel };