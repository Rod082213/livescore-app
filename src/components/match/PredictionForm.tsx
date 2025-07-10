// src/components/match/PredictionForm.tsx
"use client";

import Image from 'next/image';
import { TrendingUp, ShieldCheck } from 'lucide-react';

const FormPill = ({ result }: { result: string }) => {
    const styles = {
        W: 'bg-green-500',
        D: 'bg-gray-500',
        L: 'bg-red-500',
    };
    // Use a fallback style for '-' or any other character
    const style = styles[result as keyof typeof styles] || 'bg-gray-700';
    return <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold ${style}`}>{result}</div>;
};

const PredictionForm = ({ predictions, form, teams }: { predictions?: any, form?: any, teams: any }) => {
    return (
        <div className="bg-[#2b3341] rounded-lg p-6 text-white">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <TrendingUp size={20} /> Prediction & Form
            </h3>

            {/* Probability Bar Section */}
            {predictions ? (
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
                    <div className="w-full h-2 rounded-full flex bg-gray-700">
                        <div className="bg-blue-500 h-2 rounded-l-full" style={{ width: `${predictions.home}%` }}></div>
                        <div className="bg-gray-500 h-2" style={{ width: `${predictions.draw}%` }}></div>
                        <div className="bg-green-500 h-2 rounded-r-full" style={{ width: `${predictions.away}%` }}></div>
                    </div>
                    <div className="flex justify-between text-sm font-bold">
                        <span>{predictions.home}%</span>
                        <span>{predictions.draw}%</span>
                        <span>{predictions.away}%</span>
                    </div>
                </div>
            ) : (
                <div className="text-center text-gray-400 text-sm mb-6 py-4">
                    Prediction data not available.
                </div>
            )}

            {/* Form Guide - Always displays */}
            <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold">{teams.home.name}</span>
                    <div className="flex gap-1.5">
                        {/* Use optional chaining and provide a fallback string of '-----' */}
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
            
            {/* Static Bet Buttons */}
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