"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

interface CustomOTPInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  length?: number;
}

export default function CustomOTPInput({
  value,
  onChange,
  label,
  length = 6,
}: CustomOTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const chars = value.split("").slice(0, length); // Split value into characters
    const otpArray = Array(length).fill(""); // Start with array of empty strings
    chars.forEach((char, i) => {
      otpArray[i] = char; // Fill with characters from value
    });
    setOtp(otpArray);
  }, [value, length]);
  const handleChange = (index: number, newValue: string) => {
    if (!/^[0-9]?$/.test(newValue)) return; // Allow only single digits or empty

    const newOtp = [...otp];
    newOtp[index] = newValue;
    setOtp(newOtp);
    onChange(newOtp.join(""));

    // Auto-focus next input
    if (newValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    if (!/^\d*$/.test(pastedData)) return;

    const newOtp = pastedData.padEnd(length, "").split("").slice(0, length);
    setOtp(newOtp);
    onChange(newOtp.join(""));
    inputRefs.current[Math.min(pastedData.length, length - 1)]?.focus();
  };

  return (
    <div className="space-y-2">
      <Label className="text-gray-700 font-medium">{label}</Label>
      <div className="flex space-x-2">
        {Array.from({ length }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Input
              ref={(el) => (inputRefs.current[index] = el as any)}
              type="text"
              maxLength={1}
              value={otp[index]}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-12 h-12 text-center text-lg font-semibold bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-red-400 transition-all duration-300 rounded-xl"
              inputMode="numeric"
              pattern="[0-9]*"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
