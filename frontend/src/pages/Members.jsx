import { useEffect, useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [membershipType, setMembershipType] = useState('basic');
  const { user } = useAuth();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const { data } = await API.get('/Members');
    setMembers(data);
  };

  const addMember = async (e) => {
    e.preventDefault();
    try {
      await API.post('/Members', { name, email, phone, membershipType });
      fetchMembers();
      setName(''); setEmail(''); setPhone('');
    } catch (err) {
      alert('Error adding member');
    }
  };

  const deleteMember = async (id) => {
    if (window.confirm('Are you sure?')) {
      await API.delete(`/Members/${id}`);
      fetchMembers();
    }
  };

  return (
    <div className="container">
      <h1>Members</h1>
      {user?.role === 'admin' && (
        <div className="card">
          <h2>Add New Member</h2>
          <form onSubmit={addMember}>
            <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <select value={membershipType} onChange={(e) => setMembershipType(e.target.value)}>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </select>
            <button type="submit" className="btn btn-primary">Add Member</button>
          </form>
        </div>
      )}
      <div className="card">
        <h2>All Members</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Membership</th>
              {user?.role === 'admin' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {members.map(m => (
              <tr key={m._id}>
                <td>{m.name}</td>
                <td>{m.email}</td>
                <td>{m.phone}</td>
                <td>{m.membershipType}</td>
                {user?.role === 'admin' && (
                  <td>
                    <button className="btn btn-danger" onClick={() => deleteMember(m._id)}>Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Members;