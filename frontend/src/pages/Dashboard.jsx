import { useEffect, useState } from 'react';
import API from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({ members: 0, attendance: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const members = await API.get('/Members');
      const attendance = await API.get('/Attendance');
      setStats({ members: members.data.length, attendance: attendance.data.length });
    };
    fetchStats();
  }, []);

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <div className="stats">
        <div className="stat-card">
          <h3>{stats.members}</h3>
          <p>Total Members</p>
        </div>
        <div className="stat-card">
          <h3>{stats.attendance}</h3>
          <p>Attendance Records</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;