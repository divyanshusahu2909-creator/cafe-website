import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div style={{ paddingTop: '8rem', paddingBottom: '6rem', backgroundColor: '#1A1A1A', minHeight: '100vh', color: '#A7A08F' }}>
      <div style={{ maxWidth: '840px', margin: '0 auto', padding: '0 2rem' }}>
        <h1 className="font-serif gold-gradient-text" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>
          Terms of Service
        </h1>
        <p style={{ color: '#A7A08F', fontSize: '0.85rem', marginBottom: '2rem' }}>Last updated: October 2026</p>

        <section style={{ marginBottom: '2rem' }}>
          <h2 className="font-serif" style={{ color: '#F8F5EF', fontSize: '1.3rem', marginBottom: '0.5rem' }}>1. 100% Vegetarian Policy</h2>
          <p style={{ lineHeight: 1.7 }}>
            Aesthetic Aroma is committed to a strictly pure vegetarian kitchen. Outside food, non-vegetarian products, or outside alcoholic beverages are strictly prohibited on cafe premises.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 className="font-serif" style={{ color: '#F8F5EF', fontSize: '1.3rem', marginBottom: '0.5rem' }}>2. Table Reservations</h2>
          <p style={{ lineHeight: 1.7 }}>
            Reservations are held for up to 15 minutes past the scheduled booking time. Due to intimate seating capacity, tables may be reallocated to waiting guests thereafter if no prior notice is provided.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 className="font-serif" style={{ color: '#F8F5EF', fontSize: '1.3rem', marginBottom: '0.5rem' }}>3. Demo Environment Notice</h2>
          <p style={{ lineHeight: 1.7 }}>
            This website represents a functional demonstration of Aesthetic Aroma cafe in Indore, Madhya Pradesh. All pricing, menu entries, reviews, and transactions are sample records created for local testing and evaluation.
          </p>
        </section>
      </div>
    </div>
  );
};
