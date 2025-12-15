
import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface LegalDocsProps {
  onBack: () => void;
  docType: 'privacy' | 'terms';
}

export const LegalDocs: React.FC<LegalDocsProps> = ({ onBack, docType }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-slate-900 text-slate-300 overflow-y-auto animate-in slide-in-from-right duration-300">
        <div className="max-w-2xl mx-auto p-6">
            {/* Header */}
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm py-4 mb-6 border-b border-slate-800 flex items-center gap-3 z-10">
                <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold text-white">
                    {docType === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
                </h1>
            </div>

            <div className="prose prose-invert prose-slate max-w-none pb-20">
                {docType === 'privacy' ? (
                    <>
                        <h3>Privacy Policy</h3>
                        <p className="text-sm text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>
                        
                        <h4>1. Introduction</h4>
                        <p>Welcome to MBTI Rizz AI. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our application.</p>

                        <h4>2. Data We Collect</h4>
                        <p>We collect minimal data to provide our services:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Uploaded Images:</strong> Uploaded images are transmitted securely to our AI provider solely for the purpose of generating a response. Images (screenshots) are processed in temporary memory by Google Gemini and are NOT permanently stored on our servers. They are discarded immediately after analysis.</li>
                            <li><strong>Local Preferences:</strong> We use LocalStorage on your device to save your language settings, MBTI profile, and saved partners for your convenience. This data stays on your device.</li>
                            <li><strong>Usage Data:</strong> We may use Google Analytics to collect anonymous usage statistics to improve the app.</li>
                        </ul>

                        <h4>3. Advertising & Cookies</h4>
                        <p>We use Google AdSense to display advertisements. Google may use cookies (DART cookies) to serve ads based on your visit to this site and other sites on the Internet.</p>
                        
                        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-sm my-4">
                            <strong>Google AdSense Disclosure:</strong><br/>
                            Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites.
                            Users may opt out of personalized advertising by visiting Google Ads Settings: <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer" className="text-purple-400 hover:underline">www.google.com/settings/ads</a>
                        </div>

                        <h4>4. Children's Privacy</h4>
                        <p>This service is not intended for children under 13. We do not knowingly collect personal data from children under 13. If you are a parent or guardian and believe that your child has provided us with personal data, please contact us immediately.</p>

                        <h4>5. Data Retention & Control</h4>
                        <p>We do not store your personal chat data on our servers. However, data stored locally on your device (such as preferences and saved profiles) is under your control.</p>
                        <p><strong>Local data stored on your device can be deleted at any time by clearing your app data, browser storage, or using the "Reset Data" button in the app settings.</strong></p>

                        <h4>6. Third-Party Links</h4>
                        <p>Our application may include links to third-party websites or services (e.g., payment providers). We do not control these third-party websites and are not responsible for their privacy statements.</p>
                        
                        <h4>7. Contact Us</h4>
                        <p>If you have any questions about this Privacy Policy, please contact us at interlightlab@gmail.com.</p>
                    </>
                ) : (
                    <>
                        <h3>Terms of Service</h3>
                        <p className="text-sm text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>
                        
                        <h4>1. Agreement to Terms</h4>
                        <p>By accessing MBTI Rizz AI (mbtirizz.com), you agree to be bound by these Terms of Service. If you do not agree to these terms, you are prohibited from using this application.</p>

                        <h4>2. Disclaimer</h4>
                        <p>The content and advice provided by MBTI Rizz AI are generated by Artificial Intelligence. They are for entertainment and informational purposes only. We make no guarantees regarding the effectiveness of the advice for dating or relationships. Use your own judgment.</p>

                        <h4>3. User Conduct</h4>
                        <p>You agree to use the application only for lawful purposes. You are strictly prohibited from engaging in the following activities:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Unlawful Use:</strong> Using the service for any illegal purpose or to violate any local, state, national, or international law.</li>
                            <li><strong>Harassment:</strong> Harassing, abusing, or harming another person or group.</li>
                            <li><strong>Automated Scraping:</strong> Using bots, scrapers, spiders, or any automated means to access, extract, or collect data from the application without permission.</li>
                            <li><strong>Spam & Solicitation:</strong> Using the service to send unsolicited promotional content, spam, or chain letters.</li>
                            <li><strong>Interference:</strong> Attempting to compromise the system integrity, DDoS attacks, or introducing viruses/malicious code.</li>
                            <li><strong>Reverse Engineering:</strong> Attempting to decompile, reverse engineer, or dismantle the software.</li>
                        </ul>

                        <h4>4. Intellectual Property</h4>
                        <p>The code, design, and branding of MBTI Rizz AI are owned by the developers. You may not copy or reproduce them without permission.</p>

                        <h4>5. Limitations</h4>
                        <p>In no event shall MBTI Rizz AI or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit) arising out of the use or inability to use the materials on the application.</p>
                        
                        <h4>6. Modifications</h4>
                        <p>We may update these Terms of Service from time to time. Material changes will be communicated through an in-app notice or update log. By using this application you are agreeing to be bound by the then current version of these terms of service.</p>
                    </>
                )}
            </div>
        </div>
    </div>
  );
};
