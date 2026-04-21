import React, { useState } from 'react';

const UserAvatar = ({ src, name, className = "" }) => {
  const [imgError, setImgError] = useState(false);
  
  // Default image based on name initial or a standard placeholder
  const initial = name ? name.charAt(0).toUpperCase() : 'A';
  const colors = ['bg-primary', 'bg-secondary-fixed', 'bg-blue-500', 'bg-purple-500', 'bg-emerald-500'];
  const bgColor = colors[initial.charCodeAt(0) % colors.length];

  if (!src || imgError) {
    return (
      <div className={`flex items-center justify-center text-white font-bold font-headline select-none ${bgColor} ${className}`}>
        {initial}
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={name} 
      className={`object-cover ${className}`} 
      onError={() => setImgError(true)}
      referrerPolicy="no-referrer"
    />
  );
};

export default UserAvatar;
