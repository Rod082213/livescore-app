'use client';

import { useState, useEffect, ReactNode } from 'react';

/**
 * A wrapper component that ensures its children are only rendered on the client side.
 * This is useful for preventing hydration mismatch errors with components that
 * rely on browser-specific APIs or have differing server/client outputs (e.g., dates).
 */
export default function ClientOnly({ children }: { children: ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, after the initial render.
    setHasMounted(true);
  }, []);

  // During server-side rendering or the initial client render before mounting,
  // this will return null, ensuring no content is mismatched.
  if (!hasMounted) {
    return null;
  }

  // Once the component has safely mounted on the client, render the children.
  return <>{children}</>;
}