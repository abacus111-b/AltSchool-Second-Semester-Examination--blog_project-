const User = require('../models/userModel');
const Story = require('../models/storyModel');

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const storiesInDb = async () => {
  const stories = await Story.find({});
  return stories.map((story) => story.toJSON());
};

const createUserObject = (n) => {
  return {
    firstName: 'Jane',
    lastName: `Doe${n}`,
    email: `janedoe${n}@mail.com`,
    password: 'Password0!',
  };
};

const initialUsers = () => {
  return require('./fixtures/users.json');
};

const initialStories = () => {
  return require('./fixtures/stories.json');
};

const storyObject = (title) => {
  return {
    title,
    description: 'All alphabets duly represented',
    tags: ['brown', 'fox'],
    body: 'The quick brown fox jumped over a lazy dog.The quick brown fox jumped over a lazy dog.The quick brown fox jumped over a lazy dog.The quick brown fox jumped over a lazy dog.The quick brown fox jumped over a lazy dog.The quick brown fox jumped over a lazy dog.The quick brown fox jumped over a lazy dog.The quick brown fox jumped over a lazy dog.The quick brown fox jumped over a lazy dog.The quick brown fox jumped over a lazy dog.The quick brown fox jumped over a lazy dog.The quick brown fox jumped over a lazy dog.The quick brown fox jumped over a lazy dog.',
  };
};

module.exports = {
  usersInDb,
  createUserObject,
  storyObject,
  storiesInDb,
  initialUsers,
  initialStories,
};
