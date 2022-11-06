const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const storySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    tags: {
      tags: [String],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    state: {
      type: String,
      default: 'draft',
      enum: ['draft', 'published'],
    },
    read_count: {
      type: Number,
      default: 0,
    },
    reading_time: {
      type: Number,
    },
    body: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model('Story', storySchema);
