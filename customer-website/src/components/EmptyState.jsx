import { Link } from 'react-router-dom';

export default function EmptyState({ icon, title = 'Nothing here yet', message = '', actionLabel, actionTo }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      {icon ? (
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-3xl">{icon}</div>
      ) : (
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {message && <p className="text-gray-500 max-w-md">{message}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="mt-2 px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
