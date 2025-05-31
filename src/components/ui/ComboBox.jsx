import React, { useState } from "react";

// Single select ComboBox
const ComboBox = ({ options, placeholder = "Select an option", color, onSelect }) => {
    const [input, setInput] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    // If input has value, always use gray border
    const colorClass =
        input.trim().length > 0
            ? "border-gray-400"
            : {
                  "gray-400": "border-gray-400",
                  "red-500": "border-red-500",
              }[color] || "border-gray-400";

    return (
        <div className="relative w-full transition-all">
            <input
                type="text"
                value={input}
                placeholder={placeholder}
                onChange={(e) => {
                    setInput(e.target.value);
                    setIsOpen(true);
                }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full p-3 ${colorClass} border rounded-[7px] h-[6vh] transition-all focus:outline-none focus:ring-2 focus:ring-white`}
            />
            {isOpen && (
                <ul className="absolute transition-all z-10 mt-4 w-full p-3 border bg-[var(--bg-color)] border-gray-300 rounded-[7px] shadow-md max-h-48 overflow-y-auto">
                    {options
                        .filter((option) => option.toLowerCase().includes(input.toLowerCase()))
                        .map((option, index) => (
                            <li
                                key={index}
                                onClick={() => {
                                    setInput(option);
                                    setIsOpen(false);
                                    onSelect(option);
                                }}
                                className="p-2 transition-all hover:bg-blue-100 cursor-pointer"
                            >
                                {option}
                            </li>
                        ))}
                </ul>
            )}
        </div>
    );
};

// Multi select ComboBox
const MultiSelectComboBox = ({
    options,
    placeholder = "Select options",
    color,
    onSelect,
}) => {
    const [input, setInput] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState([]);

    const colorClass =
        input.trim().length > 0
            ? "border-gray-400"
            : {
                  "gray-400": "border-gray-400",
                  "red-500": "border-red-500",
              }[color] || "border-gray-400";

    const handleSelect = (option) => {
        if (!selected.includes(option)) {
            const newSelected = [...selected, option];
            setSelected(newSelected);
            onSelect && onSelect(newSelected);
        }
        setInput("");
        setIsOpen(false);
    };

    const handleRemove = (option) => {
        const newSelected = selected.filter((item) => item !== option);
        setSelected(newSelected);
        onSelect && onSelect(newSelected);
    };

    return (
        <div className="relative w-full transition-all">
            <div className={`flex flex-wrap gap-1 p-1 border ${colorClass} rounded-[7px] h-auto min-h-[6vh] transition-all`}>
                {selected.map((option, idx) => (
                    <span
                        key={option}
                        className="flex items-center bg-gray-900 text-white px-2 py-1 rounded mr-1 mb-1 text-sm"
                    >
                        {option}
                        <button
                            type="button"
                            className="ml-2 text-white hover:text-blue-700 focus:outline-none"
                            onClick={() => handleRemove(option)}
                        >
                            ×
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={input}
                    placeholder={selected.length === 0 ? placeholder : ""}
                    onChange={(e) => {
                        setInput(e.target.value);
                        setIsOpen(true);
                    }}
                    onClick={() => setIsOpen(true)}
                    className="flex-1 min-w-[100px] p-2 outline-none bg-transparent"
                />
               
            </div>
            {isOpen && (
                <ul className="absolute transition-all z-10 mt-2 w-full p-3 border bg-[var(--bg-color)] border-gray-300 rounded-[7px] shadow-md max-h-48 overflow-y-auto">
                    {options
                        .filter(
                            (option) =>
                                option.toLowerCase().includes(input.toLowerCase()) &&
                                !selected.includes(option)
                        )
                        .map((option, index) => (
                            <li
                                key={index}
                                onClick={() => handleSelect(option)}
                                className="p-2 transition-all hover:bg-blue-100 cursor-pointer"
                            >
                                {option}
                            </li>
                        ))}
                </ul>
            )}
        </div>
    );
};

export { ComboBox, MultiSelectComboBox };
