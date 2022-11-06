const Story = require('../models/storyModel');

const { storyTime } = require('../misc/extras');

const createStory = async function (req, res, next) {
  try {
    //get the needed info from the request body
    const { author, title, description, tags, body } = req.body;

    // create a new story instance
    const newStory = new Story({
      author: req.user._id,
      title,
      description: description || title,
      tags,
      body,
      story_time: storyTime(body),
    });
    // save new data to the dB

    const createdStory = await newStory.save();
    return res.status(201).json({
      status: 'successful',
      data: newStory,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message || 'error occured',
    });
    next(error);
  }
};
const getStory = async function (req, res, next) {
  try {
    const { id } = req.params;
    const story = await Story.findById(id).populate('author', { email: 1 });

    if (story.state !== 'published') {
      return res.status(403).json({
        status: false,
        error: 'Story has not being published yet',
      });
    }

    // update story read count
    story.read_count += 1;
    await story.save();

    return res.json({
      status: true,
      data: story,
    });
  } catch (err) {
    err.source = 'get published story controller';
    next(err);
  }
};
const getStories = async function (req, res, next) {
  try {
    const stories = await Story.find({ state: 'published' })
      .select({ title: 1 })
      .populate('author', { email: 1 })
      .skip(req.pagination.start)
      .limit(req.pagination.sizePerPage);

    const tabInfo = {};
    tabInfo.currentPage = req.pagination.page;
    if (req.pagination.previousPage)
      tabInfo.previousPage = req.pagination.previousPage;
    if (req.pagination.nextPage) tabInfo.nextPage = req.pagination.nextPage;

    return res.json({
      status: true,
      tabInfo,
      data: stories,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message || 'error occured',
    });
    next(error);
  }
};
const editStory = async function (req, res, next) {
  try {
  } catch (error) {
    res.status(400).json({
      error: error.message || 'error occured',
    });
    next(error);
  }
};

module.exports = { createStory, editStory, getStory, getStories };
