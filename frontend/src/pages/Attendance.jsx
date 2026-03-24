import { useEffect, useState } from 'react';
import API from '../services/api';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');

  useEffect(() => {
    fetchAttendance();
    fetchMembers();
  }, []);

  const fetchAttendance = async () => {
    const { data } = await API.get('/Attendance');
    setAttendance(data);
  };

  const fetchMembers = async () => {
    const { data } = await API.get('/Members');
    setMembers(data);
  };

  const checkIn = async () => {
    if (!selectedMember) return;
    await API.post('/Attendance', { memberId: selectedMember });
    fetchAttendance();
  };

  const checkOut = async (id) => {
    await API.put(`/Attendance/checkout/${id}`);
    fetchAttendance();
  };

  return (
    <div className="container">
      <h1>Attendance</h1>
      <div className="card">
        <h2>Check In</h2>
        <div className="flex gap-4 items-center">
          <select onChange={(e) => setSelectedMember(e.target.value)} value={selectedMember}>
            <option value="">Select Member</option>
            {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
          </select>
          <button className="btn btn-success" onClick={checkIn}>Check In</button>
        </div>
      </div>
      <div className="card">
        <h2>Attendance Records</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map(record => (
              <tr key={record._id}>
                <td>{record.member?.name}</td>
                <td>{new Date(record.checkIn).toLocaleString()}</td>
                <td>{record.checkOut ? new Date(record.checkOut).toLocaleString() : 'Not checked out'}</td>
                <td>
                  {!record.checkOut && <button className="btn btn-primary" onClick={() => checkOut(record._id)}>Check Out</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;