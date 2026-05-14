import React, { useState, useEffect } from 'react';
import { ClipboardList, CheckCircle, Clock, Plus, Trash2, History, ListTodo } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const StaffHub = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'history'
  const [newTask, setNewTask] = useState({ title: '', description: '', category: 'Admin' });

  useEffect(() => {
    fetchTasks();
    
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
    const isCompleting = task.status !== 'Completed';
    const newStatus = isCompleting ? 'Completed' : 'Pending';
    
    await supabase
      .from('staff_tasks')
      .update({ 
        status: newStatus,
        completed_at: isCompleting ? new Date().toISOString() : null
      })
      .eq('id', task.id);
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task permanently?')) return;
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

  const filteredTasks = tasks.filter(t => 
    activeTab === 'active' ? t.status !== 'Completed' : t.status === 'Completed'
  );

  return (
    <div className="glass-panel" style={{ marginTop: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h2 className="heading-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ClipboardList size={24} color="var(--primary)" /> Staff Coordination Hub
          </h2>
          <p className="text-muted">Manage hostel tasks and operational history.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={18} /> {showAddForm ? 'Cancel' : 'New Task'}
        </button>
      </div>

      {/* Internal Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
        <button 
          onClick={() => setActiveTab('active')}
          style={{ 
            background: 'none', border: 'none', color: activeTab === 'active' ? 'var(--primary)' : 'var(--text-muted)', 
            fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0'
          }}
        >
          <ListTodo size={18} /> Active Tasks ({tasks.filter(t => t.status !== 'Completed').length})
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          style={{ 
            background: 'none', border: 'none', color: activeTab === 'history' ? 'var(--primary)' : 'var(--text-muted)', 
            fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0'
          }}
        >
          <History size={18} /> History
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
              <select className="input-field" value={newTask.category} onChange={e => setNewTask({...newTask, category: e.target.value})}>
                <option value="Admin">Admin</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Guest Request">Guest Request</option>
              </select>
            </div>
            <div className="input-group">
              <label>Description</label>
              <input className="input-field" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>Add Task</button>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {loading && filteredTasks.length === 0 ? (
          <p className="text-muted" style={{ textAlign: 'center', padding: '2rem' }}>Syncing...</p>
        ) : filteredTasks.length === 0 ? (
          <p className="text-muted" style={{ textAlign: 'center', padding: '2rem' }}>
            {activeTab === 'active' ? "No active tasks. Everything is clean and working!" : "No history found yet."}
          </p>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} style={{ 
              padding: '1rem', 
              backgroundColor: 'var(--surface)', 
              borderRadius: 'var(--radius-sm)', 
              border: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
                <div style={{ 
                  width: '4px', 
                  height: '40px', 
                  backgroundColor: getCategoryColor(task.category), 
                  borderRadius: '2px' 
                }}></div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h3 style={{ fontWeight: 600, fontSize: '1rem' }}>{task.title}</h3>
                    <span style={{ 
                      fontSize: '0.6rem', fontWeight: 800, color: 'white', 
                      backgroundColor: getCategoryColor(task.category),
                      padding: '0.1rem 0.4rem', borderRadius: '0.25rem', textTransform: 'uppercase'
                    }}>
                      {task.category}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    {activeTab === 'active' 
                      ? `Added ${new Date(task.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                      : `Completed ${new Date(task.completed_at).toLocaleDateString()}`
                    }
                    {task.description && ` • ${task.description}`}
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => toggleStatus(task)}
                  className="btn" 
                  style={{ 
                    padding: '0.4rem 0.8rem', 
                    fontSize: '0.75rem', 
                    backgroundColor: task.status === 'Completed' ? 'var(--surface-hover)' : 'rgba(16, 185, 129, 0.1)',
                    color: task.status === 'Completed' ? 'var(--text-muted)' : 'var(--secondary)',
                    border: `1px solid ${task.status === 'Completed' ? 'var(--border)' : 'var(--secondary)'}`
                  }}
                >
                  {task.status === 'Completed' ? 'Re-open' : 'Complete'}
                </button>
                {activeTab === 'history' && (
                  <button onClick={() => deleteTask(task.id)} className="btn" style={{ padding: '0.5rem', color: 'var(--text-muted)' }}>
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StaffHub;
