let reminders = [
  {
    id: 1,
    title: "Comprar leche",
    description: "Supermercado",
    dueDate: "2026-01-07T18:00",
    priority: "MEDIUM",
    status: "PENDING",
  },
]

const delay = (ms = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms))

const response = (data) => ({ data })

const mockReminderService = {
  async getAll() {
    await delay()
    return response([...reminders])
  },

  async create(reminder) {
    await delay()
    const newReminder = {
      ...reminder,
      id: Date.now(),
    }
    reminders.push(newReminder)
    return response(newReminder)
  },

  async update(id, reminder) {
    await delay()
    reminders = reminders.map((r) =>
      r.id === id ? { ...r, ...reminder } : r
    )
    return response(reminder)
  },

  async delete(id) {
    await delay()
    reminders = reminders.filter((r) => r.id !== id)
    return response(null)
  },
}

export default mockReminderService