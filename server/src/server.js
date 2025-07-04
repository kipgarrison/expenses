const express = require('express')
const fs = require('fs/promises');
const cors = require('cors');
const app = express()
const port = 3000
const bodyParser = require('body-parser');
const _ = require('lodash');
const config = require('./config');
const v1 = require("./routes");
const addLatency = require('./middleWare/addLatency');
const errorHandler = require('./middleWare/errorHandler');
const morganMiddleware = require('./middleWare/morganMiddleware');
const addRequestId = require('./middleWare/add-request-id');

app.use(cors());
app.use(bodyParser.json());
app.use(morganMiddleware)
app.use(addLatency(2000));
app.use(addRequestId);
app.use("/api/v1", v1);
app.use(errorHandler);
app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port}`)
})