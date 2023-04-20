const express = require('express');
const app = express();
const logger = require('./startup/logging');

require('./startup/logging');
require('./startup/routes')(app);
require('./startup/dbConnect')();
require('./startup/config')();
require('./startup/validation')();

//listen for events
const port = process.env.PORT || 3000;
app.listen(port, () => logger.info(`Listening on port ${port}...`));
