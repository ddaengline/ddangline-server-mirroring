const express = require('./config/express');
const mongoose = require('mongoose');
const { MONGO_URI, dbName } = require('./config/secret');

const methodOverride = require('method-override')
const compression = require('compression')
var cors = require('cors')

const { User } = require('./src/models/User');

const { response, errResponse } = require('./config/response');
const baseResponse = require('./config/baseResponseStatus');
// const { logger } = require('./config/winston')

const port = 3000;
express().listen(port, () => console.log(`server listening on port ${port}`))
// logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);

// const server = async () => {
//   try {
//     await mongoose.connect(MONGO_URI, { dbName });

//     app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
//     app.use(express.json())
//     app.use(compression())
//     app.use(express.urlencoded({extended: true}))
//     app.use(methodOverride())
//     app.use(cors())


//     app.get('/users', async (req, res) => {
//       const userList = await User.find();
//       return res.send({userList});
//     });

//     app.post('/users', async (req, res) => {
//       try {
//         const { username, email, password } = req.body;
//         if (!username) return res.status(500).send(errResponse(baseResponse.SIGNUP_NICKNAME_EMPTY));
//         if (!email) return res.status(500).send(errResponse(baseResponse.SIGNUP_EMAIL_EMPTY));
//         if (!password) return res.status(500).send(errResponse(baseResponse.SIGNUP_PASSWORD_EMPTY));

//         const user = new User({ username, email, password });
//         await user.save();
//         return res.send(response(baseResponse.SUCCESS));
//       } catch (err) {
//         console.log({ err });
//         return res.status(500).send({ err: err.message });
//       }
//     });

//     app.listen(3000, () => console.log(`server listening on port ${port}`));
//   } catch (err) {
//     console.log({ err });
//   }
// };

// server();
