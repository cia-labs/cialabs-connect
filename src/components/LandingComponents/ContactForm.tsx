"use client";

import DirectionalTextAnimation from "./DirectionalTextAnimation";
import React from "react";

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

const ContactForm: React.FC = () => {
  const [formData, setFormData] = React.useState<FormData>({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = React.useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = React.useState<
    "idle" | "success" | "error"
  >("idle");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // API endpoint
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", message: "" }); // Reset form
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-black">
        <DirectionalTextAnimation texts={textsToAnimate} />

        {/* Contact Form */}
        <div className="flex items-center justify-center p-4">
          <div className="w-full max-w-md min-h-screen">
            <form
              onSubmit={handleSubmit}
              className="bg-black border-2 border-green-400/30 rounded-3xl p-8 space-y-6"
            >
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-white text-lg font-bold mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your Name"
                  className={`w-full px-4 py-3 bg-gray-800 text-white placeholder-gray-400 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all duration-300 ${
                    errors.name ? "ring-2 ring-red-400" : ""
                  }`}
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-2">{errors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-white text-lg font-bold mb-3"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter Your Email"
                  className={`w-full px-4 py-3 bg-gray-800 text-white placeholder-gray-400 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all duration-300 ${
                    errors.email ? "ring-2 ring-red-400" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-2">{errors.email}</p>
                )}
              </div>

              {/* Message Field */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-white text-lg font-bold mb-3"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Any Query related CIA LABS..."
                  rows={4}
                  className={`w-full px-4 py-3 bg-gray-800 text-white placeholder-gray-400 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-green-400/50 resize-none transition-all duration-300 ${
                    errors.message ? "ring-2 ring-red-400" : ""
                  }`}
                />
                {errors.message && (
                  <p className="text-red-400 text-sm mt-2">{errors.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-transparent border-2 border-green-400/60 text-white font-bold text-lg rounded-xl hover:bg-slate-400/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>

              {/* Status Messages */}
              {submitStatus === "success" && (
                <div className="text-white text-center mt-4">
                  Message sent successfully! We will get back to you soon.
                </div>
              )}
              {submitStatus === "error" && (
                <div className="text-red-400 text-center mt-4">
                  Failed to send message. Please try again.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactForm;
