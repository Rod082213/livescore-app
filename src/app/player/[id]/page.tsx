import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchPlayerDetails } from "@/lib/api";

import Footer from "@/components/Footer";
import Header from "@/components/Header";

const Stat = ({ label, value }: { label: string; value: string | number | null | undefined }) => (
  <div className="bg-[#1d222d] rounded-lg p-4 text-center">
    <p className="text-sm text-gray-400">{label}</p>
    <p className="text-2xl font-bold text-white">{value ?? 'N/A'}</p>
  </div>
);

interface PlayerProfilePageProps {
  params: { id: string; };
}

export async function generateMetadata({ params }: PlayerProfilePageProps) {
    const player = await fetchPlayerDetails(params.id);
    if (!player) return { title: "Player Not Found" };
    return {
        title: `${player.name} - Player Profile & Stats`,
        description: `View the player profile for ${player.name}, including age, nationality, current team, goals, and assists.`,
    };
}

export default async function PlayerProfilePage({ params }: PlayerProfilePageProps) {
  const [player, topLeagues] = await Promise.all([
    fetchPlayerDetails(params.id),
    fetchTopLeagues()
  ]);

  if (!player) {
    notFound();
  }

  return (
    <div className="bg-[#1d222d] text-gray-200 min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <div className="lg:flex lg:gap-6">
          <main className="w-full lg:flex-1">
            <div className="bg-[#2b3341] rounded-lg p-6 shadow-lg flex flex-col sm:flex-row items-center gap-6 mb-6">
              <div className="relative w-28 h-28 md:w-32 md:h-32 flex-shrink-0">
                <Image
                  src={player.photo}
                  alt={player.name}
                  fill
                  className="rounded-full object-cover border-4 border-gray-700"
                  sizes="(max-width: 768px) 112px, 128px"
                  priority={true}
                />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-white">{player.name}</h1>
                <div className="flex items-center justify-center sm:justify-start gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <Image src={player.team?.logo ?? ''} alt={player.team?.name ?? ''} width={24} height={24} />
                    <span className="text-gray-300 font-semibold">{player.team?.name ?? 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Stat label="Nationality" value={player.nationality} />
              <Stat label="Age" value={player.age} />
              
              {/* --- THIS IS THE DEFENSIVE UI FIX --- */}
              {/* We now use optional chaining here. It will not crash even if player.stats is undefined. */}
              <Stat label="Appearances" value={player.stats?.appearences} />
              <Stat label="Goals" value={player.stats?.goals} />
              <Stat label="Assists" value={player.stats?.assists} />
            </div>
          </main>

          <aside className="hidden lg:block lg:w-72 mt-6 lg:mt-0 flex-shrink-0">
           
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}