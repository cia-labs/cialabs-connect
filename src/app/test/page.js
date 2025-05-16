"use client"
import React, { useState } from 'react';

export default function UserForm() {
    const [form, setForm] = useState({
        UID: '',
        DisplayName: '',
        AuthType: '',
        hobbies: '',
        profile_url: '',
        rewards: '',
        pp_i: ''
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if any field is empty
        for (const key in form) {
            if (form[key].toString().trim() === '') {
                alert('Please fill all fields.');
                return;
            }
        }

        // Prepare data with correct types
        const data = {
            UID: form.UID,
            DisplayName: form.DisplayName,
            AuthType: form.AuthType,
            hobbies: form.hobbies,
            profile_url: form.profile_url,
            rewards: Number(form.rewards),
            pp_i: Number(form.pp_i),
        };

        try {
            const res = await fetch('/api/labs/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Network response was not ok');
            alert('User submitted!');
        } catch (err) {
            console.log(err)
            alert('Submission failed.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className=' text-white w-screen h-screen flex flex-col justify-center items-center'>
            <label>
                UID:
                <input name="UID" value={form.UID} onChange={handleChange} />
            </label>
            <br />
            <label>
                DisplayName:
                <input name="DisplayName" value={form.DisplayName} onChange={handleChange} />
            </label>
            <br />
            <label>
                AuthType:
                <input name="AuthType" value={form.AuthType} onChange={handleChange} />
            </label>
            <br />
            <label>
                hobbies:
                <input name="hobbies" value={form.hobbies} onChange={handleChange} />
            </label>
            <br />
            <label>
                profile_url:
                <input name="profile_url" value={form.profile_url} onChange={handleChange} />
            </label>
            <br />
            <label>
                rewards:
                <input name="rewards" value={form.rewards} onChange={handleChange} />
            </label>
            <br />
            <label>
                pp_i:
                <input name="pp_i" value={form.pp_i} onChange={handleChange} />
            </label>
            <br />
            <button className=' border-white border-2' type="submit">Submit</button>
        </form>
    );
}
