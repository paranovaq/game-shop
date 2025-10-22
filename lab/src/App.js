import './App.css';
import ClientAPI from "./api/services";
import Table from "./Table";
import Form from "./Form";
import { useState, useEffect } from "react";

const LOCAL_STORAGE_KEY = "clientList";

function App() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const storedClients = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedClients) {
      setClients(JSON.parse(storedClients));
    } else {
      const initialClients = ClientAPI.all();
      setClients(initialClients);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialClients));
    }
  }, []);

  const delCli = (id) => {
    if (ClientAPI.delete(id)) {
      const updatedClients = clients.filter((client) => client.id !== id);
      setClients(updatedClients);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedClients));
    }
  };

  const addClient = (client) => {
    const newClient = ClientAPI.add(client);
    if (newClient) {
      const updatedClients = [...clients, newClient];
      setClients(updatedClients);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedClients));
    }
  };

  return (
    <div className="App">
      <Form handleSubmit={addClient} inClient={{ name: "", surname: "", phone: "" }} />
      <Table clients={clients} delClient={delCli} />
    </div>
  );
}

export default App;
