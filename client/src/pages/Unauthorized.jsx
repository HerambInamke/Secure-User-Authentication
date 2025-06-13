import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLock } from 'react-icons/fi';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light to-secondary-light p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-card text-center">
          <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiLock className="w-10 h-10 text-error" />
          </div>

          <h1 className="text-3xl font-bold text-dark mb-4">
            Access Denied
          </h1>

          <p className="text-gray-600 mb-8">
            You don't have permission to access this page. Please contact your administrator if you believe this is a mistake.
          </p>

          <div className="space-y-4">
            <button
              onClick={() => navigate(-1)}
              className="btn-secondary w-full"
            >
              Go Back
            </button>
            <button
              onClick={() => navigate('/')}
              className="btn-primary w-full"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Unauthorized; 