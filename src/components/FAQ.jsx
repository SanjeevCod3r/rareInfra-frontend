import React, { useState } from 'react';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqItems = [
    {
      question: "What is RareInfra?",
      answer: "RareInfra is a platform that connects investors with high-quality real estate investment opportunities. We provide a seamless way to invest in real estate with transparency and ease."
    },
    {
      question: "How does the investment process work?",
      answer: "Our streamlined process makes it easy to invest. Simply browse our available properties, review the details, and complete your investment through our secure platform."
    },
    {
      question: "What are the minimum investment amounts?",
      answer: "Minimum investment amounts vary by property. You can find the specific requirements for each property in its details page."
    },
    {
      question: "How do I get started?",
      answer: "Sign up for an account, verify your identity, and start browsing our available investment opportunities. Our team is here to help you every step of the way."
    },
    {
      question: "What kind of properties can I invest in?",
      answer: "We offer a variety of real estate investment opportunities including residential, commercial, and mixed-use properties across different locations."
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 relative inline-block">
            Frequently Asked Questions
            <div className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-blue-600 rounded-full"></div>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mt-6">
            Expert answers to help you navigate your real estate investment journey
          </p>
        </div>
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md">
              <button 
                onClick={() => toggleAccordion(index)}
                className="w-full flex justify-between items-center p-6 text-left text-gray-800 hover:bg-gray-50 focus:outline-none"
              >
                <span className="text-xl font-semibold">{item.question}</span>
                <span className={`transition-transform duration-200 ${activeIndex === index ? 'rotate-180' : ''}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              {activeIndex === index && (
                <div className="p-6 border-t border-gray-200">
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
