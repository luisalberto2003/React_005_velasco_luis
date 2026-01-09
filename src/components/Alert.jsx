export const Alert = ({ type, message, onClose }) => {
  if (!message) return null;
  const colors = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
  };

  return (
    <div className={`fixed top-5 right-5 border p-4 rounded shadow-lg z-50 ${colors[type]}`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 font-bold">&times;</button>
    </div>
  );
};