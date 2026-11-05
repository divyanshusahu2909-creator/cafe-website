import React from 'react';

export const PrivacyPage: React.FC = () => {
  return (
    <div style={{ paddingTop: '8rem', paddingBottom: '6rem', backgroundColor: '#1A1A1A', minHeight: '100vh', color: '#A7A08F' }}>
      <div style={{ maxWidth: '840px', margin: '0 auto', padding: '0 2rem' }}>
        <h1 className="font-serif gold-gradient-text" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>
          Privacy Policy
        </h1>
        <p style={{ color: '#A7A08F', fontSize: '0.85rem', marginBottom: '2rem' }}>Last updated: October 2026</p>

        <section style={{ marginBottom: '2rem' }}>
          <h2 className="font-serif" style={{ color: '#F8F5EF', fontSize: '1.3rem', marginBottom: '0.5rem' }}>1. Information We Collect</h2>
          <p style={{ lineHeight: 1.7 }}>
            Aesthetic Aroma collects minimal personal information necessary to provide our table reservation, online takeaway ordering, and customer communication services. This includes customer name, phone number, email address, and delivery address where applicable.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 className="font-serif" style={{ color: '#F8F5EF', fontSize: '1.3rem', marginBottom: '0.5rem' }}>2. Payment Security</h2>
          <p style={{ lineHeight: 1.7 }}>
            We never store credit card numbers, CVVs, or sensitive payment credentials on our servers. In this demonstration environment, transactions use a simulated demo payment mechanism where no real currency is transferred.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 className="font-serif" style={{ color: '#F8F5EF', fontSize: '1.3rem', marginBottom: '0.5rem' }}>3. Data Retention</h2>
          <p style={{ lineHeight: 1.7 }}>
            Customer records are retained solely for transaction verification, order fulfillment, and table reservation coordination in Indore, Madhya Pradesh. We do not sell or monetize customer data.
          </p>
        </section>
      </div>
    </div>
  );
};
