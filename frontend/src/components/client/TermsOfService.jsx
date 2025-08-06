import React from "react";

const TermsOfService = () => (
  <div className="max-w-3xl mx-auto py-12 px-4">
    <h1 className="text-4xl font-bold mb-8 text-charcoal">Terms of Service</h1>
    <p className="mb-4 text-gray-700">
      Welcome to SLExplora. By accessing or using our website and services, you agree to be bound by these Terms of Service. Please read them carefully.
    </p>

    <h2 className="text-2xl font-semibold mt-10 mb-3 text-charcoal">1. Use of Service</h2>
    <p className="mb-4 text-gray-700">
      You must be at least 18 years old to use our services. You agree to provide accurate information and to use our services only for lawful purposes.
    </p>

    <h2 className="text-2xl font-semibold mt-10 mb-3 text-charcoal">2. Payments & Refunds</h2>
    <ul className="list-disc ml-6 mb-4 text-gray-700">
      <li>All payments for premium services are <b>non-refundable</b>, including but not limited to subscriptions, listings, and sponsored content. Once a payment is made, it cannot be refunded for any reason.</li>
      <li>By making a payment, you agree to our pricing and billing terms as displayed at the time of purchase.</li>
    </ul>

    <h2 className="text-2xl font-semibold mt-10 mb-3 text-charcoal">3. User Content & Conduct</h2>
    <ul className="list-disc ml-6 mb-4 text-gray-700">
      <li>You are responsible for any content you submit or display on our platform.</li>
      <li>You must not post unlawful, misleading, or harmful content.</li>
      <li>We reserve the right to remove content or suspend accounts at our discretion.</li>
    </ul>

    <h2 className="text-2xl font-semibold mt-10 mb-3 text-charcoal">4. Third-Party Services & Listings</h2>
    <p className="mb-4 text-gray-700">
      We may link to or integrate with third-party services, websites, or external booking systems. SLExplora does not own, operate, or control these third-party services or any user-generated listings. We are not responsible for the content, policies, practices, quality, safety, legality, or accuracy of any third-party websites, services, or user conduct. Any transactions, communications, or disputes with third parties or other users are solely between you and those parties.
    </p>

    <h2 className="text-2xl font-semibold mt-10 mb-3 text-charcoal">5. Limitation of Liability</h2>
    <ul className="list-disc ml-6 mb-4 text-gray-700">
      <li>SLExplora acts as a platform connecting users, guides, vehicle owners, businesses, and travelers. We do not guarantee the quality, safety, legality, or accuracy of any listings, services, or user conduct.</li>
      <li>We are not responsible for any loss, damage, injury, or dispute arising from use of our platform, services, or third-party interactions.</li>
      <li>Our liability is limited to the maximum extent permitted by law.</li>
    </ul>

    <h2 className="text-2xl font-semibold mt-10 mb-3 text-charcoal">6. Changes to Terms</h2>
    <p className="mb-4 text-gray-700">
      We may update these Terms of Service at any time. Continued use of our services constitutes acceptance of the updated terms.
    </p>

    <h2 className="text-2xl font-semibold mt-10 mb-3 text-charcoal">7. Contact</h2>
    <p className="mb-4 text-gray-700">
      For questions about these Terms, contact us at <a href="mailto:slexplora@hotmail.com" className="text-tan hover:underline">slexplora@hotmail.com</a>.
    </p>
  </div>
);

export default TermsOfService;