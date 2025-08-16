import React, { useState } from 'react';
import {
  ShieldCheckIcon,
  LockClosedIcon,
  DocumentTextIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';

const Section = ({ icon: Icon, title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
    <div className="flex items-center mb-4">
      <Icon className="h-8 w-8 text-blue-600 mr-3" />
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
    </div>
    <div className="text-gray-700 text-sm leading-relaxed">{children}</div>
  </div>
);

const FaqItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b py-4">
      <button
        onClick={() => setOpen(!open)}
        className="text-left w-full text-lg font-medium text-blue-700 flex justify-between"
      >
        {question}
        <span>{open ? '−' : '+'}</span>
      </button>
      {open && <p className="text-gray-600 mt-2 text-sm">{answer}</p>}
    </div>
  );
};

const PrivacyPolicy = () => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen pb-24">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-indigo-700 py-20 px-6 text-center text-white">
        <h1 className="text-5xl font-bold mb-4">Privacy Policy</h1>
        <p className="max-w-3xl mx-auto text-lg opacity-90">
          Transparency is important. Learn how we collect, use, and protect your data.
        </p>
      </section>

      {/* Policy Sections */}
      <main className="max-w-6xl mx-auto px-6 mt-16 grid md:grid-cols-2 gap-8">
        <Section icon={ShieldCheckIcon} title="What We Collect">
          <ul className="list-disc pl-5 space-y-1">
            <li>Personal Identifiers (Name, Email, Phone)</li>
            <li>Usage Data (IP, pages visited, time spent)</li>
            <li>Transaction Information</li>
            <li>Device & Location Data</li>
          </ul>
        </Section>

        <Section icon={DocumentTextIcon} title="How We Use It">
          <ul className="list-disc pl-5 space-y-1">
            <li>To personalize your experience</li>
            <li>To process payments or requests</li>
            <li>To improve our services and security</li>
            <li>To send updates, offers, or newsletters</li>
          </ul>
        </Section>

        <Section icon={LockClosedIcon} title="Data Protection">
          <p>
            We use SSL encryption, access controls, and third-party monitoring services to protect your data from unauthorized access and breaches.
          </p>
        </Section>

        <Section icon={InboxIcon} title="Your Rights">
          <ul className="list-disc pl-5 space-y-1">
            <li>Request access to your data</li>
            <li>Correct inaccurate information</li>
            <li>Delete your data upon request</li>
            <li>Opt out of marketing emails anytime</li>
          </ul>
        </Section>
      </main>

      {/* FAQ Section */}
      <section className="mt-20 max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Frequently Asked Questions</h2>
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <FaqItem
            question="How long do you retain my data?"
            answer="We retain your data for as long as necessary to fulfill the purposes outlined in this policy unless a longer retention period is required by law."
          />
          <FaqItem
            question="Is my data shared with third parties?"
            answer="We do not sell your data. We only share data with trusted third-party partners essential for delivering our services."
          />
          <FaqItem
            question="Can I opt out of tracking?"
            answer="Yes, you can manage cookie preferences and opt-out of tracking via your browser settings."
          />
          <FaqItem
            question="Do you use cookies?"
            answer="Yes, we use cookies to enhance functionality, analytics, and user experience."
          />
        </div>
      </section>

      {/* Contact CTA */}
      <section className="mt-20 text-center px-6">
        <div className="bg-blue-700 text-white p-8 rounded-lg max-w-3xl mx-auto shadow-lg">
          <h3 className="text-2xl font-bold mb-2">Still Have Questions?</h3>
          <p className="mb-4">We're here to help. Reach out to us anytime regarding our Privacy Policy.</p>
          <a
            href="mailto:support@rareinnfra.com"
            className="inline-block mt-2 bg-white text-blue-700 font-semibold px-6 py-3 rounded hover:bg-gray-100 transition"
          >
            Contact Us → support@rareinnfra.com
          </a>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
