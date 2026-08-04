import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import About from './pages/About';
import UserForm from './pages/UserForm';
import UserList from './pages/UserList';
import './App.css';

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
