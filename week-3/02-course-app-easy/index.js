const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

function isAdmin(username, password) {
  return ADMINS.findIndex((usr) => usr.username === username && usr.password === password);
}

function isUser(username, password) {
  return USERS.findIndex((usr) => usr.username === username && usr.password === password);
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const newAdmin = {
    username: req.body.username,
    password: req.body.password
  };
  ADMINS.push(newAdmin);
  res.status(201).json({ message: "Admin created successfully" });
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const { username, password } = req.headers;
  const admin = isAdmin(username, password);
  if (admin !== -1) return res.status(200).json({ message: "Logged in successfully" });
  return res.sendStatus(404);
});

app.post('/admin/courses', (req, res) => {
  // logic to create a course
  const { username, password } = req.headers;
  const admin = isAdmin(username, password);
  if (admin !== -1) {
    const { title, description, price, imageLink, published } = req.body;
    const newCourse = {
      id: Math.floor(Math.random() * 100000),
      title,
      description,
      price,
      imageLink,
      published
    }
    COURSES.push(newCourse);
    return res.status(200).json({ message: "Course created successfully", courseId: newCourse.id });
  }
  return res.sendStatus(401)
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
  const { courseId } = req.params;
  const { username, password } = req.headers;
  const admin = isAdmin(username, password);
  if (admin !== -1) {
    const courseIdx = COURSES.findIndex((course) => course.id === parseInt(courseId));
    if (courseIdx === -1) return res.sendStatus(404);
    const { title, description, price, imageLink, published } = req.body;
    COURSES[courseIdx] = {
      ...COURSES[courseIdx],
      title,
      description,
      price,
      imageLink,
      published
    }
    res.status(200).json({ message: "Course updated successfullt" });
  }
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
  const { username, password } = req.headers;
  const admin = isAdmin(username, password);
  if (admin !== -1) return res.status(200).json({ courses: COURSES });
  return res.sendStatus(401);
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const { username, password } = req.body;
  const newUser = {
    username,
    password,
    purchasedCourses: []
  }
  USERS.push(newUser);
  return res.status(200).json({ message: "User created successfully" });

});

app.post('/users/login', (req, res) => {
  // logic to log in user
  const { username, password } = req.headers;
  const user = isUser(username, password);
  if (user !== -1) return res.status(200).json({ message: "Logged in successfully" });
  return res.sendStatus(404);
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
  const { username, password } = req.headers;
  const user = isUser(username, password);
  if (user !== -1) return res.status(200).json({ courses: COURSES });
  return res.sendStatus(401);
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
  const { username, password } = req.headers;
  const { courseId } = req.params;
  const user = isUser(username, password);
  const courseIdx = COURSES.find(course => course.id === parseInt(courseId));
  if (user !== -1 && courseIdx !== -1) {
    USERS[user].purchasedCourses.push(parseInt(courseId));
    return res.status(200).json({ message: "Course purchased successfully" });
  }
  return res.sendStatus(401);
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
  const { username, password } = req.headers;
  const user = isUser(username, password);
  if (user !== -1) {
    const courseIds = USERS[user].purchasedCourses;
    const courses = COURSES.filter((course) => courseIds.includes(course.id));
    return res.status(200).json({ purchasedCourses: courses });
  }
  res.sendStatus(401);
});

app.use("*", (req, res) => {
  return res.status(404).json({ message: "Route not found" });
})

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
