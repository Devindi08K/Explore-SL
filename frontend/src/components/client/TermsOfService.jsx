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
      <li>All payments for premium services are <b>non-refundable</b>, including but not limited to premium listings and sponsored content.</li>
      <li>Payments are processed securely by Stripe, our third-party payment processor.</li>
      <li>You agree to provide accurate and complete payment information.</li>
      <li>Premium services will not automatically renew. You will need to manually renew your service when it expires.</li>
      <li>Prices are listed in Sri Lankan Rupees (LKR) and include all applicable taxes.</li>
      <li><strong>International Payments:</strong> If you are paying with a card issued in a currency other than LKR, your bank may apply currency conversion rates and additional fees. These conversion rates are determined by your card issuer, not by SLExplora.</li>
      <li>SLExplora reserves the right to change pricing at any time, but changes will not affect existing paid services.</li>
      <li>In case of payment disputes, please contact us at info@slexplora.com before initiating a chargeback.</li>
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
      If you have any questions about these Terms, please contact us at <a href="mailto:info@slexplora.com" className="text-tan hover:underline">info@slexplora.com</a>.
    </p>
  </div>
);

export default TermsOfService;