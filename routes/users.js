module.exports = app => {
  const user = require("../controllers/users.js");

  // Retrieve all user
  app.get("/users", user.getAll);
};