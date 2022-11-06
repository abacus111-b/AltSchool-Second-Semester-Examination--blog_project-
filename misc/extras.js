const storyTime = (story) => {
  const noOfWords = story.split(' ').length;
  // Lets say a normal person reads 100 words per minute
  const wordsPerMinute = noOfWords / 100;
  return Math.round(wordsPerMinute) === 0 ? 1 : Math.round(wordsPerMinute);
};

module.exports = { storyTime };
