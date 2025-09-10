import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      const { data } = await api.get(`/api/auth/verify-email/${token}`);
      setStatus('success');
      setMessage(data.message);
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Verification failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body text-center">
          {status === 'loading' && (
            <>
              <div className="flex justify-center mb-4">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
              <h2 className="text-xl font-semibold">Verifying your email...</h2>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="flex justify-center mb-4">
                <CheckCircleIcon className="w-16 h-16 text-success" />
              </div>
              <h2 className="text-xl font-semibold text-success">Email Verified!</h2>
              <p className="mt-2">{message}</p>
              <Link to="/login" className="btn btn-primary mt-4">
                Go to Login
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="flex justify-center mb-4">
                <XCircleIcon className="w-16 h-16 text-error" />
              </div>
              <h2 className="text-xl font-semibold text-error">Verification Failed</h2>
              <p className="mt-2">{message}</p>
              <Link to="/register" className="btn btn-primary mt-4">
                Back to Register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;              