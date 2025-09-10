const LoadingSpinner = ({ size = 'lg', message = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col justify-center items-center p-8">
      {/* Custom BatchHub themed spinner */}
      <div className="relative">
        {/* Outer ring with gradient */}
        <div className={`${sizeClasses[size]} rounded-full border-4 border-transparent bg-gradient-to-r from-primary via-secondary to-accent bg-clip-border animate-spin`}>
          <div className="w-full h-full rounded-full bg-base-100"></div>
        </div>
        
        {/* Inner logo/icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-primary font-bold text-xs">
            {size === 'xl' ? 'BH' : size === 'lg' ? 'B' : '•'}
          </div>
        </div>
      </div>

      {/* Loading message */}
      <div className="mt-4 text-center">
        <p className="text-sm text-base-content/70 animate-pulse">
          {message}
        </p>
        <div className="flex items-center justify-center gap-1 mt-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;