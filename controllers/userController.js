const { User } = require('../users/userModel');
const {
  validateUser,
  validateUsername,
  validateEmail,
  validatePassword,
  authorizeUser,
} = require('../validators/userValidators');

//todo:
// - hash passwords and validate passwords in logging and authorization
// - move isRegistered function and getSelf function
// - create getUser funcion to get others' user
// - move token from header to cookie (in auth module as well)
// - update user rather than update username, password, and email separately

//register user//
exports.registerUser = async (req, res) => {
  //validate req
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if user already exists
  //move to independent function
  let user = await User.findOne({ email: req.body.email });
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

  //save new user
  await user.save();

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(user);
};

//get user//
exports.getSelf = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).send('This account does not exist.');

  const { username, email } = user;
  res.send(username, email);
};

exports.authenticateUser = async (req, res) => {
  const { error } = authorizeUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password.');

  const token = user.generateAuthToken();
  res.send(token);
};

exports.deleteUser = async (req, res) => {
  //get the requesting user
  const userRequesting = await User.findById(req.user._id);
  if (!userRequesting) return res.status(400).send('Invalid request.');

  //get the user to be deleted
  const userToDelete = await User.findById(req.body.id);
  if (!userToDelete) return res.status(404).send('An account with this email does not exist.');

  //check if user is admin or same user as the one to delete
  if (userRequesting.id === userToDelete.id || userRequesting.isAdmin === true) {
    await User.findByIdAndDelete(userToDelete.id);
    res.send(`user deleted ${userToDelete}`);
  } else {
    res.status(400).send('Unauthorized request.');
  }
};

exports.updateUsername = async (req, res) => {
  //validate request
  const { error } = validateUsername(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //get user requesting
  const userRequesting = await User.findById(req.user._id);
  if (!userRequesting) return res.status(400).send('Invalid request.');

  //get user to update
  let userToUpdate = await User.findOne({ email: req.body.email });
  if (!userToUpdate) return res.status(400).send('An account with this email does not exist.');

  //get username
  const { username } = req.body;

  //update user if
  if (userRequesting.id === userToUpdate.id || userRequesting.isAdmin === true) {
    userToUpdate = await User.findByIdAndUpdate(
      userToUpdate.id,
      {
        username,
      },
      { new: true }
    );
    res.send(userToUpdate);
  } else {
    return res.status(401).send('Unauthorized request.');
  }
};

exports.updateEmail = async (req, res) => {
  //validate request
  const { error } = validateEmail(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //get user requesting
  const userRequesting = await User.findById(req.user._id);
  if (!userRequesting) return res.status(400).send('Invalid request.');

  //get user to update
  let userToUpdate = await User.findOne({ email: req.body.email });
  if (!userToUpdate) return res.status(400).send('An account with this email does not exist.');

  //get username
  const { new_email } = req.body;

  //update user if
  if (userRequesting.id === userToUpdate.id || userRequesting.isAdmin === true) {
    userToUpdate = await User.findByIdAndUpdate(
      userToUpdate.id,
      {
        email: new_email,
      },
      { new: true }
    );
    res.send(userToUpdate);
  } else {
    return res.status(401).send('Unauthorized request.');
  }
};

exports.updatePassword = async (req, res) => {
  //validate request
  const { error } = validatePassword(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //get user requesting
  const userRequesting = await User.findById(req.user._id);
  if (!userRequesting) return res.status(400).send('Invalid request.');

  //get user to update
  let userToUpdate = await User.findOne({ email: req.body.email });
  if (!userToUpdate) return res.status(400).send('An account with this email does not exist.');

  //get username
  const { new_password } = req.body;

  //update user if
  if (userRequesting.id === userToUpdate.id || userRequesting.isAdmin === true) {
    userToUpdate = await User.findByIdAndUpdate(
      userToUpdate.id,
      {
        password: new_password,
      },
      { new: true }
    );
    res.send(userToUpdate);
  } else {
    return res.status(401).send('Unauthorized request.');
  }
};
