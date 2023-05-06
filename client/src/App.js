import './App.css';
// import Form2 from './components/form/Form2';
import UserForm from './components/UserForm/UserForm';
import UserList from './components/UserList/UserList';
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* <Route path="/form" element={<Form2/>} /> */}
          <Route path="/" element={<UserForm/>} />

          <Route path="/users" element={<UserList />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
