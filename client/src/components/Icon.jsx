import { useState } from "react";

function Icon({ src, alt, FallbackIcon, className }) {
  const [err, setErr] = useState(false);
  return (
    <div className={`flex items-center rounded-full ${className}`}>
      {src && !err ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full rounded-full object-cover"
          onError={(evt) => setErr(true)}
        />
      ) : (
        <FallbackIcon className="w-full h-full" />
      )}
    </div>
  );
}

export default Icon;
