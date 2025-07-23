'use client';

import { useState, useEffect } from 'react';

const FormattedDate = ({ dateString }: { dateString: string }) => {
  const [date, setDate] = useState('');

  useEffect(() => {
    // This safely runs only in the browser, preventing the hydration error
    setDate(new Date(dateString).toLocaleDateString());
  }, [dateString]);

  return <span>{date}</span>;
};

export default FormattedDate;