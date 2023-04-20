const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  created_by: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  public: {
    type: Boolean,
    default: false,
  },
});

const Exercise = new mongoose.model('Exercise', exerciseSchema);

exports.Exercise = Exercise;
