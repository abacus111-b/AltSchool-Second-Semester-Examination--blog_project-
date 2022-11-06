const router = require('express').Router();
const storyController = require('../controllers/storyController');
const getBearerToken = require('../middlewares/getBearerToken');
const getUserToken = require('../middlewares/getUserToken');
const pagination = require('../middlewares/pagination');

router.route('/').get(pagination, storyController.getStories);
router.route('/:id').get(storyController.getStory);

router.use(getBearerToken, getUserToken);
router.route('/create').post(storyController.createStory);

// router.use(getBearerToken, getUserToken);
// router.post('/create', storyController.createStory);
// router.get('/:id', storyController.getStory);
// router.get('/', storyController.getStories);

// router.route('/');

module.exports = router;
