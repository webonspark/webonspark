import { useState } from 'react';
import { submitForm, validate } from './submitForm';

/**
 * useFormState — tiny form hook with validation + submission to Sheet/Email.
 */
export function useFormState(formType, initial, rules, onDone) {
  const [values, setValues] = useState({ website: '', ...initial });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ state: 'idle', msg: '' });

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((v) => ({ ...v, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(values, rules);
    setErrors(errs);
    if (Object.keys(errs).length) {
      setStatus({ state: 'error', msg: 'Please correct the highlighted fields.' });
      return;
    }
    setStatus({ state: 'sending', msg: '' });
    try {
      await submitForm(formType, values);
      setStatus({ state: 'success', msg: '' });
      onDone?.(values);
      setValues({ website: '', ...initial });
    } catch (err) {
      setStatus({ state: 'error', msg: err.message || 'Something went wrong. Please try WhatsApp.' });
    }
  };

  return { values, setValues, errors, status, onChange, onSubmit, setStatus };
}

