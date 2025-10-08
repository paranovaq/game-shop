import './App.css';
import ClientAPI from "./api/services";
import Table from "./Table";
import Form from "./Form";
import { useState } from "react";

const initialClients = ClientAPI.all();

function App() {

  const [clients, setClients] = useState(initialClients);

  const delCli = (id) => {
    if (ClientAPI.delete(id)) {
      setClients(clients.filter((client) => client.id !== id));
    }
  };

  const addClient = (client) => {
    const newClient = ClientAPI.add(client);
    if(newClient) {
      setClients([...clients, newClient]);
    }
  }

  return (
    <div className="App">
      <Form handleSubmit={addClient} inClient={{name: "", surname: "", phone: ""}}/>
      <Table clients={clients} delClient={delCli} />
    </div>
  );
}

export default App;
