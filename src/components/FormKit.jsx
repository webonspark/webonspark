import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { whatsappLink } from '../config';

export function Field({ label, name, form, type = 'text', as, options, placeholder, required, col = 12, rows = 4, autoComplete }) {
  const { values, errors, onChange } = form;
  const id = `f-${name}`;
  return (
    <Col md={col}>
      <Form.Group controlId={id}>
        <Form.Label>
          {label} {required && <span className="req" aria-hidden="true">*</span>}
        </Form.Label>
        {options ? (
          <Form.Select name={name} value={values[name] ?? ''} onChange={onChange} isInvalid={!!errors[name]} required={required}>
            <option value="">Select…</option>
            {options.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </Form.Select>
        ) : (
          <Form.Control
            name={name}
            type={type}
            as={as}
            rows={as === 'textarea' ? rows : undefined}
            value={values[name] ?? ''}
            onChange={onChange}
            placeholder={placeholder}
            isInvalid={!!errors[name]}
            required={required}
            maxLength={as === 'textarea' ? 1500 : 150}
            autoComplete={autoComplete}
          />
        )}
        <Form.Control.Feedback type="invalid">{errors[name]}</Form.Control.Feedback>
      </Form.Group>
    </Col>
  );
}

/** Hidden anti-bot field */
export function Honeypot({ form }) {
  return (
    <div className="hp-field" aria-hidden="true">
      <label htmlFor="f-website">Website</label>
      <input id="f-website" name="website" tabIndex={-1} autoComplete="off" value={form.values.website} onChange={form.onChange} />
    </div>
  );
}

export function FormStatus({ status, successTitle = 'Thank you!', successText }) {
  if (status.state === 'success') {
    return (
      <div className="form-success" role="status">
        <strong>{successTitle}</strong>
        <p className="mb-0">{successText || 'We have received your details and will get back to you within one working day.'}</p>
      </div>
    );
  }
  if (status.state === 'error' && status.msg) {
    return (
      <div className="form-error" role="alert">
        {status.msg}{' '}
        <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">WhatsApp us</a>
      </div>
    );
  }
  return null;
}

export function SubmitButton({ status, children = 'Submit', className = '' }) {
  return (
    <button type="submit" className={`btn btn-accent btn-lg ${className}`} disabled={status.state === 'sending'}>
      {status.state === 'sending' ? 'Sending…' : children}
    </button>
  );
}

export { Row, Form };
