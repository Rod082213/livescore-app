// src/app/contact/page.tsx

import { Metadata } from 'next';
import { Mail, Phone, MapPin, ServerCrash } from 'lucide-react';

// Component Imports
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SportsNav from '@/components/SportsNav';
import LeftSidebar from '@/components/LeftSidebar';
import TeamSidebar from '@/components/TeamSidebar';
import ContactForm from '@/components/contact/ContactForm'; // We will create this next

// Data Fetching Imports
import { 
  fetchTeamOfTheWeek,
  fetchTopLeagues,
} from '@/lib/api';
import { fetchNewsList } from '@/lib/news-api';

export const metadata: Metadata = {
  title: 'Contact Us | TLiveScores',
  description: 'Get in touch with the TLiveScores team. Send us your questions, feedback, or partnership inquiries through our contact form.',
};

// A small component for displaying contact details
const ContactInfo = () => (
  <div className="bg-[#2b3341] p-6 rounded-lg">
    <h2 className="text-xl font-bold text-white mb-4">Contact Information</h2>
    <div className="space-y-4 text-gray-300">
      <div className="flex items-center gap-4">
        <Mail className="h-6 w-6 text-blue-400 flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-white">Email Us</h3>
          <a href="mailto:support@tlivescores.com" className="hover:text-blue-400 transition-colors">
            support@tlivescores.com
          </a>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Phone className="h-6 w-6 text-blue-400 flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-white">Call Us</h3>
          <p>+1 (555) 123-4567</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <MapPin className="h-6 w-6 text-blue-400 flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-white">Our Office</h3>
          <p>123 Sports Lane, Media City</p>
        </div>
      </div>
    </div>
  </div>
);

// A component for the map embed
const MapEmbed = () => (
  <div className="bg-[#2b3341] p-6 rounded-lg">
    <h2 className="text-xl font-bold text-white mb-4">Find Us</h2>
    <div className="aspect-video rounded-lg overflow-hidden">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.81956135078593!3d-6.194741395503936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5390917b759%3A0x6b45e67356080477!2sNational%20Monument!5e0!3m2!1sen!2sid!4v1625832349580!5m2!1sen!2sid"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  </div>
);

export default async function ContactPage() {
  
  // Fetch data for the sidebars, just like on the teams list page
  const [teamOfTheWeek, allNews, topLeagues] = await Promise.all([
    fetchTeamOfTheWeek(),
    fetchNewsList(),
    fetchTopLeagues(),
  ]);

  const latestNewsForSidebar = allNews.slice(0, 3);

  return (
    <div className="bg-[#1d222d] text-gray-200 min-h-screen">
      <Header />
      <SportsNav />
      <div className="container mx-auto px-4 py-8">
        
        <h1 className="text-3xl font-bold text-white mb-8">Contact Us</h1>
        <p className="text-gray-400 mb-8 max-w-3xl">
          Have a question, feedback, or a partnership inquiry? We’d love to hear from you. Please fill out the form below and our team will get back to you as soon as possible.
        </p>

        <div className="lg:flex lg:gap-8">
            
          {/* Column 1: Left Sidebar */}
          <aside className="w-full lg:w-72 lg:flex-shrink-0 mb-8 lg:mb-0">
            <LeftSidebar 
              teamOfTheWeek={teamOfTheWeek} 
              latestNews={latestNewsForSidebar}
            />
          </aside>
            
          {/* Column 2: Main Content Area */}
          <main className="w-full lg:flex-1 space-y-8">
            <ContactForm />
            <ContactInfo />
            <MapEmbed />
          </main>
          
          {/* Column 3: Right Sidebar */}
          <aside className="hidden lg:block lg:w-72 lg:flex-shrink-0">
             <TeamSidebar initialTopLeagues={topLeagues} />
          </aside>

        </div>
      </div>
      <Footer />
    </div>
  );
}