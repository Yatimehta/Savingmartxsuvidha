'use client';

import React from 'react';

export default function GlobalError({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="min-h-screen flex items-center justify-center bg-gray-50 p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-200 shadow-xl text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Application Error</h2>
          <p className="text-xs text-gray-500">
            A critical error occurred, but the server is running. Click below to reload.
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-2.5 rounded-xl bg-green-800 text-white text-xs font-bold transition-all shadow-md"
          >
            Reload Platform
          </button>
        </div>
      </body>
    </html>
  );
}
