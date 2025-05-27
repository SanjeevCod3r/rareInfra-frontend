import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import ContactInfoItem from './InfoItem';

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone',
    content: '+91 7827529358',
    link: 'tel:+917827529358',
  },
  {
    icon: Mail,
    title: 'Email',
    content: 'support@rareinfra.com',
    link: 'mailto:support@rareinfra.com',
  },
  {
    icon: MapPin,
    title: 'Address',
    content: 'Basement H-196 Sector 63, Noida, Uttar Pradesh 201307, IN',
    link: 'https://maps.app.goo.gl/uqLDis7MKoHTtWKL7',
  },
  {
    icon: Clock,
    title: 'Working Hours',
    content: 'Tue-Sun: 9 AM - 8:30 PM',
  },
];

export default function ContactInfo() {
  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
      className="bg-white p-8 rounded-2xl shadow-sm"
    >
      <h2 className="text-2xl font-bold mb-8">Our Office</h2>
      <div className="space-y-6">
        {contactInfo.map((info, index) => (
          <ContactInfoItem key={index} {...info} />
        ))}
      </div>
    </motion.div>
  );
}