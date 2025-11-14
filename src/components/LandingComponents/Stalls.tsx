'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function StallRegistration() {
  const [form, setForm] = useState({
    full_name: '',
    usn_roll: '',
    year_of_study: '',
    department: '',
    email: '',
    phone_number: '',
    hosting_type: '',
    team_size: '',
    stall_name: '',
    category: [] ,
    category_other: '',
    description: '',
    req_tables: false,
    req_electricity: false,
    req_other: '',
  });

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      if (name === 'category') {
        if (checked) {
          setForm({ ...form, category: [...form.category, value] });
        } else {
          setForm({ ...form, category: form.category.filter((c) => c !== value) });
        }
      } else {
        setForm({ ...form, [name]: checked });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const submitForm = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('stalls').insert([
      {
        full_name: form.full_name,
        usn_roll: form.usn_roll,
        year_of_study: Number(form.year_of_study),
        department: form.department,
        email: form.email,
        phone_number: form.phone_number,
        hosting_type: form.hosting_type,
        team_size: form.team_size ? Number(form.team_size) : null,
        stall_name: form.stall_name,
        category: [...form.category, form.category_other].filter(Boolean),
        description: form.description,
        req_tables: form.req_tables,
        req_electricity: form.req_electricity,
        req_other: form.req_other,
      },
    ]);

    setLoading(false);

    if (error) {
      console.log("SUPABASE ERROR:", error);
      alert(error.message);
      return;
    }

    setSuccess(true);
    setForm({
      full_name: '',
      usn_roll: '',
      year_of_study: '',
      department: '',
      email: '',
      phone_number: '',
      hosting_type: '',
      team_size: '',
      stall_name: '',
      category: [],
      category_other: '',
      description: '',
      req_tables: false,
      req_electricity: false,
      req_other: '',
    });
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16 flex justify-center">
      <div className="bg-[#0a0a0a] border border-green-900/40 p-10 rounded-3xl shadow-[0_0_20px_rgba(0,255,150,0.15)] w-full max-w-3xl">
        
        <h1 className="text-3xl font-bold text-center text-green-400 mb-6">
          Stall Registration
        </h1>

        <p className="text-gray-400 text-sm mb-8 text-center">
          Atria students only. Submission does not guarantee stall confirmation.
        </p>

        {success && (
          <div className="bg-green-500 text-black p-3 rounded-xl text-center font-semibold mb-4">
            Stall Registration Submitted Successfully! 🎉
          </div>
        )}

        <form onSubmit={submitForm} className="space-y-8">
          
          <h2 className="text-xl font-semibold text-green-300">Section 1: Contact Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input field="full_name" label="Full Name" value={form.full_name} onChange={handleChange} />
            <Input field="usn_roll" label="USN / Roll Number" value={form.usn_roll} onChange={handleChange} />

            <Select
              field="year_of_study"
              label="Year of Study"
              value={form.year_of_study}
              onChange={handleChange}
              options={[
                { value: "1", label: "1st" },
                { value: "2", label: "2nd" },
                { value: "3", label: "3rd" },
                { value: "4", label: "4th" },
              ]}
            />

            <Input field="department" label="Department" value={form.department} onChange={handleChange} />
            <Input field="email" label="Email" value={form.email} onChange={handleChange} />
            <Input field="phone_number" label="Phone Number" value={form.phone_number} onChange={handleChange} />
          </div>

          <Select
            field="hosting_type"
            label="Are you hosting solo or with a team?"
            value={form.hosting_type}
            onChange={handleChange}
            options={[
              { value: "Solo", label: "Solo" },
              { value: "Team", label: "With a team" },
            ]}
          />

          {form.hosting_type === "Team" && (
            <Input
              field="team_size"
              label="Team Size (max 5)"
              value={form.team_size}
              onChange={handleChange}
              type="number"
            />
          )}

          <h2 className="text-xl font-semibold text-green-300 mt-10">Section 2: Stall Details</h2>

          <Input field="stall_name" label="Stall Name (optional)" value={form.stall_name} onChange={handleChange} />

          <div>
            <label className="block mb-2 text-gray-300 font-medium">Category (Select all that apply)</label>

            {["Food/Beverage", "Games/Interactive", "Art/Crafts", "Merchandise/Clothes"].map((cat) => (
              <div key={cat} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  name="category"
                  value={cat}
                  checked={form.category.includes(cat)}
                  onChange={handleChange}
                  className="mr-3"
                />
                <span>{cat}</span>
              </div>
            ))}

            <div className="flex items-center mt-3">
              <input type="checkbox" name="category" value="Other" onChange={handleChange} className="mr-3" />
              <span>Others:</span>
            </div>

            <input
              type="text"
              name="category_other"
              value={form.category_other}
              onChange={handleChange}
              placeholder="Specify if Others"
              className="w-full p-3 mt-3 bg-black border border-green-700 rounded-xl"
            />
          </div>

          <Textarea field="description" label="Brief Description of What You'll Showcase/Sell" value={form.description} onChange={handleChange} />

          <div>
            <label className="block mb-2 text-gray-300 font-medium">Requirements</label>

            <div className="flex items-center mb-2">
              <input type="checkbox" name="req_tables" checked={form.req_tables} onChange={handleChange} className="mr-3" />
              <span>Tables</span>
            </div>

            <div className="flex items-center mb-2">
              <input type="checkbox" name="req_electricity" checked={form.req_electricity} onChange={handleChange} className="mr-3" />
              <span>Electricity Sockets</span>
            </div>

            <input
              type="text"
              name="req_other"
              value={form.req_other}
              onChange={handleChange}
              placeholder="Other requirements"
              className="w-full p-3 bg-black border border-green-700 rounded-xl mt-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-black py-3 rounded-xl font-semibold hover:bg-green-600 transition"
          >
            {loading ? "Submitting..." : "Submit Stall Registration"}
          </button>

        </form>
      </div>
    </div>
  );
}

function Input({ field, label, value, onChange, type = "text" }: any) {
  return (
    <div>
      <label className="block mb-1 text-gray-300">{label}</label>
      <input
        type={type}
        name={field}
        value={value}
        onChange={onChange}
        className="w-full p-3 bg-black border border-green-700 rounded-xl text-white"
      />
    </div>
  );
}

function Textarea({ field, label, value, onChange }: any) {
  return (
    <div>
      <label className="block mb-1 text-gray-300">{label}</label>
      <textarea
        name={field}
        value={value}
        onChange={onChange}
        className="w-full p-3 bg-black border border-green-700 rounded-xl text-white h-28"
      ></textarea>
    </div>
  );
}

function Select({ field, label, value, onChange, options }: any) {
  return (
    <div>
      <label className="block mb-1 text-gray-300">{label}</label>
      <select
        name={field}
        value={value}
        onChange={onChange}
        className="w-full p-3 bg-black border border-green-700 rounded-xl"
      >
        <option value="">Select</option>
        {options.map((o: any) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}    

