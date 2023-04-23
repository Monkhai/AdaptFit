const { findUser } = require('../users/findUser');
const { findUserByEmail } = require('../users/findUserByEmail');
const { User } = require('../users/userModel');
const {
  validateUser,
  validateUsername,
  validateEmail,
  validatePassword,
  authorizeUser,
} = require('../validators/userValidators');
const bcrypt = require('bcrypt');

//todo:
// - move token from header to cookie (in auth module as well)

//register user//
exports.registerUser = async (req, res) => {
  //validate req
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if user already exists
  //move to independent function
  let user = await findUserByEmail({ email: req.body.email });
  if (user) return res.status(400).send('An account with this email already exists.');

  //get the data
  const { username, email, password, isAdmin } = req.body;

  //create new user
  user = new User({
    username,
    email,
    password,
    isAdmin,
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  //save new user
  await user.save();

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(user);
};

//get user//
exports.getSelf = async (req, res) => {
  const user = findUser(req.user._id);
  if (!user) return res.status(404).send('This account does not exist.');

  const { username, email } = user;
  res.send(username, email);
};

exports.authenticateUser = async (req, res) => {
  const { error } = authorizeUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await findUserByEmail({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password.');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  const token = user.generateAuthToken();
  res.send(token);
};

exports.deleteUser = async (req, res) => {
  //get the requesting user
  const userRequesting = await findUser(req.user._id);
  if (!userRequesting) return res.status(400).send('Invalid request.');

  //get the user to be deleted
  const userToDelete = await findUser(req.body.id);
  if (!userToDelete) return res.status(404).send('An account with this email does not exist.');

  //check if user is admin or same user as the one to delete
  if (userRequesting.id === userToDelete.id || userRequesting.isAdmin === true) {
    await User.findByIdAndDelete(userToDelete.id);
    res.send(`user deleted ${userToDelete}`);
  } else {
    res.status(400).send('Unauthorized request.');
  }
};

exports.updateUser = async (req, res) => {
  //validate request
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //get user requesting
  const userRequesting = await findUser(req.user._id);
  if (!userRequesting) return res.status(400).send('Invalid request.');

  //get user to update
  let userToUpdate = await findUser({ email: req.body.email });
  if (!userToUpdate) return res.status(400).send('An account with this email does not exist.');

  //get username
  const { username, email, password } = req.body;

  //update user if
  if (userRequesting.id === userToUpdate.id || userRequesting.isAdmin === true) {
    userToUpdate = await User.findByIdAndUpdate(
      userToUpdate.id,
      {
        username,
        email,
        password,
      },
      { new: true }
    );
    const salt = await bcrypt.genSalt(10);
    userToUpdate.password = await bcrypt.hash(password, salt);

    res.send(userToUpdate);
  } else {
    return res.status(401).send('Unauthorized request.');
  }
};
