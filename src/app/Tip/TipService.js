const { response, errResponse } = require('../../../config/response');
const baseResponseStatus = require('../../../config/baseResponseStatus');
const mongoose = require("mongoose");
const { MONGO_URI, dbName } = require("../../../config/secret");
const tipDao = require('./TipDao')