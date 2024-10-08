import { useEffect, useState } from "react";
import { Button, EditableText, InputGroup, Toaster } from "@blueprintjs/core";
import "./App.css";

const AppToaster = Toaster.create({
  position: "top",
});

function App() {
  const [users, setUsers] = useState([]);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newWebsite, setNewWebsite] = useState("");

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

  function onChangeHandler(id, key, value) {
    setUsers((users) =>
      users.map((user) =>
        user.id === id ? { ...user, [key]: value } : user
      )
    );
  }

  function handleUpdate(id) {
    const user = users.find((user) => user.id === id);
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then(() => {
        AppToaster.show({
          message: "User updated successfully",
          intent: "success",
          timeout: 3000,
        });
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        AppToaster.show({
          message: "Failed to update user",
          intent: "danger",
          timeout: 3000,
        });
      });
  }

  function handleDelete(id) {
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setUsers((users) => users.filter((user) => user.id !== id));
        AppToaster.show({
          message: "User deleted successfully",
          intent: "success",
          timeout: 3000,
        });
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
        AppToaster.show({
          message: "Failed to delete user",
          intent: "danger",
          timeout: 3000,
        });
      });
  }

  return (
    <div className="App">
      <table className="bp4-html-table modifier">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Website</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>
                <EditableText
                  onChange={(value) =>
                    onChangeHandler(user.id, "email", value)
                  }
                  value={user.email}
                />
              </td>
              <td>
                <EditableText
                  onChange={(value) =>
                    onChangeHandler(user.id, "website", value)
                  }
                  value={user.website}
                />
              </td>
              <td>
                <Button onClick={() => handleUpdate(user.id)} intent="primary">
                  Update
                </Button>
                &nbsp;
                <Button onClick={() => handleDelete(user.id)} intent="danger">
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td>
              <InputGroup
                placeholder="Enter your name..."
                onChange={(e) => setNewName(e.target.value)}
                value={newName}
              />
            </td>
            <td>
              <InputGroup
                placeholder="Enter your email..."
                onChange={(e) => setNewEmail(e.target.value)}
                value={newEmail}
              />
            </td>
            <td>
              <InputGroup
                placeholder="Enter your website..."
                onChange={(e) => setNewWebsite(e.target.value)}
                value={newWebsite}
              />
            </td>
            <td>
              <Button intent="success" onClick={addUser}>
                Add User
              </Button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default App;
