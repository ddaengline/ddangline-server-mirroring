module.exports = function(app){
    const user = require('./userController')
    const jwtMiddleware = require('../../../config/jwtMiddleware')

    app.post(`/app/v1/users`, user.postUser)
    app.get(`/app/v1/users`, user.getUsers)
}