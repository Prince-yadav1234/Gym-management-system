import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/Login');
  };

  return (
    <nav>
      <div className="nav-links">
        <Link to="/">Dashboard</Link>
        <Link to="/Members">Members</Link>
        <Link to="/Attendance">Attendance</Link>
      </div>
      {user && (
        <div className="user-info">
          <span>Hello, {user.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;