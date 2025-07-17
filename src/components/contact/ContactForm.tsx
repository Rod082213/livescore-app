// src/components/contact/ContactForm.tsx

"use client";

import { useState, FormEvent } from "react";
import { Loader2, Send } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isError, setIsError] = useState(false); // To track if the message is an error

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage('');
    setIsError(false);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message.');
      }

      setStatusMessage("Thank you! Your message has been sent successfully.");
      setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
    
    } catch (error) {
      setStatusMessage("Sorry, there was an error sending your message. Please try again.");
      setIsError(true);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="bg-[#2b3341] p-6 rounded-lg">
      <h2 className="text-xl font-bold text-white mb-4">Send us a Message</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ... your input fields remain exactly the same ... */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
            <input type="text" name="name" id="name" required value={formData.name} onChange={handleInputChange} className="w-full bg-[#1d222d] border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
            <input type="email" name="email" id="email" required value={formData.email} onChange={handleInputChange} className="w-full bg-[#1d222d] border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
          <input type="text" name="subject" id="subject" required value={formData.subject} onChange={handleInputChange} className="w-full bg-[#1d222d] border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
          <textarea name="message" id="message" required rows={5} value={formData.message} onChange={handleInputChange} className="w-full bg-[#1d222d] border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
        </div>
        <div>
          <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:bg-blue-800 disabled:cursor-not-allowed">
            {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Sending...</> : <><Send className="mr-2 h-5 w-5" />Send Message</>}
          </button>
        </div>
        {statusMessage && (
          // Use different text color for success vs. error
          <p className={`text-center text-sm ${isError ? 'text-red-400' : 'text-green-400'}`}>
            {statusMessage}
          </p>
        )}
      </form>
    </div>
  );
}