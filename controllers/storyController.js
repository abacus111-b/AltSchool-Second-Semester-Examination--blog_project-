const Story = require('../models/storyModel');

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
      creator: req.user.email,
    });
    // save new data to the dB

    const createdStory = await newStory.save();

    // imprinting story ID to the corresponding user

    req.user.stories = req.user.stories.concat(createdStory._id);
    await req.user.save();

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
    if (!req.user) {
      return response(res);
    } else if (story.author._id.toString() !== req.user.id.toString()) {
      return response(res);
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
    const stories = await Story.find(req.findFilter)
      .sort(req.sort)
      .select(req.fields)
      .populate('author', { email: 1 })
      .skip(req.pagination.start)
      .limit(req.pagination.sizePerPage);

    const tabInfo = req.tabInfo;

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
    let storyEdit = { ...req.body };
    if (storyEdit.state) delete storyEdit.state;
    const story = await Story.findByIdAndUpdate(req.params.id, storyEdit, {
      new: true,
      runValidators: true,
      context: 'query',
    });

    if (!story) {
      return res.status(404).json({
        status: 'fail',
        message: 'story doesnt exist',
      });
    }

    return res.json({
      status: 'ok',
      data: story,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message || 'update story',
    });
    next(error);
  }
};
const updateStoryState = async (req, res, next) => {
  try {
    let { state } = req.body;

    if (
      !(
        state &&
        (state.toLowerCase() === 'published' || state.toLowerCase() === 'draft')
      )
    ) {
      throw new Error('Please provide a valid state');
    }

    const story = await Story.findByIdAndUpdate(
      req.params.id,
      { state: state.toLowerCase() },
      { new: true, runValidators: true, context: 'query' }
    );

    return res.json({
      status: 'ok',
      data: story,
    });
  } catch (err) {
    err.source = 'update story';
    next(err);
  }
};

module.exports = {
  createStory,
  editStory,
  getStory,
  getStories,
  updateStoryState,
};
