const API_BASE_URL = '/api/v1';
// Helper para manejar respuestas
const handleResponse = async (response) => {
  if (response.status === 204) {
    return { data: null };
  }

  const data = await response.json();

  if (!response.ok) {
    throw {
      response: {
        status: response.status,
        data: data,
      },
    };
  }

  return { data };
};

// Helper para hacer peticiones
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    if (error.response) {
      throw error;
    }
    throw {
      response: {
        status: 500,
        data: { message: 'Error de conexión con el servidor' },
      },
    };
  }
};

// Servicio de Recordatorios
export const reminderService = {
  // Obtener todos los recordatorios
  getAll: () => request('/reminders'),
  
  // Obtener un recordatorio por ID
  getById: (id) => request(`/reminders/${id}`),
  
  // Crear un nuevo recordatorio
  create: (reminder) => request('/reminders', {
    method: 'POST',
    body: JSON.stringify(reminder)
  }),
  
  // Actualizar un recordatorio existente
  update: (id, reminder) => request(`/reminders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(reminder)
  }),
  
  // Eliminar un recordatorio
  delete: (id) => request(`/reminders/${id}`, {
    method: 'DELETE'
  }),
  
  // Filtrar por estado (PENDING, DONE, CANCELED)
  findByStatus: (status) => request(`/reminders/status/${status}`),
  
  // Filtrar por prioridad (LOW, MEDIUM, HIGH)
  findByPriority: (priority) => request(`/reminders/priority/${priority}`),
  
  // Buscar por título
  searchByTitle: (title) => request(`/reminders/search?title=${encodeURIComponent(title)}`),
};

export default { reminderService };