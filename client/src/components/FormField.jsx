import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";

function FormField({ name, type, value, onChange, errors }) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === "password" && showPassword ? "text" : type;
  return (
    <div key={name}>
      <label htmlFor={name}>{name}</label>
      <div className="flex items-center w-full">
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={(evt) => onChange(name, evt.target.value)}
          className="border w-full"
        />
        {type === "password" && (
          <button type="button" onClick={() => setShowPassword((v) => !v)}>
            {showPassword ? <EyeClosed /> : <Eye />}
          </button>
        )}
      </div>
      {errors && (
        <div>
          {errors.map((err) => (
            <p key={err}>{err}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default FormField;
