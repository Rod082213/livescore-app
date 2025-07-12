import Image from 'next/image';

interface TeamHeaderProps {
  team: { name: string; logo: string; country: string; code: string; founded: number; };
}

export default function TeamHeader({ team }: TeamHeaderProps) {
  return (
    <div className="bg-[#2b3341] rounded-lg p-6 flex items-center gap-6 h-full">
      <Image src={team.logo} alt={team.name} width={96} height={96} className="h-24 w-24 object-contain" />
      <div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">{team.name}</h1>
        <div className="flex items-center gap-2 text-gray-400 mt-2">
          {team.code && <Image src={`https://media.api-sports.io/flags/${team.code}.svg`} alt={team.country} width={20} height={15} />}
          <span>Founded in {team.founded}</span>
        </div>
      </div>
    </div>
  );
}