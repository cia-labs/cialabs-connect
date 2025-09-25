import DirectionalTextAnimation from './DirectionalTextAnimation'
import React from 'react'

const textsToAnimate = [
  "CIA Labs",
  "Redefining Engineering",
  "By the Students, For the Students",
];

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const ContactForm = () => {
  return (
    <>
      <div className="mt-10">
        <DirectionalTextAnimation texts={textsToAnimate} />
      </div>
      <div>
        
      </div>
    </>
  );
};

export default ContactForm;