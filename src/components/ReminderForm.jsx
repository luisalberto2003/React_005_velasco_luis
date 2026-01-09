import { useState, useEffect } from 'react';

export const ReminderForm = ({ reminder, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '', description: '', due_at: '', priority: 'MEDIUM', status: 'PENDING'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (reminder) {
      // Formatear fecha para el input datetime-local
      const date = new Date(reminder.due_at).toISOString().slice(0, 16);
      setFormData({ ...reminder, due_at: date });
    }
  }, [reminder]);

  const validate = () => {
    const e = {};
    if (formData.title.length < 3 || formData.title.length > 80) e.title = "Título inválido (3-80 carac.)";
    if (!formData.due_at) e.due_at = "Fecha requerida";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{reminder ? 'Editar' : 'Nuevo'} Recordatorio</h2>
        
        <input 
          className="w-full p-2 border rounded mb-2"
          placeholder="Título"
          value={formData.title}
          onChange={e => setFormData({...formData, title: e.target.value})}
        />
        {errors.title && <p className="text-red-500 text-xs mb-2">{errors.title}</p>}

        <textarea 
          className="w-full p-2 border rounded mb-2"
          placeholder="Descripción (opcional)"
          value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})}
        />

        <input 
          type="datetime-local"
          className="w-full p-2 border rounded mb-4"
          value={formData.due_at}
          onChange={e => setFormData({...formData, due_at: e.target.value})}
        />

        <div className="flex gap-2 mb-4">
          <select className="flex-1 p-2 border rounded" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
            <option value="LOW">Baja</option>
            <option value="MEDIUM">Media</option>
            <option value="HIGH">Alta</option>
          </select>
          <select className="flex-1 p-2 border rounded" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
            <option value="PENDING">Pendiente</option>
            <option value="DONE">Completado</option>
            <option value="CANCELED">Cancelado</option>
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded font-bold">Guardar</button>
        </div>
      </form>
    </div>
  );
};