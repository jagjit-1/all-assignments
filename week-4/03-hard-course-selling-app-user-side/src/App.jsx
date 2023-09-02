import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import AllCourses from "./components/AllCourses";
import PurchasedCourses from "./components/PurchasedCourses";
import Login from "./components/Login";
import Register from "./components/Register";
import CourseDetails from "./components/CourseDetails";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" Component={<></>} />
        <Route path="/courses" Component={<AllCourses />} />
        <Route path="/courses/purchased" Component={<PurchasedCourses />} />
        <Route path="/courses/:id" Component={<CourseDetails />} />
        <Route path="/login" Component={<Login />} />
        <Route path="signup" Component={<Register />} />
      </Routes>
    </Router>
  )
}

export default App
