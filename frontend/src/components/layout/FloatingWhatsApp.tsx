import React from 'react';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const whatsappNumber = '919876543210';
  const prefilledMessage = encodeURIComponent(
    'Hello Aesthetic Aroma! I would like to inquire about your menu, table bookings, and events.'
  );

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${prefilledMessage}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Aesthetic Aroma on WhatsApp"
      className="aa-fab"
    >
      <MessageCircle size={26} fill="rgba(17, 17, 17, 0.15)" color="#111111" />
    </a>
  );
};
