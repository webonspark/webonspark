import { useEffect } from 'react';
import { useFormState } from '../utils/useFormState';
import { Field, Honeypot, FormStatus, SubmitButton, Row, Form } from './FormKit';

const BUDGETS = ['Under ₹25,000', '₹25,000 – ₹75,000', '₹75,000 – ₹2,00,000', '₹2,00,000 – ₹5,00,000', 'Above ₹5,00,000', 'Not sure yet'];

/**
 * Enquiry form used at the end of every service/template page.
 * Sends: formType "Enquiry" → stored in the database (server/models/formSubmission.js).
 */
export default function EnquiryForm({ service, templates = [], selectedTemplate, serviceOptions }) {
  const form = useFormState(
    'Enquiry',
    { name: '', email: '', phone: '', city: '', service: service || '', template: '', budget: '', timeline: '', message: '' },
    { name: ['required'], email: ['required', 'email'], phone: ['required', 'phone'], service: ['required'] }
  );
  const { setValues } = form;

  useEffect(() => {
    if (selectedTemplate) setValues((v) => ({ ...v, template: selectedTemplate }));
  }, [selectedTemplate, setValues]);

  const templateOptions = templates.length ? [...templates, 'Custom design (not listed)'] : null;

  return (
    <Form noValidate onSubmit={form.onSubmit} className="enquiry-form">
      <Honeypot form={form} />
      <Row className="g-3">
        <Field form={form} name="name" label="Full name" required col={6} autoComplete="name" />
        <Field form={form} name="phone" label="Mobile / WhatsApp" type="tel" required col={6} autoComplete="tel" placeholder="10-digit number" />
        <Field form={form} name="email" label="Email" type="email" required col={6} autoComplete="email" />
        <Field form={form} name="city" label="City" col={6} autoComplete="address-level2" />
        {serviceOptions ? (
          <Field form={form} name="service" label="Service needed" options={serviceOptions} required col={6} />
        ) : (
          <Field form={form} name="service" label="Service" required col={6} />
        )}
        {templateOptions ? (
          <Field form={form} name="template" label="Preferred template" options={templateOptions} col={6} />
        ) : (
          <Field form={form} name="timeline" label="When do you want to start?" options={['Immediately', 'Within 1 month', '1–3 months', 'Just exploring']} col={6} />
        )}
        <Field form={form} name="budget" label="Approximate budget" options={BUDGETS} col={6} />
        {templateOptions && (
          <Field form={form} name="timeline" label="When do you want to start?" options={['Immediately', 'Within 1 month', '1–3 months', 'Just exploring']} col={6} />
        )}
        <Field form={form} name="message" label="Tell us about your project" as="textarea" col={12} rows={4} placeholder="Business name, must-have features, reference websites or apps…" />
      </Row>
      <div className="d-flex flex-column flex-sm-row align-items-sm-center gap-3 mt-4">
        <SubmitButton status={form.status}>Send enquiry</SubmitButton>
        <small className="text-muted">We reply within one working day. Your details stay private.</small>
      </div>
      <div className="mt-3">
        <FormStatus
          status={form.status}
          successTitle="Enquiry received 🎉"
          successText="Thanks for reaching out. Our team will call or WhatsApp you within one working day with next steps."
        />
      </div>
    </Form>
  );
}
