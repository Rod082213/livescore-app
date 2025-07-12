// src/components/Footer.tsx
const Footer = () => {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h2 className="font-bold text-white mb-4">Company</h2>
            <ul>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Press</a></li>
            </ul>
          </div>
          <div>
            <h2 className="font-bold text-white mb-4">Legal</h2>
            <ul>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Terms of Use</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Cookie Policy</a></li>
            </ul>
          </div>
          <div>
            <h2 className="font-bold text-white mb-4">Support</h2>
            <ul>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm">FAQs</a></li>
            </ul>
          </div>
          <div>
            <h2 className="font-bold text-white mb-4">Follow Us</h2>
            <div className="flex space-x-4">
              {/* Add social icons here if you want */}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} LiveScore Inc. All rights reserved. Data provided for entertainment purposes only.
        </div>
      </div>
    </footer>
  );
};

export default Footer;