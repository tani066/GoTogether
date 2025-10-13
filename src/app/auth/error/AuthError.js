'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function AuthError() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  let errorMessage = 'An error occurred during authentication';
  
  if (error === 'AccessDenied') {
    errorMessage = 'Access denied. You may not have permission to access this resource.';
  } else if (error === 'Configuration') {
    errorMessage = 'There is a problem with the server configuration.';
  } else if (error === 'Verification') {
    errorMessage = 'The verification token has expired or has already been used.';
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-md">
        <h1 className="mb-4 text-center text-2xl font-bold text-red-600">Authentication Error</h1>
        <div className="mb-6 rounded-md bg-red-50 p-4 text-red-800">
          <p>{errorMessage}</p>
          <p className="mt-2 text-sm text-gray-600">{error}</p>
        </div>
        <div className="flex justify-center space-x-4">
          <Button
            onClick={() => router.push('/')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Return to Home
          </Button>
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="border-gray-300 hover:bg-gray-100"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}