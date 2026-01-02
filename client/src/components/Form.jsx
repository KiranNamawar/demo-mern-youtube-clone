import { useMemo, useState } from "react";
import z from "zod";
import api from "../lib/api";
import ErrorCodes from "../lib/error-codes";
import Button from "./Button";
import FormField from "./FormField";

function Form({
  fields,
  schema,
  submitPath,
  onSuccess,
  onError,
  submitButtonTitle,
  submitButtonIcon,
  disableSubmit,
}) {
  const defaultFormValues = useMemo(
    () => Object.fromEntries(fields.map((f) => [f.name, f.defaultValue])),
    [fields]
  );
  const [formValues, setFormValues] = useState(defaultFormValues);
  const [formErrors, setFormErrors] = useState({});

  function handleChange(name, value) {
    setFormValues((prev) => ({ ...prev, [name]: value }));

    // clear field errors on change
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  }

  async function handleSubmit(evt) {
    evt.preventDefault();

    // client-side validation
    const result = schema.safeParse(formValues);
    if (!result.success) {
      const error = z.treeifyError(result.error);
      setFormErrors(error.properties ?? {});
      return;
    }

    // send to server
    try {
      const response = await api.post(submitPath, result.data);
      setFormErrors({});
      onSuccess(response.data.data);
    } catch (err) {
      if (err.response) {
        const { code, error } = err.response.data;

        // handle server side validation errors
        if (code === ErrorCodes.VALIDATION_ERROR) {
          setFormErrors(err.response.data.errors);
          return;
        }

        onError(code, error);
      } else {
        onError(ErrorCodes.NETWORK_ERROR, err.message);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {fields.map(({ name, type, onInput }) => (
        <FormField
          key={name}
          name={name}
          type={type}
          value={formValues[name]}
          onChange={handleChange}
          errors={formErrors[name]?.errors}
          onInput={onInput}
        />
      ))}
      <Button
        type="submit"
        disabled={disableSubmit}
        title={submitButtonTitle}
        Icon={submitButtonIcon}
      />
    </form>
  );
}

export default Form;
