export default function ErrorMessage({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <p className="text-gray-600 max-w-md">{typeof message === 'string' ? message : 'An error occurred. Please try again.'}</p>
      {onRetry && (
        <button onClick={onRetry} className="px-5 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
          Try Again
        </button>
      )}
    </div>
  );
}
