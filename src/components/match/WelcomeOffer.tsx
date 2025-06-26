import { Gift } from 'lucide-react';

const WelcomeOffer = () => {
    return (
        <div className="bg-[#2b3341] rounded-lg p-6 text-center">
            <h3 className="text-lg font-bold text-white mb-2">Exclusive Welcome Offer!</h3>
            <p className="text-sm text-gray-300 mb-4">Get a <span className="text-green-400 font-bold">100% bonus</span> on your first deposit to bet on today's matches.</p>
            <button className="bg-green-500 text-white font-bold w-full py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                <Gift size={18}/> Claim Your Bonus Now
            </button>
            <p className="text-xs text-gray-500 mt-3">18+ | T&Cs apply. Please gamble responsibly.</p>
        </div>
    );
};

export default WelcomeOffer;