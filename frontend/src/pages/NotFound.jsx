import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-5">
      <p className="font-display text-6xl font-bold text-primary mb-3">404</p>
      <h1 className="text-xl font-semibold text-ink mb-2">Page Not Found</h1>
      <p className="text-ink/60 mb-6 max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-primary">
        <Home className="h-4 w-4" /> Back to Home
      </Link>
    </div>
  );
}
