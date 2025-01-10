const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CardSchema = new Schema({
  content: String,
  list: { type: mongoose.Schema.Types.ObjectId, ref: 'List' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

CardSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Card = mongoose.models.Card || mongoose.model('Card', CardSchema);

module.exports = Card;
