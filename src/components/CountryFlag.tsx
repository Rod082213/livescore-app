import Image from 'next/image';

interface CountryFlagProps {
  countryCode?: string | null;
  countryName?: string | null;
  className?: string;
}

/**
 * A robust, dependency-free component to display a country flag.
 * It now validates the country code to prevent broken images.
 */
export const CountryFlag = ({ countryCode, countryName, className }: CountryFlagProps) => {
  // --- THE NEW, SMARTER SAFETY CHECK ---
  // We only proceed if the countryCode exists AND is a valid 2-letter string.
  // This will filter out bad data like null, "XX", or any other invalid text.
  if (!countryCode || countryCode.length !== 2) {
    return null; // Return nothing, which is much better than a broken image.
  }

  return (
    <Image
      src={`https://media.api-sports.io/flags/${countryCode.toUpperCase()}.svg`}
      alt={countryName ? `Flag of ${countryName}` : 'Country flag'}
      width={24}
      height={18}
      className={className}
      unoptimized
    />
  );
};