// src/components/match/PredictionForm.tsx
"use client";

import Image from 'next/image';
import { TrendingUp, ShieldCheck } from 'lucide-react';
import { generateMockPredictions } from '@/lib/predictions';

const FormPill = ({ result }: { result: string }) => {
    const styles = {
        W: 'bg-green-500',
        D: 'bg-gray-500',
        L: 'bg-red-500',
    };
    const style = styles[result as keyof typeof styles] || 'bg-gray-700';
    return <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold ${style}`}>{result}</div>;
};

interface PredictionFormProps {
  predictions?: { home: number; draw: number; away: number };
  form?: { home: string; away: string };
  teams: { home: { name: string; logo: string }; away: { name:string; logo: string }};
}

const PredictionForm = ({ predictions, form, teams }: PredictionFormProps) => {
    const displayPredictions = predictions || generateMockPredictions(teams.home.name, teams.away.name);

    return (
        <div className="bg-[#2b3341] rounded-lg p-6 text-white">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <TrendingUp size={20} /> Prediction & Form
            </h3>

            <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm font-semibold">
                    <span className="flex items-center gap-2">
                        <Image src={teams.home.logo} alt={teams.home.name} width={16} height={16} className="object-contain"/>
                        {teams.home.name}
                    </span>
                    <span>Draw</span>
                    <span className="flex items-center gap-2">
                        {teams.away.name}
                        <Image src={teams.away.logo} alt={teams.away.name} width={16} height={16} className="object-contain"/>
                    </span>
                </div>
                <div className="w-full h-2 rounded-full flex bg-gray-700 overflow-hidden">
                    <div className="bg-blue-500 h-2" style={{ width: `${displayPredictions.home}%` }}></div>
                    <div className="bg-gray-500 h-2" style={{ width: `${displayPredictions.draw}%` }}></div>
                    <div className="bg-green-500 h-2" style={{ width: `${displayPredictions.away}%` }}></div>
                </div>
                <div className="flex justify-between text-sm font-bold">
                    <span>{displayPredictions.home}%</span>
                    <span>{displayPredictions.draw}%</span>
                    <span>{displayPredictions.away}%</span>
                </div>
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold">{teams.home.name}</span>
                    <div className="flex gap-1.5">
                        {(form?.home || '-----').split('').map((r: string, i: number) => <FormPill key={i} result={r}/>)}
                    </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold">{teams.away.name}</span>
                    <div className="flex gap-1.5">
                        {(form?.away || '-----').split('').map((r: string, i: number) => <FormPill key={i} result={r}/>)}
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm mb-6">
              <button className="flex items-center justify-center gap-2 bg-gray-700/50 p-2 rounded-md hover:bg-gray-700 cursor-not-allowed opacity-50">Both Teams to Score</button>
              <button className="flex items-center justify-center gap-2 bg-gray-700/50 p-2 rounded-md hover:bg-gray-700 cursor-not-allowed opacity-50">Over 2.5 Goals</button>
            </div>
            <div className="bg-gray-700/50 p-3 rounded-md flex items-center gap-3 text-sm cursor-not-allowed opacity-50">
                <ShieldCheck size={20} className="text-yellow-400 flex-shrink-0"/>
                <span><strong>Combo Double chance:</strong> Not available</span>
            </div>
        </div>
    );
};

export default PredictionForm;