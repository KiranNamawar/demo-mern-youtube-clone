import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";

function FormField({
  name,
  type,
  value,
  onChange,
  errors,
  placeholder,
  required,
  onInput = () => {},
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === "password" && showPassword ? "text" : type;
  return (
    <div
      key={name}
      className="border border-fg/20 rounded-xl px-4 py-2 flex flex-col gap-2"
    >
      <label htmlFor={name} className="font-semibold text-xl text-fg/90">
        {name}
        {!required && (
          <span className="text-fg/50 ml-1 font-thin">(optional)</span>
        )}
      </label>
      <div className="flex items-center w-full">
        <input
          id={name}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(evt) => onChange(name, evt.target.value)}
          onInput={onInput}
          className="w-full focus:outline-0"
          autoComplete="off"
        />
        {type === "password" && (
          <button type="button" onClick={() => setShowPassword((v) => !v)}>
            {showPassword ? <EyeClosed /> : <Eye />}
          </button>
        )}
      </div>
      {errors && (
        <div className="text-red-400">
          {errors.map((err) => (
            <p key={err}>{err}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default FormField;
