// src/components/predictions/DateNavigator.tsx
"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { format, addDays, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DateNavigator = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedDateStr = searchParams.get('date') || format(new Date(), 'yyyy-MM-dd');
  const selectedDate = new Date(selectedDateStr + 'T00:00:00'); // Avoid timezone issues

  const navigateToDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    router.push(`/predictions?date=${dateString}`);
  };

  const handlePrevDay = () => navigateToDate(subDays(selectedDate, 1));
  const handleNextDay = () => navigateToDate(addDays(selectedDate, 1));

  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="flex items-center justify-center gap-4 bg-[#1e2530] p-3 rounded-lg mb-6">
      <button onClick={handlePrevDay} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
        <ChevronLeft className="text-white" />
      </button>
      <div className="text-center">
        <h2 className="text-xl font-bold text-white">{format(selectedDate, 'eeee, dd MMMM')}</h2>
        {isToday && <span className="text-xs font-bold text-green-400">TODAY</span>}
      </div>
      <button onClick={handleNextDay} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
        <ChevronRight className="text-white" />
      </button>
    </div>
  );
};

export default DateNavigator;