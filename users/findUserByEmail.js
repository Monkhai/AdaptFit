const { User } = require('./userModel');

exports.findUserByEmail = async function (email) {
  let user = await User.findOne(email);
  if (!user) return null;
  return user;
};
