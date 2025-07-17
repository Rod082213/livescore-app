// src/components/contact/ContactEmailTemplate.tsx

import * as React from 'react';

interface ContactEmailTemplateProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const ContactEmailTemplate: React.FC<Readonly<ContactEmailTemplateProps>> = ({
  name,
  email,
  subject,
  message,
}) => (
  <div>
    <h1>New Contact Form Submission: {subject}</h1>
    <p>You have received a new message from your website's contact form.</p>
    <hr />
    <h2>Message Details:</h2>
    <ul>
      <li><strong>From:</strong> {name}</li>
      <li><strong>Email:</strong> {email}</li>
    </ul>
    <hr />
    <h2>Message:</h2>
    <p>{message}</p>
  </div>
);