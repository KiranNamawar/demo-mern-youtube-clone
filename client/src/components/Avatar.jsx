import { useState } from "react";

function Icon({ src, alt, height, width, className }) {
  return (
    <div className={`flex items-center rounded-full ${className}`}>
      <img
        src={src}
        alt={alt}
        height={height ?? 25}
        width={width ?? 25}
        className=" rounded-full object-cover"
        onError={(evt) => {
          evt.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${alt}`;
        }}
      />
    </div>
  );
}

export default Icon;
