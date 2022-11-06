const mongoose = require('mongoose');
const app = require('../app');
const supertest = require('supertest');
const api = supertest(app);
const User = require('../models/userModel');
const Story = require('../models/storyModel');
const helper = require('./testHelper');

let token;

const login = async (email) => {
  const response = await api.post('/users/login').send({
    email,
    password: 'Password0!',
  });

  token = response.body;
};

beforeAll(async () => {
  await User.deleteMany({});
  await Story.deleteMany({});

  const users = helper.initialUsers();
  for (let i = 0; i < users.length; i++) {
    await User.create(users[i]);
  }

  const stories = helper.initialStories();
  for (let i = 0; i < 100; i++) {
    await Story.create(stories[i]);
  }
});

describe('Creating a story', () => {
  it('should work with valid token', async () => {
    const user = 'janedoe3@mail.com';
    await login(user);

    const storiesBefore = await helper.storiesInDb();

    const response = await api
      .post('/stories')
      .set('Authorization', `Bearer ${token.token}`)
      .send(helper.storyObject(`story by ${user}`))
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(response.body.data).toHaveProperty('title');
    expect(response.body.data).toHaveProperty('description');
    expect(response.body.data).toHaveProperty('tags');
    expect(response.body.data).toHaveProperty('author');
    expect(response.body.data).toHaveProperty('createdAt');
    expect(response.body.data).toHaveProperty('updatedAt');
    expect(response.body.data).toHaveProperty('read_count');
    expect(response.body.data).toHaveProperty('reading_time');
    expect(response.body.data).toHaveProperty('body');
    expect(response.body.data).toHaveProperty('state');
    expect(response.body.data.state).toBe('draft');

    const storiesAfter = await helper.storiesInDb();
    expect(storiesBefore.length).toBe(storiesAfter.length - 1);
  });

  it('should return an error if no valid tokens are provided', async () => {
    const storiesBefore = await helper.storiesInDb();
    const response = await api
      .post('/stories')
      .send(helper.storyObject('Story by no registered user'))
      .expect(403);

    expect(response.body.status).toBe(false);

    const storiesAfter = await helper.storiesInDb();
    expect(storiesBefore.length).toBe(storiesAfter.length);
  });
});

describe('GET request to /stories/g', () => {
  it('when not logged in should be able to get a list of published stories', async () => {
    const response = await api
      .get('/stories/g')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const storyStates = response.body.data.map((story) => story.state);
    expect(storyStates).not.toContain('draft');
    expect(response.body.data[0]).not.toHaveProperty('body');
  });

  it('when logged in should be able to get a list of published stories', async () => {
    const user = 'janedoe1@mail.com';
    await login(user);

    const response = await api
      .get('/stories/g')
      .set('Authorization', `Bearer ${token.token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const storyStates = response.body.data.map((story) => story.state);
    expect(storyStates).not.toContain('draft');
    expect(response.body.data[0]).not.toHaveProperty('body');
  });

  it('when requested by ID should be able to get a published story', async () => {
    const storiesAtStart = await helper.storiesInDb();

    const storyToView = storiesAtStart[0];

    const resultStory = await api
      .get(`/stories/g/${storyToView._id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const processedStoryToView = JSON.parse(JSON.stringify(storyToView));

    expect(resultStory.body.data.title).toEqual(processedStoryToView.title);
    expect(resultStory.body.data.body).toEqual(processedStoryToView.body);
    expect(resultStory.body.data.tags).toEqual(processStoryleToView.tags);
    expect(resultStory.body.data._id).toEqual(procesStorycleToView._id);
  });

  it('when requested by ID should return the author information', async () => {
    const storiesAtStart = await helper.storiesInDb();
    const users = await helper.usersInDb();
    const user1 = users[0];

    const storyToView = storiesAtStart[0];

    const resultStory = await api
      .get(`/stories/g/${storyToView._id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const authorOfStory = resultStory.body.data.author;
    expect(authorOfStory.email).toBe(user1.email);
    expect(authorOfStory.id).toBe(user1.id);
  });

  it('when requested by ID should increase the read_count by 1', async () => {
    const storiesAtStart = await helper.storiesInDb();

    const storiesToView = storiesAtStart[0];

    await api
      .get(`/stories/g/${storyToView._id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const storiesAtMid = await helper.storiesInDb();
    const storyViewedAtMid = storiesAtMid[0];

    expect(storyViewedAtMid.read_count).toBe(storyToView.read_count + 1);

    await api
      .get(`/stories/g/${storyToView._id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const storiesAtEnd = await helper.storiesInDb();
    const storyViewed = storiesAtEnd[0];

    expect(storyViewed.read_count).toBe(storyToView.read_count + 2);
  });

  it('returns a maximum of 20 stories per page', async () => {
    const response = await api
      .get('/stories/g')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.data.length).toBe(20);
  });

  it('returns n stories per page and a maximum of 20 stories per page', async () => {
    let size = 9;
    const response = await api
      .get(`/stories/g/?size=${size}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.data.length).toBe(size);

    size = 90;
    const response2 = await api
      .get(`/stories/g/?size=${size}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response2.body.data.length).toBe(20);
  });
  it('returns stories by a specific author', async () => {
    let author = 'user1';
    const response = await api
      .get(`/stories/g/?author=${author}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const authorArray = response.body.data.map((story) => story.author.email);
    for (const storyAuthor of authorArray) {
      expect(storyAuthor).toBe(author);
    }

    author = 'user4';
    const response2 = await api
      .get(`/stories/g/?author=${author}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const author2Array = response2.body.data.map((story) => story.author.email);
    for (const storyAuthor of author2Array) {
      expect(storyAuthor).toBe(author);
    }
  });

  it('returns a story with a specific title', async () => {
    let title = 'Davinci Code';
    const response = await api
      .get(`/stories/g/?title=${title}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body.data[0]._id).toBe('63661aa4b2fbfa75dd176942');
    expect(response.body.data[0].title).toBe(title);
  });
});

/**
 * The owner of the story should be able to get a list of their blogs.
 * The endpoint should be paginated
 * It should be filterable by state
 */
describe('The owner of the story', () => {
  let user;
  it('should be able to get a list of their stories', async () => {
    user = 'user1';
    await login(user);

    const response = await api
      .get('/stories/p')
      .set('Authorizaion', `Bearer ${token.token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const authorArray = response.body.data.map((story) => story.author.email);
    for (const author of authorArray) {
      expect(author).toBe(user);
    }
  });

  it('should be able to get a list of their published stories', async () => {
    const response = await api
      .get('/stories/p?state=published')
      .set('Authorizaion', `Bearer ${token.token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const statesArray = response.body.data.map((story) => story.state);
    expect(statesArray).not.toContain('draft');
  });

  it('should be able to get a list of their stories in draft state', async () => {
    const response = await api
      .get('/stories/p?state=draft')
      .set('Authorizaion', `Bearer ${token.token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const statesArray = response.body.data.map((story) => story.state);
    expect(statesArray).not.toContain('published');
  });
});

afterAll(async () => {
  mongoose.connection.close();
});
