const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BoardSchema = new Schema({
  title: String,
  backgroundColor: String,
  textColor: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'List' }],
  favorite: { type: Boolean, default: false }
});

const Board = mongoose.models.Board || mongoose.model('Board', BoardSchema);

module.exports = Board;
