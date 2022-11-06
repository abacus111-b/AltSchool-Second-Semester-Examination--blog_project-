const mongoose = require('mongoose');

const { storyTime } = require('../misc/extras');

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
    creator: {
      type: String,
    },
  },
  { timestamps: true }
);

// calculating how long it takes to read a story before saving document
storySchema.pre('save', function (next) {
  let story = this;

  // calculate the time in minutes
  const timeToRead = storyTime(this.body);

  story.story_time = timeToRead;
  next();
});

// calculating how long it takes to read a story  before updating document
storySchema.pre('findOneAndUpdate', function (next) {
  let story = this._update;

  // calculate the time in minutes
  if (story.body) {
    const timeToRead = storyTime(story.body);
    story.story_time = timeToRead;
  }

  next();
});

storySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.__v;
    delete returnedObject.creator;
  },
});

module.exports = mongoose.model('Story', storySchema);
