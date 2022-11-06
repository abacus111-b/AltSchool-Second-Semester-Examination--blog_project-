module.exports = async (req, res, next) => {
  try {
    const userStories = req.user.stories.map((id) => id.toString());
    const { id } = req.params;
    const isPresent = userStories.includes(id);

    if (!isPresent) {
      return res.status(403).json({
        status: 'fail',
        error: 'Forbidden',
      });
    }

    next();
  } catch (err) {
    err.source = 'jwt middleware error';
    next(err);
  }
};
