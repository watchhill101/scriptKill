const mongoose = require('mongoose')

const typeSchema = new mongoose.Schema({
  name: String,//类型名称
})

const TypeModel = mongoose.model('type', typeSchema,'type')
module.exports = { TypeModel };