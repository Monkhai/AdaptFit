const { Exercise } = require('../exercises/exerciseModel');
const {
  validateExercise,
  validateDeleteReq,
  validateUpdateReq,
} = require('../validators/exerciseValidators');
const { User } = require('../users/userModel');
const { findUser } = require('../users/findUser');

//todo
//- add description and gif abilities to exercise schema

exports.getExercises = async (req, res) => {
  //use getUser function
  let user = await findUser(req.user._id);
  if (!user) return res.status(400).send('Bad request: can not find user.');

  const exercises = await Exercise.find({
    $or: [{ public: true }, { user: req.user._id }],
  }).sort('name');
  res.send(exercises);
};

exports.getOneExercise = async (req, res) => {
  //get user
  //make into independent getUser function
  let user = await findUser(req.user._id);
  if (!user) return res.status(400).send('Bad request: can not find user.');

  //find exercise if it is public or created by user
  let exercise = await Exercise.findOne({ name: req.body.name }).and({
    $or: [{ 'created_by.user': user.id }, { public: true }],
  });
  if (!exercise) return res.status(400).send('No exercises found.');

  res.send(exercise);
};

exports.createExercise = async (req, res) => {
  //validate request
  const { error } = validateExercise(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //validate and get user using token

  const user = await findUser(req.user._id);
  if (!user) return res.status(400).send('Bad request: can not find user.');

  //get properties
  const { name, public } = req.body;
  const { id } = user;

  //check if exercise already exists
  let exercise = await Exercise.findOne({ name: name }).and({
    $or: [{ 'created_by.user': user.id }, { public: true }],
  });
  if (exercise) return res.status(401).send('Exercise already exists');

  //create new exercise with user information and the exercise name
  exercise = new Exercise({
    name: name,
    created_by: { user: id },
    public,
  });

  //save exercise and send to user
  await exercise.save();
  res.send(exercise);
};

exports.deleteExercise = async (req, res) => {
  const { error } = validateDeleteReq(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await findUser(req.user._id);
  if (!user) return res.status(400).send('Bad request: can not find user.');

  const exercise = await Exercise.findById(req.body.id);
  if (!exercise) return res.status(400).send('Exercise does not exist.');

  if (exercise.created_by.user.equals(user._id)) {
    await Exercise.findByIdAndDelete(exercise.id);
    res.send(`Exercise deleted: ${exercise.name}`);
  } else {
    res.status(401).send('Unauthorized request.');
  }
};

exports.updateExercise = async (req, res) => {
  const { error } = validateUpdateReq(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //use getUser function
  const user = await findUser(req.user._id);
  if (!user) return res.status(400).send('Bad request: can not find user.');

  let exercise = await Exercise.findById(req.body.id);
  if (!exercise) return res.status(400).send('Exercise does not exist.');

  if (exercise.created_by.user.equals(user._id)) {
    exercise = await Exercise.findByIdAndUpdate(
      req.body.id,
      {
        name: req.body.name,
      },
      { new: true }
    );
    res.send(exercise);
  } else {
    res.status(401).send('Unauthorized request.');
  }
};
