import React, { useState, useEffect } from 'react';
import { ClipboardList, CheckCircle, Clock, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const StaffHub = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', category: 'Admin' });

  useEffect(() => {
    fetchTasks();
    
    // Real-time subscription
    const subscription = supabase
      .channel('staff_tasks_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'staff_tasks' }, () => {
        fetchTasks();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('staff_tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setTasks(data);
    setLoading(false);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    const { data: hostels } = await supabase.from('hostels').select('id').eq('prefix', 'HH').single();

    const { error } = await supabase
      .from('staff_tasks')
      .insert([{
        hostel_id: hostels?.id,
        ...newTask,
        status: 'Pending'
      }]);

    if (!error) {
      setShowAddForm(false);
      setNewTask({ title: '', description: '', category: 'Admin' });
    }
  };

  const toggleStatus = async (task) => {
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    await supabase
      .from('staff_tasks')
      .update({ status: newStatus })
      .eq('id', task.id);
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    await supabase.from('staff_tasks').delete().eq('id', id);
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Maintenance': return '#EF4444';
      case 'Cleaning': return '#3B82F6';
      case 'Guest Request': return '#F59E0B';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div className="glass-panel" style={{ marginTop: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h2 className="heading-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ClipboardList size={24} color="var(--primary)" /> Staff Coordination Hub
          </h2>
          <p className="text-muted">Track hostel tasks and maintenance issues.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={18} /> {showAddForm ? 'Cancel' : 'New Task'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddTask} style={{ backgroundColor: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', border: '1px solid var(--border)' }}>
          <div className="input-group">
            <label>Task Title</label>
            <input 
              className="input-field" 
              value={newTask.title} 
              onChange={e => setNewTask({...newTask, title: e.target.value})} 
              required 
              placeholder="e.g., Fix leaking tap in 4B"
            />
          </div>
          <div className="grid-2" style={{ marginTop: '1rem' }}>
            <div className="input-group">
              <label>Category</label>
              <select 
                className="input-field" 
                value={newTask.category} 
                onChange={e => setNewTask({...newTask, category: e.target.value})}
              >
                <option value="Admin">Admin</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Guest Request">Guest Request</option>
              </select>
            </div>
            <div className="input-group">
              <label>Description (Optional)</label>
              <input 
                className="input-field" 
                value={newTask.description} 
                onChange={e => setNewTask({...newTask, description: e.target.value})} 
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>Add Task</button>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {loading && tasks.length === 0 ? (
          <p className="text-muted" style={{ textAlign: 'center', padding: '2rem' }}>Syncing tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-muted" style={{ textAlign: 'center', padding: '2rem' }}>No active tasks. Good job team!</p>
        ) : (
          tasks.map(task => (
            <div key={task.id} style={{ 
              padding: '1rem', 
              backgroundColor: task.status === 'Completed' ? 'rgba(16, 185, 129, 0.05)' : 'var(--surface-hover)', 
              borderRadius: 'var(--radius-sm)', 
              border: `1px solid ${task.status === 'Completed' ? 'var(--secondary)' : 'var(--border)'}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              opacity: task.status === 'Completed' ? 0.7 : 1
            }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button 
                  onClick={() => toggleStatus(task)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    color: task.status === 'Completed' ? 'var(--secondary)' : 'var(--text-muted)' 
                  }}
                >
                  {task.status === 'Completed' ? <CheckCircle size={24} /> : <Clock size={24} />}
                </button>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h3 style={{ 
                      fontWeight: 600, 
                      textDecoration: task.status === 'Completed' ? 'line-through' : 'none',
                      fontSize: '1rem'
                    }}>
                      {task.title}
                    </h3>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: 700, 
                      color: 'white', 
                      backgroundColor: getCategoryColor(task.category),
                      padding: '0.1rem 0.4rem',
                      borderRadius: '0.25rem',
                      textTransform: 'uppercase'
                    }}>
                      {task.category}
                    </span>
                  </div>
                  {task.description && <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{task.description}</p>}
                </div>
              </div>
              <button onClick={() => deleteTask(task.id)} className="btn" style={{ padding: '0.5rem', color: 'var(--text-muted)' }}>
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StaffHub;
