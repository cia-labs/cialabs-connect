import React from 'react'
import ContactForm from '@/components/LandingComponents/ContactForm'
import { dividerClasses } from 'node_modules/@mui/material';
import NavBar from '@/components/LandingComponents/NavBar';

const ContactFormPage = () => {
  return (
    <div>
      <NavBar />
      <ContactForm />
    </div>
  );
};

export default ContactFormPage;