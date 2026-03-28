import React from 'react'

type LoaderProps = {
  message?: string;
  subMessage?: string;
}

const Loader = ({ message = "Loading...", subMessage }: LoaderProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen gap-3">
      <div
        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status">
        <span
          className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
        >Loading...</span>
      </div>
      
      {message && (
        <p className="text-lg font-medium mt-2">{message}</p>
      )}
      
      {subMessage && (
        <p className="text-sm text-gray-500 max-w-md text-center px-4">{subMessage}</p>
      )}
    </div>
  );
}

export default Loader