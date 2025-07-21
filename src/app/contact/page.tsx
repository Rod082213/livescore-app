// src/app/contact/page.tsx

import { Metadata } from 'next';
import { Mail, Phone, MapPin } from 'lucide-react';

// Component Imports
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SportsNav from '@/components/SportsNav';
import LeftSidebar from '@/components/LeftSidebar';
import TeamSidebar from '@/components/TeamSidebar';
import ContactForm from '@/components/contact/ContactForm';

// Data Fetching Imports
import { 
  fetchTeamOfTheWeek,
  fetchTopLeagues,
} from '@/lib/api';
import { fetchNewsList } from '@/lib/news-api';

// SEO metadata is already correctly configured
export const metadata: Metadata = {
  title: 'Contact Us | TodayLiveScores', 
  description: 'Get in touch with the TodayLiveScores team. Send us your questions, feedback, or partnership inquiries through our contact form.',
  alternates: {
    canonical: 'https://todaylivescores.com/contact',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Contact Us | TodayLiveScores',
    description: 'Get in touch with our team for questions, feedback, or inquiries.',
    url: 'https://todaylivescores.com/contact',
    siteName: 'TodayLiveScores',
    images: [{
      url: '/social-card-contact.png',
      width: 1200,
      height: 630,
      alt: 'Contact the TodayLiveScores team',
    }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | TodayLiveScores',
    description: 'Get in touch with our team for questions, feedback, or inquiries.',
    images: ['/social-card-contact.png'],
  },
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
          <a href="mailto:support@todaylivescores.com" className="hover:text-blue-400 transition-colors">
            support@todaylivescores.com
          </a>
        </div>
      </div>
      {/* UPDATED: Phone number changed to a South African format */}
      <div className="flex items-center gap-4">
        <Phone className="h-6 w-6 text-blue-400 flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-white">Call Us</h3>
          <p>+27 (21) 555 0100</p>
        </div>
      </div>
      {/* UPDATED: Address changed to a location in Cape Town for consistency */}
      <div className="flex items-center gap-4">
        <MapPin className="h-6 w-6 text-blue-400 flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-white">Our Office</h3>
          <p>123 Waterfront Quay, Cape Town, 8001, South Africa</p>
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
      {/* UPDATED: The iframe src now points to Cape Town, South Africa */}
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d423286.8322741989!2d18.06994797615962!3d-33.91426895304199!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1dcc500f8826eed7%3A0x687fe1fc2828aa87!2sCape%20Town%2C%20South%20Africa!5e0!3m2!1sen!2s!4v1678886450123!5m2!1sen!2s"
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
  
  // Fetch data for the sidebars
  const [teamOfTheWeek, allNews, topLeagues] = await Promise.all([
    fetchTeamOfTheWeek(),
    fetchNewsList(),
    fetchTopLeagues(),
  ]);

  const latestNewsForSidebar = Array.isArray(allNews) ? allNews.slice(0, 3) : [];

  return (
    <div className="bg-[#1d222d] text-gray-200 min-h-screen">
      <Header />
      <SportsNav />
      <div className="container mx-auto px-4 py-8">
        
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Contact Us</h1>
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