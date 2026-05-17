"use client";

import { useEffect, useRef, useState } from "react";

export function OtpCodeInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}) {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Update internal array when value is updated externally (e.g., reset)
  useEffect(() => {
    if (value === "") {
      setDigits(Array(6).fill(""));
    }
  }, [value]);

  function handleInput(index: number, val: string) {
    // Only accept numeric inputs
    const numVal = val.replace(/\D/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = numVal;
    setDigits(newDigits);

    const completedCode = newDigits.join("");
    onChange(completedCode);

    // Auto-advance to the next input
    if (numVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        // Empty box backspace: focus previous input
        inputRefs.current[index - 1]?.focus();
      } else {
        // Filled box backspace: clear current value
        const newDigits = [...digits];
        newDigits[index] = "";
        setDigits(newDigits);
        onChange(newDigits.join(""));
      }
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    
    if (pastedData.length > 0) {
      const newDigits = [...digits];
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pastedData[i] || "";
      }
      setDigits(newDigits);
      onChange(newDigits.join(""));

      // Focus the last filled box or the last box
      const focusIndex = Math.min(pastedData.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  }

  return (
    <div className="flex justify-between gap-2.5" onPaste={handlePaste}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => { inputRefs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleInput(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="h-12 w-11 rounded-xl border border-border bg-background text-center text-lg font-bold text-foreground transition-all focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none disabled:opacity-50"
        />
      ))}
    </div>
  );
}
