const express = require("express");
require("./db/mongoose");

const userRouter = require("./routers/users");
const taskRouter = require("./routers/tasks");
const auth = require("./middleware/auth");

const app = express();
const port = process.env.PORT;

// MIDDLEWARE
// app.use((req, res, next) => {
//   res
//     .status(503)
//     .send("Website under maintanance! please try again after a while !");
// });

// app.use(auth);
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("server is running on port", port);
});

//before async-await::
// app.post("/users", (req, res) => {
//   const user = new User(req.body);

//   user
//     .save()
//     .then(() => {
//       res.send(user);
//     })
//     .catch((e) => {
//       res.status(400).send(e);
//     });
// });
