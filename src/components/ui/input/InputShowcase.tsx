"use client";

import { useState } from "react";
import { Input, InputPassword, Textarea } from "./index";
// import { Select } from "./Select";

export default function InputShowcase() {
  const [mockError, setMockError] = useState(true);

  return (
    <div className="max-w-md space-y-6 p-6 bg-gray-50 min-h-screen text-black">
      <h1 className="text-xl font-semibold">Input Test Showcase</h1>

      {/* Toggle Mock Error */}
      <button
        onClick={() => setMockError(!mockError)}
        className="px-4 py-2 bg-black text-white rounded-md text-sm"
      >
        Toggle Error
      </button>

      {/* Normal Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Normal</label>
        <Input placeholder="Place Holder" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Normal</label>
        <Input placeholder="Place Holder" disabled />
      </div>

      {/* Input with Error */}
      <div className="space-y-2">
        <label className="text-sm font-medium">With Error</label>
        <Input
          placeholder="Place Holder"
          error={mockError}
          errorMessage="This field is required"
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Password</label>
        <InputPassword
          placeholder="Enter password"
          error={mockError}
          errorMessage="Password must be 8 characters"
        />
      </div>
      {/* 
   
      <div className="space-y-2">
        <label className="text-sm font-medium">Dropdown</label>
        <Select>
          <option value="">Place Holder</option>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </Select>
      </div>

     
      <div className="space-y-2">
        <label className="text-sm font-medium">Date Picker</label>
        <Input type="date" error={mockError} />
      </div>*/}

      <div className="space-y-2">
        <label className="text-sm font-medium">Textarea</label>
        <Textarea
          placeholder="Place Holder"
          error={mockError}
          errorMessage="Password must be 8 characters"
        />
      </div>
    </div>
  );
}
