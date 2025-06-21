export const InfoField = ({ label, value, statusColor }) => {
  let colorClass = 'text-gray-800';
  if (statusColor) {
    switch (statusColor) {
      case 'Registered':
      case 'New':
        colorClass = 'text-blue-600';
        break;
      case 'In Progress':
        colorClass = 'text-yellow-600';
        break;
      case 'Resolved':
        colorClass = 'text-green-600';
        break;
      case 'Closed':
        colorClass = 'text-purple-600';
        break;
      case 'Rejected':
        colorClass = 'text-red-600';
        break;
      default:
        colorClass = 'text-gray-800';
    }
  }

  return (
    <div className="mb-3">
      <p className="text-gray-500 text-sm font-medium">{label}:</p>
      <p className={`text-base font-semibold ${colorClass}`}>{value || 'N/A'}</p>
    </div>
  );
};