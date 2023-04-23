const { User } = require('./userModel');

exports.findUser = async function (id) {
  let user = await User.findById(id);
  if (!user) return null;
  return user;
};
