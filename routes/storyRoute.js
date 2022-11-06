const router = require('express').Router();
const storyController = require('../controllers/storyController');
const appDesigns = require('../middlewares/appDesigns');
const verifyUser = require('../middlewares/getUserToken');
const pagination = require('../middlewares/pagination');
const creator = require('../middlewares/creator');

router
  .route('/')
  .get(
    appDesigns.filterAndSort,
    appDesigns.filterByPublished,
    pagination,
    appDesigns.list,
    storyController.getStories
  );

router.route('/:id').get(storyController.getStory);

router
  .route('/p')
  .get(
    verifyUser.getUserFromToken,
    appDesigns.filterAndSort,
    appDesigns.setUserFilter,
    pagination,
    storyController.getStories
  );

router
  .route('/:id')
  .get(verifyUser.attachUser, storyController.getStory)
  .patch(verifyUser.getUserFromToken, creator, storyController.updateStoryState)
  .put(verifyUser.getUserFromToken, creator, storyController.editStory);

router
  .route('/create')
  .post(verifyUser.getUserFromToken, storyController.createStory);

module.exports = router;
