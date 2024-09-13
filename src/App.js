import { useEffect, useState } from "react";
import { Button, EditableText ,InputGroup,Toaster } from "@blueprintjs/core";
import "./App.css";
const AppToaster =Toaster.create({
  position:"top"
})
function App() {
  const [users, setUsers] = useState([]);


  const [newName,setNewName]=useState("");
  const [newEmail,setNewEmail]=useState("");
  const [newWebsite,setNewWebsite]=useState("");
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((json) => {
        setUsers(json);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);
  function addUser() {
    const name = newName.trim();
    const email = newEmail.trim();
    const website = newWebsite.trim();
  
    if (name && email && website) {
      fetch("https://jsonplaceholder.typicode.com/users", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          website,
        }),
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUsers([...users, data]);
          AppToaster.show({
            message: "User added successfully",
            intent: "success",
            timeout: 3000,
          });
          setNewEmail("");
          setNewName("");
          setNewWebsite("");
        })
        .catch((error) => {
          console.error("Error adding user:", error);
          AppToaster.show({
            message: "Failed to add user",
            intent: "danger",
            timeout: 3000,
          });
        });
    }
  }
  
  return (
    <div className="App">
      <table className="bp4-html-table modifier">
        <thead>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Website</th>
          <th>Action</th>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td><EditableText value={user.email}></EditableText></td>
              <td><EditableText value={user.website}></EditableText></td>
              <td>
                <Button intent="primary">Update</Button>
                <Button intent="danger">Delete</Button>
                </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td>
              <InputGroup placeholder="Enter your name..." onChange={(e)=>{setNewName(e.target.value)}}value={newName}></InputGroup>
            </td>
            <td>
              <InputGroup placeholder="Enter your mail..." onChange={(e)=>{setNewEmail(e.target.value)}}value={newEmail}></InputGroup>
            </td>
            <td>
              <InputGroup placeholder="Enter your website..." onChange={(e)=>{setNewWebsite(e.target.value)}}value={newWebsite}></InputGroup>
            </td>
            <td><Button intent="success" onClick={addUser}>Add User</Button></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default App;
