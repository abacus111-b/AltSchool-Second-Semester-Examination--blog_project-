const createUser = (req, res) => {
  console.log("Yeah, you're welcome from this Foinnne Ass!");
  res.end();
};
const revertUser = (req, res) => {
  console.log("Get off my page");
  res.end();
};

module.exports = { createUser, revertUser };
