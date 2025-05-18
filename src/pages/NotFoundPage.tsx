import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="max-w-md mx-auto text-center py-16">
      <MapPin className="h-24 w-24 text-gray-300 mx-auto mb-6" />
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-gray-600 text-lg mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/" className="btn btn-primary">
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;