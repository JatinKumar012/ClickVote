import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import socketIOClient from "socket.io-client";
import { useRef } from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route, 
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import AdminPanel from "./components/AdminPanel";
import Register from "./components/RegisterPage";

function App() {
  const {user, logout, login, setUser} = useContext(AuthContext);
  const [votes, setVotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState({
    show: false, 
    message: "", 
    type: "info",
  });
  const socketRef = useRef();
   
  const socket = socketIOClient(process.env.REACT_APP_API, {
    transports : ["websocket"],
    withCredentials : true,
  });

  
  
  const fetchVotes = async() => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API}/api/votes`);
          if(!response.ok) throw new Error("Failed to fetch votes");
          const data = await response.json();
          setVotes(data);
            } catch (error) {
               setError(error?.message);
            } finally {
              setIsLoading(false);
        }
  }
  
  useEffect(() => {
   fetchVotes();
   socket.on("voteUpdated", (updatedVote) => {
    setVotes((prev) => 
      prev.map((v) => v?._id === updatedVote?._id ? updatedVote : v));
    showNotification("Vote Update!", "info");
   });

   socket.on("voteCreated", (newVote) => {
    setVotes((prev) => 
    [...prev, newVote]);
      showNotification("New vote added!", "success");
   });

   socket.on("voteDeleted", (voteId) => {
    setVotes((prev) => 
    prev.filter((item) => item._id !== voteId));
      showNotification("Vote deleted", "success");
   });
    
   return () => {
    socket.off("voteUpdated") 
    socket.off("voteCreated")
    socket.off("voteDeleted")
   };
  },[]);

  const showNotification = (message, type) => {
     setNotification({show : true, message, type});
     setTimeout(() => setNotification({...notification, show: false}),3000);
  };

  if(isLoading) return <div className="loading">Loading...</div>
  return (
    <Router>
      <div className="app-container">
        <Header
        user={user} 
        logout={logout} 
        showNotification={showNotification}
        />

        <main className="main-content">
         <Routes>
          <Route path="/" element={
            <HomePage
               votes={votes}
               error={error}
               user={user}
               setUser={setUser}
               setVotes={setVotes}
               showNotification={showNotification}
             />
           }
          />

          <Route path="/login"
             element={
             user?.role ==="admin" ? 
            ( 
             <Navigate to="/admin"/> 
            ) 
            : 
            ( 
             user ? <Navigate to="/admin"/>: 
             <LoginPage 
             showNotification={showNotification}
             login = {login}
           />
            )
          }
          />
          
           <Route path="/register"
           element={
            user ? 
            ( 
            <Navigate to="/"/> 
            ) 
            : 
            (  
           <Register login = {login}
           showNotification={showNotification}
           />
            )
          }
          />
          {user?.role === "admin" && (
            <Route
              path="/admin"
              element={
              <AdminPanel 
              votes={votes}
              setVotes={setVotes}
              showNotification= {showNotification} />
            }
            />
          )
        }
         </Routes>
        </main>
        
        {
        (notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
          </div>
        ))
      }
      </div>
    </Router>
  );
}

export default App;
