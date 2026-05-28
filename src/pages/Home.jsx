import axios from "axios";
import { useEffect, useState } from "react";

function Home() {

  const [users, setUsers] = useState([]);

  useEffect(() => {

    axios
      .get("http://localhost:5000/users")
      .then((response) => {

        console.log(response.data);

        setUsers(response.data);

      });

  }, []);

  return (

    <div>

      <h1>Users Data</h1>


      {
        users.map((user, index) => (

          <div key={index}>

            <h2>{user.name}</h2>

            <p>{user.role}</p>
            <p>ATS Score: {user.score}</p>
            {
              user.score > 80
                ? <h3>Excellent Resume</h3>
                : <h3>Needs Improvement</h3>
            }
          </div>
        ))
      }

    </div>

  );
}

export default Home;