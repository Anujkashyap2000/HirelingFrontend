import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); 
  const token = searchParams.get('token');

  useEffect(() => {
    const verify = async () => {
      try {
        await axios.post('http://localhost:8080/api/v1/users/verify-email', { token });
        setStatus('success');
      } catch (err) {
        setStatus('error');
      }
    };

    if (token) verify();
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center h-96">
      {status === 'loading' && <h2>Verifying... Please wait.</h2>}
      
      {status === 'success' && (
        <div className="text-green-600">
          <h2 className="text-2xl font-bold">✓ Email Verified!</h2>
          <p>You can now log in to your account.</p>
          <a href="/login" className="underline">Go to Login</a>
        </div>
      )}

      {status === 'error' && (
        <div className="text-red-600">
          <h2 className="text-2xl font-bold">✕ Verification Failed</h2>
          <p>The link is invalid or has expired.</p>
        </div>
      )}
    </div>
  );
};

export default VerifyEmailPage;