import React, { useState, useEffect } from 'react';
import { loadRecaptcha } from "../utils/loadRecaptcha";


const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState({ submitting: false, message: '' });

  useEffect(() => {
    // Load reCAPTCHA when component mounts
    if (window.grecaptcha) {
      window.grecaptcha.ready(() => {
        console.log('reCAPTCHA ready');
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, message: '' });

    try {
      // ✅ Get reCAPTCHA token
      const token = await window.grecaptcha.execute('6LeCInMrAAAAAHglmr3VEUVNd_jL00YaU7WvYi7x', { action: 'submit' });

      const response = await fetch('https://darshboard.com/wp-json/custom-form/v1/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, recaptchaToken: token }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus({ submitting: false, message: '✅ Thank you! We\'ll contact you shortly' });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus({ submitting: false, message: `❌ ${result.message}` });
      }
    } catch (error) {
      console.error('❌ Form submit error:', error);
      setStatus({ submitting: false, message: '❌ Something went wrong. Try again.' });
    }
  };

  return (
    <div className="comm_inner d_flex flex_column no_gap">
      <div className="stack_titlebar d_flex flex_column align_center">
        <div className="stack_top_head d_flex justify_center align_center">
          <span className="top_icon line_none">
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5625vw" height="1.5625vw" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--global-palette2)' }}>
              <path fill="currentColor" d="M6.96 2c.418 0 .756.31.756.692V4.09c.67-.012 1.422-.012 2.268-.012h4.032c.846 0 1.597 0 2.268.012V2.692c0-.382.338-.692.756-.692s.756.31.756.692V4.15c1.45.106 2.403.368 3.103 1.008.7.641.985 1.513 1.101 2.842v1H2V8c.116-1.329.401-2.2 1.101-2.842.7-.64 1.652-.902 3.103-1.008V2.692c0-.382.339-.692.756-.692z" />
              <path fill="currentColor" d="M22 14v-2c0-.839-.013-2.335-.026-3H2.006c-.013.665 0 2.161 0 3v2c0 3.771 0 5.657 1.17 6.828C4.349 22 6.234 22 10.004 22h4c3.77 0 5.654 0 6.826-1.172C22 19.657 22 17.771 22 14z" opacity=".5" />
              <path fill="currentColor" fillRule="evenodd" d="M16 13.25a.75.75 0 0 1 .75.75v1.25H18a.75.75 0 0 1 0 1.5h-1.25V18a.75.75 0 0 1-1.5 0v-1.25H14a.75.75 0 0 1 0-1.5h1.25V14a.75.75 0 0 1 .75-.75z" clipRule="evenodd" />
            </svg>
          </span>
          <p className="stack_top_para mb_0">Let's Work Together</p>
        </div>
      </div>
      <div className="stack_icon_list">
   <form
  className="contact-form flex_column d_flex"
  onFocus={loadRecaptcha}
  onMouseEnter={loadRecaptcha}
  onSubmit={(e) => {
    loadRecaptcha();
    handleSubmit(e);
  }}
>

          <input
            type="text"
            className="d_mail_box"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            className="d_mail_box"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            className="d_mail_box"
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
          />
          <button className="comm-btn" type="submit" disabled={status.submitting}>
            {status.submitting ? 'Sending...' : 'Schedule Call'}
          </button>
          {status.message && <p>{status.message}</p>}
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
