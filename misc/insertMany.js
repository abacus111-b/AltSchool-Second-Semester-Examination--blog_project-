const User = require('../models/userModel');
const Story = require('../models/storyModel');
const helper = require('../tests/testHelper');
const storyModel = require('../models/storyModel');

async function go() {
  console.log('starting..');
  await User.deleteMany({});
  await Story.deleteMany({});

  console.log('inserting users..');
  const users = helper.initialUsers();
  for (let i = 0; i < users.length; i++) {
    await User.create(users[i]);
  }
  console.log('inserting users done..');

  console.log('inserting stories..');
  const stories = helper.initialStories();
  for (let i = 0; i < 100; i++) {
    await Story.create(stories[i]);
  }
  console.log('inserting stories done..');
}

module.exports = go;
