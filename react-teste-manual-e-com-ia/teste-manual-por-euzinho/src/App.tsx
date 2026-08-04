import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import About from "./pages/about/About";
import UserForm from "./pages/user-form/UserForm";
import UserList from "./pages/user-list/UserList";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="content">
        <Routes>
          <Route path="/" element={<Navigate to="/about" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/users/new" element={<UserForm />} />
          <Route path="/users/:id/edit" element={<UserForm />} />
          <Route path="*" element={<Navigate to="/about" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
