import { useState, useEffect } from 'react';
import { reminderService } from './services/api';
/*import reminderService from './services/local';*/
import { LoadingSpinner } from './components/LoadingSpinner';
import { Alert } from './components/Alert';
import { ReminderForm } from './components/ReminderForm';

function App() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [modal, setModal] = useState({ open: false, data: null });
  const [searchTerm, setSearchTerm] = useState('');

  // 1. FUNCIÓN PARA ALERTAS CON AUTO-CIERRE (5 SEGUNDOS)
  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert({ type: '', message: '' });
    }, 5000); // 5000ms = 5 segundos
  };

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const { data } = await reminderService.getAll();
      setReminders(data);
    } catch (err) {
      showAlert('error', 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReminders(); }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return fetchReminders();
    setLoading(true);
    try {
      const { data } = await reminderService.searchByTitle(searchTerm);
      setReminders(data);
    } catch (err) {
      showAlert('error', 'No se encontraron resultados');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      // 2. LÓGICA DE FECHA: Conversión a ISO para el servidor
      const dataToSend = {
        ...formData,
        due_at: new Date(formData.due_at).toISOString() 
      };

      if (modal.data) {
        await reminderService.update(modal.data.id, dataToSend);
      } else { 
        await reminderService.create(dataToSend);
      }

      showAlert('success', '¡Guardado correctamente!');
      setModal({ open: false, data: null });
      fetchReminders();
    } catch (err) {
      console.error("Error técnico:", err);
      showAlert('error', 'Error al procesar la solicitud');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este recordatorio?")) {
      try {
        await reminderService.delete(id);
        showAlert('success', 'Eliminado correctamente');
        fetchReminders();
      } catch (err) {
        showAlert('error', 'No se pudo eliminar');
      }
    }
  };

  const getTemporalStatus = (r) => {
    const now = new Date();
    const due = new Date(r.due_at);
    const diff = (due - now) / (1000 * 60 * 60 * 24);
    if (r.status === 'PENDING' && due < now) return { label: 'Vencido', color: 'text-red-600' };
    if (r.status === 'PENDING' && diff <= 7) return { label: 'Próximo', color: 'text-yellow-600' };
    return { label: 'Normal', color: 'text-gray-600' };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Alert {...alert} onClose={() => setAlert({ ...alert, message: '' })} />
      
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-lg shadow-sm gap-4">
        <h1 className="text-2xl font-bold text-indigo-700">Sistema de Recordatorios</h1>
        
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Buscar por título..." 
            className="border p-2 rounded-lg flex-1 md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300">🔍</button>
        </form>

        <button 
          onClick={() => setModal({ open: true, data: null })}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 w-full md:w-auto"
        >
          + Nuevo Recordatorio
        </button>
      </header>

      {loading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-4">Alerta</th>
                <th className="p-4">Título</th>
                <th className="p-4">Descripción</th>
                <th className="p-4">Vencimiento</th>
                <th className="p-4">Prioridad</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reminders.length === 0 ? (
                <tr><td colSpan="7" className="p-10 text-center text-gray-500">No hay recordatorios. ¡Crea el primero!</td></tr>
              ) : (
                reminders.map(r => {
                  const temp = getTemporalStatus(r);
                  return (
                    <tr key={r.id} className="border-t hover:bg-gray-50">
                      <td className={`p-4 font-bold text-xs ${temp.color}`}>{temp.label}</td>
                      <td className="p-4 font-medium">{r.title}</td>
                      <td className="p-4 text-gray-500 text-sm truncate max-w-[150px]">{r.description || '-'}</td>
                      <td className="p-4 text-sm">{new Date(r.due_at).toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                          r.priority === 'HIGH' ? 'bg-red-100 text-red-800' : 
                          r.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {r.priority}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-xs font-semibold text-gray-600">{r.status}</span>
                      </td>
                      <td className="p-4 flex gap-3">
                        <button onClick={() => setModal({ open: true, data: r })} className="text-blue-600">✎</button>
                        <button onClick={() => handleDelete(r.id)} className="text-red-600">✕</button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {modal.open && (
        <ReminderForm 
          reminder={modal.data} 
          onCancel={() => setModal({ open: false, data: null })}
          onSubmit={handleSave}
        />
      )}
    </div>
  );
}

export default App;