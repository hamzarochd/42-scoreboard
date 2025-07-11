import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

/**
 * 404 Not Found page
 */
export function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <AlertTriangle className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Home className="w-5 h-5" />
          <span>Go back home</span>
        </Link>
      </div>
    </div>
  );
}
