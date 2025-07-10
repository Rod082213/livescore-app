// src/components/DateNavigator.tsx (CORRECTED)

'use client';

import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
// Make sure this CSS file is imported for the calendar styling
import "react-datepicker/dist/react-datepicker.css";
// This is your custom CSS file we will edit next
import "@/app/datepicker.css"; 

interface DateNavigatorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const DateNavigator = ({ selectedDate, onDateChange }: DateNavigatorProps) => {

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    onDateChange(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    onDateChange(newDate);
  };

  return (
    <div className="flex items-center justify-between p-3 bg-[#2b3341] rounded-lg mb-4 text-gray-200">
      <button onClick={handlePreviousDay} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* This is the DatePicker component that needs fixing */}
      <DatePicker
        selected={selectedDate}
        onChange={(date: Date) => onDateChange(date)}
        dateFormat="E, MMM d, yyyy"
        className="bg-transparent text-center font-semibold cursor-pointer w-48 focus:outline-none"
        // --- START OF FIX ---
        // 1. Render the calendar in a portal at the root of the page to avoid container issues.
        usePortal
        // 2. Add a custom class to the pop-up calendar so we can target it with CSS.
        popperClassName="high-z-index-datepicker"
        // --- END OF FIX ---
        customInput={
            <div className="flex items-center gap-2 cursor-pointer">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span>{selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
        }
      />
      
      <button onClick={handleNextDay} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default DateNavigator;