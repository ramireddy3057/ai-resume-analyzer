import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Result from './pages/Result'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </BrowserRouter>
  )
}



// //import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
// import { Routes, Route, Link } from "react-router-dom";
// import { useState } from "react";
// import axios from "axios";
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// function Home() {
//   return <h1>Home</h1>;
// }

// function Login() {
//   return <h1>Login</h1>;
// }

// function Dashboard() {
//   const navigate = useNavigate();
//   const logout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   return (
//     <div>
//       <h1>Dashboard</h1>
//       <button onClick={logout}>
//         Logout
//       </button>

//     </div>
//   );
// }

// function App() {
//   const [users, setUsers] = useState([]);
//   const [name, setName] = useState("");
//   const [role, setRole] = useState("");
//   const [score, setScore] = useState("");
//   const [email, setEmail] = useState("");
//   // const [password, setPassword] = useState("");
//   const [editId, setEditId] = useState(null);
//   const [resume, setResume] = useState(null);
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();
//   const [resumeText, setResumeText] = useState("");
//   const [analysis, setAnalysis] = useState(null);
//   const [jobDescription, setJobDescription] = useState("");
//   const addUser = async () => {
//   await axios.post("http://localhost:5000/add-user", {
//     name,
//     role,
//     score
//   });
//   alert("User Added");
//   };

//   const fetchUsers = async () => {
//     const response = await axios.get("http://localhost:5000/users");
//     setUsers(response.data);
//   };
//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const deleteUser = async (id) => {
//   await axios.delete(`http://localhost:5000/delete-user/${id}`);
//   fetchUsers();
//   };

//   const updateUser = async () => {
//   await axios.put(
//     `http://localhost:5000/update-user/${editId}`,
//     {
//       name,
//       role,
//       score
//     }
//   );
//   fetchUsers();
//   setName("");
//   setRole("");
//   setScore("");
//   setEditId(null);
//   };

//   const editUser = (user) => {
//   setName(user.name);
//   setRole(user.role);
//   setScore(user.score);
//   setEditId(user._id);
//   };

//   const signup = async () => {
//     await axios.post("http://localhost:5000/signup", {
//       name,
//       email,
//       password,
//       role,
//       score

//     });
//     alert("Signup Successful");
//     };

//   const login = async () => {
//       const response = await axios.post(
//         "http://localhost:5000/login",
//       {
//         email,
//         password
//       }
//     );

//     //alert(response.data.message);
//     console.log(response.data);

//     alert(response.data.message);
//     if (response.data.message === "Login Successful") {
//     localStorage.setItem(
//       "token",
//       response.data.token
//     );
//     navigate("/dashboard");
//     }
//   };

//   const getProfile = async () => {
//   try {
//     const token = localStorage.getItem("token");
//     const response = await axios.get(
//       "http://localhost:5000/profile",

//       {
//         headers: {
//           authorization: token
//         }
//       }
//     );
//     console.log(response.data);
//     alert(response.data.message);
//   }
//   catch (error) {
//     console.log(error);
//     alert("Error Fetching Profile");

//   }
//   };


//   const uploadResume = async () => {
//   const formData = new FormData();
//   formData.append(
//     "resume",
//     resume
//   );
//   try {
//     const response = await axios.post(
//       "http://localhost:5000/upload-resume",
//       formData
//     );
//     console.log(response.data);
//     alert(response.data.message);
//   }
//   catch (error) {
//     console.log(error);
//     alert("Upload Failed");
//   }
//   };


  


//   const parseResume = async () => {
//   const formData = new FormData();
//   formData.append("resume", resume);
//   const response = await axios.post(
//     "http://localhost:5000/parse-resume",
//     formData
//   );
//   console.log(response.data);
//   setResumeText(response.data.text);
//   };


//   const analyzeResume = async () => {
//   const formData = new FormData();
//   const jdText =req.body.jobDescription.toLowerCase();
//   formData.append("resume", resume);
//   formData.append(
//     "jobDescription",
//     jobDescription
//   );
//   const response = await axios.post(
//     "http://localhost:5000/analyze-resume",
//     formData
//   );
//   console.log(response.data);
//   setAnalysis(response.data);
//   };


//   return (

//     <div>
//         <h1 className="text-5xl font-bold text-blue-600">
//           AI Resume Analyzer
//         </h1>
//         <nav>

//           <Link to="/">Home </Link>
//           <Link to="/login"> Login </Link>
//           <Link to="/dashboard"> Dashboard </Link>

//         </nav>
        
//         <Routes>

//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route
//             path="/dashboard"
//             element={
//               localStorage.getItem("token")
//                 ? <Dashboard />
//                 : <Login />
//             }
//           />

//         </Routes>

//       <h2>Add User</h2>

//       <input
//         type="text"
//         placeholder="Enter Name"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       />
//       <br /><br />

//       <input
//         type="text"
//         placeholder="Enter Role"
//         value={role}
//         onChange={(e) => setRole(e.target.value)}
//       />
//       <br /><br />

//       <input
//         type="number"
//         placeholder="Enter Score"
//         value={score}
//         onChange={(e) => setScore(e.target.value)}
//       />
//       <br /><br />

//       <input
//         type="email"
//         placeholder="Enter Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <br /><br />

//       <input
//         type="password"
//         placeholder="Enter Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <br /><br />


//       <input
//         type="file"
//         onChange={(e) => setResume(e.target.files[0])}
//       />
//       <br /><br />
      
//       <textarea
//         placeholder="Paste Job Description"
//         rows="10"
//         cols="50"
//         value={jobDescription}
//         onChange={(e) => setJobDescription(e.target.value)}
//       ></textarea>

//       w<br /><br />

//       <button onClick={addUser}>Add User</button>
//       <br /><br />

//       <button onClick={updateUser}>Update User</button>
//       <br /><br />
//       <button onClick={signup}>Signup</button>
//       <br /><br />
//       <button onClick={login}>Login</button>
//       <br /><br />
//       <button onClick={getProfile}>Get Profile</button>
//       <br /><br />
//       <button onClick={uploadResume}>Upload Resume</button>
//       <br /><br />
//       <button onClick={getProfile}>Get Profile</button>
//       <button onClick={parseResume}>Parse Resume</button>
//       <h2>Parsed Resume</h2>

//       <pre>{resumeText}</pre>
//       <br /><br />
//       <button onClick={analyzeResume}>Analyze Resume</button>
//       {
//         users.map((user) => (

//           <div key={user._id}>
//             <h3>{user.name}</h3>
//             <p>{user.role}</p>
//             <p>{user.score}</p>
//             <hr />
//             <br /><br />
//             <button onClick={() => editUser(user)}>Edit</button>
//           </div>

//         ))
//       }

//       <h3>{name}</h3>
//       <h3>{role}</h3>
//       <h3>{score}</h3>
//       {
//         analysis && (

//           <div>

//             <h2>
//               Match Score: {analysis.score}%
//             </h2>

//             <h3>Matched Skills</h3>

//             {
//               analysis.matchedSkills.map((skill) => (

//                 <p key={skill}>{skill}</p>

//               ))
//             }

//             <h3>Missing Skills</h3>

//             {
//               analysis.missingSkills.map((skill) => (


//                 <p key={skill}>{skill}</p>

//               ))
//             }

//           </div>

//         )
//       }
//     </div>

//   );
// }

// export default App;