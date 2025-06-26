// src/components/DateNavigator.tsx
"use client";

import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';

interface DateNavigatorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const DateNavigator = ({ selectedDate, onDateChange }: DateNavigatorProps) => {
  const handlePreviousDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(selectedDate.getDate() - 1);
    onDateChange(prevDay);
  };

  const handleNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(selectedDate.getDate() + 1);
    onDateChange(nextDay);
  };

  return (
    <div className="flex items-center justify-between bg-[#2b3341] p-2 rounded-md mb-4">
      <button onClick={handlePreviousDay} className="p-2 rounded-md hover:bg-gray-700/50">
        <ChevronLeft size={20} />
      </button>
      
       <DatePicker
        selected={selectedDate}
        onChange={(date: Date) => onDateChange(date)}
        dateFormat="EEE, d MMM yyyy"
        customInput={
            <button className="flex items-center gap-2 font-semibold text-white px-4 py-2 rounded-md hover:bg-gray-700/50">
                <Calendar size={16} />
                {selectedDate.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
            </button>
        }
        // This makes the calendar popup appear nicely below the button
        popperPlacement="bottom-end"
      />
      
      <button onClick={handleNextDay} className="p-2 rounded-md hover:bg-gray-700/50">
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default DateNavigator;