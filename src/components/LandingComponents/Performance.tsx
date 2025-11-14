'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "" ;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function PerformanceRegistration() {
  const [form, setForm] = useState({
    full_name: '',
    usn_roll: '',
    year_of_study: '',
    department: '',
    email: '',
    phone_number: '',
    performance_type: '',
    team_size: '',
    performance_description: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitForm = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('performances').insert([
      {
        full_name: form.full_name,
        usn_roll: form.usn_roll,
        year_of_study: Number(form.year_of_study),
        department: form.department,
        email: form.email,
        phone_number: form.phone_number,
        performance_type: form.performance_type,
        team_size: form.team_size ? Number(form.team_size) : 1,
        performance_description: form.performance_description,
      },
    ]);

    setLoading(false);

    if (!error) {
      setSuccess(true);
      setForm({
        full_name: '',
        usn_roll: '',
        year_of_study: '',
        department: '',
        email: '',
        phone_number: '',
        performance_type: '',
        team_size: '',
        performance_description: '',
      });
    } else {
      alert('Error submitting form');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16 flex justify-center">
      <div className="bg-[#0a0a0a] border border-green-900/40 p-10 rounded-3xl shadow-[0_0_20px_rgba(0,255,150,0.15)] w-full max-w-2xl">
        
        <h1 className="text-3xl font-bold text-center text-green-400 mb-6">
          Performance Registration
        </h1>

        <p className="text-gray-400 text-sm mb-8 text-center">
          Atria students only. Submission does not guarantee selection.
        </p>

        {success && (
          <div className="bg-green-500 text-black p-3 rounded-xl text-center font-semibold mb-4">
            Registration submitted successfully! 🎉
          </div>
        )}

        <form onSubmit={submitForm} className="space-y-5">

          {/* Full Name */}
          <div>
            <label className="block mb-1 text-gray-300">Full Name</label>
            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
              className="w-full p-3 bg-black border border-green-700 rounded-xl text-white"
            />
          </div>

          {/* USN */}
          <div>
            <label className="block mb-1 text-gray-300">USN / Roll Number</label>
            <input
              type="text"
              name="usn_roll"
              value={form.usn_roll}
              onChange={handleChange}
              required
              className="w-full p-3 bg-black border border-green-700 rounded-xl"
            />
          </div>

          {/* Year */}
          <div>
            <label className="block mb-1 text-gray-300">Year of Study</label>
            <select
              name="year_of_study"
              value={form.year_of_study}
              onChange={handleChange}
              required
              className="w-full p-3 bg-black border border-green-700 rounded-xl"
            >
              <option value="">Select</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="block mb-1 text-gray-300">Department</label>
            <input
              type="text"
              name="department"
              value={form.department}
              onChange={handleChange}
              required
              className="w-full p-3 bg-black border border-green-700 rounded-xl"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-3 bg-black border border-green-700 rounded-xl"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-1 text-gray-300">Phone Number</label>
            <input
              type="text"
              name="phone_number"
              value={form.phone_number}
              onChange={handleChange}
              required
              className="w-full p-3 bg-black border border-green-700 rounded-xl"
            />
          </div>

          {/* Solo or Team */}
          <div>
            <label className="block mb-1 text-gray-300">Performing</label>
            <select
              name="performance_type"
              value={form.performance_type}
              onChange={handleChange}
              required
              className="w-full p-3 bg-black border border-green-700 rounded-xl"
            >
              <option value="">Select</option>
              <option value="Solo">Solo</option>
              <option value="Team/Band">Team / Band</option>
            </select>
          </div>

          {/* Team Size */}
          {form.performance_type === 'Team/Band' && (
            <div>
              <label className="block mb-1 text-gray-300">Team Size</label>
              <input
                type="number"
                name="team_size"
                value={form.team_size}
                onChange={handleChange}
                className="w-full p-3 bg-black border border-green-700 rounded-xl"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block mb-1 text-gray-300">What are you performing?</label>
            <textarea
              name="performance_description"
              value={form.performance_description}
              onChange={handleChange}
              required
              className="w-full p-3 bg-black border border-green-700 rounded-xl h-28"
            ></textarea>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-black py-3 rounded-xl font-semibold hover:bg-green-600 transition"
          >
            {loading ? 'Submitting...' : 'Submit Registration'}
          </button>
        </form>
      </div>
    </div>
  );
}
