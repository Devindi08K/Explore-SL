import React from "react";

const PrivacyPolicy = () => (
  <div className="max-w-3xl mx-auto py-12 px-4">
    <h1 className="text-4xl font-bold mb-8 text-charcoal">Privacy Policy</h1>
    <p className="mb-4 text-gray-700">
      SLExplora ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
    </p>

    <h2 className="text-2xl font-semibold mt-10 mb-3 text-charcoal">1. Information We Collect</h2>
    <ul className="list-disc ml-6 mb-4 text-gray-700">
      <li>Personal information you provide (such as name, email, contact details, payment information, etc.)</li>
      <li>Information collected automatically (such as IP address, browser type, device information, usage data, etc.)</li>
      <li>Information from third parties (such as payment processors, analytics providers, etc.)</li>
    </ul>

    <h2 className="text-2xl font-semibold mt-10 mb-3 text-charcoal">2. How We Use Your Information</h2>
    <ul className="list-disc ml-6 mb-4 text-gray-700">
      <li>To provide and maintain our services</li>
      <li>To process transactions and send related information</li>
      <li>To communicate with you about your account or our services</li>
      <li>To improve, personalize, and expand our services</li>
      <li>To comply with legal obligations</li>
    </ul>

    <h2 className="text-2xl font-semibold mt-10 mb-3 text-charcoal">3. Sharing Your Information</h2>
    <ul className="list-disc ml-6 mb-4 text-gray-700">
      <li>With service providers and partners who help us operate our business</li>
      <li>With law enforcement or regulatory authorities if required by law</li>
      <li>With your consent or at your direction</li>
    </ul>

    <h2 className="text-2xl font-semibold mt-10 mb-3 text-charcoal">4. Data Security</h2>
    <p className="mb-4 text-gray-700">
      We implement reasonable security measures to protect your information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
    </p>

    <h2 className="text-2xl font-semibold mt-10 mb-3 text-charcoal">5. Your Rights</h2>
    <p className="mb-4 text-gray-700">
      You may access, update, or delete your personal information by contacting us at <a href="mailto:info@slexplora.com" className="text-tan hover:underline">info@slexplora.com</a>. We may retain certain information as required by law or for legitimate business purposes.
    </p>

    <h2 className="text-2xl font-semibold mt-10 mb-3 text-charcoal">6. Children's Privacy</h2>
    <p className="mb-4 text-gray-700">
      Our services are not intended for children under 18. We do not knowingly collect personal information from children.
    </p>

    <h2 className="text-2xl font-semibold mt-10 mb-3 text-charcoal">7. Changes to This Policy</h2>
    <p className="mb-4 text-gray-700">
      We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.
    </p>

    <h2 className="text-2xl font-semibold mt-10 mb-3 text-charcoal">8. Contact Us</h2>
    <p className="mb-4 text-gray-700">
      If you have any questions about this Privacy Policy, please contact us at <a href="mailto:slexplora@hotmail.com" className="text-tan hover:underline">slexplora@hotmail.com</a>.
    </p>

    <h2 className="text-2xl font-semibold mt-10 mb-3 text-charcoal">Payment Processing</h2>
    <p className="mb-4 text-gray-700">
      When you make a payment on SLExplora:
    </p>
    <ul className="list-disc ml-6 mb-4 text-gray-700">
      <li>Your payment information is processed securely by Stripe, a PCI-DSS Level 1 certified payment processor.</li>
      <li>SLExplora does not store your full credit card details on our servers.</li>
      <li>We collect and store transaction data including amount, date, description, and order IDs for accounting and customer service purposes.</li>
      <li>Payment data may be used for fraud detection and prevention.</li>
      <li><strong>Data Retention:</strong> We retain transaction data for accounting purposes. Your payment method details (such as the last 4 digits of your card) are retained to assist with transaction inquiries and disputes.</li>
      <li><strong>Data Access:</strong> You may request a copy of your payment records by contacting us at info@slexplora.com.</li>
      <li><strong>International Payments:</strong> If you are paying with a card issued in a currency other than LKR, your bank may apply currency conversion rates and additional fees. These conversion rates are determined by your card issuer, not by SLExplora.</li>
    </ul>
    <h3 className="text-xl font-semibold mb-2 text-charcoal">Payment Data</h3>
    <ul className="list-disc ml-6 mb-4 text-gray-700 space-y-1">
      <li>We partner with PayHere for secure payment processing. We do not store your full credit card details on our servers.</li>
      <li>We retain transaction data (order ID, amount, date, service type) for 7 years to comply with accounting regulations.</li>
      <li><strong>Data Access:</strong> You may request a copy of your payment records by contacting us at slexplora@hotmail.com.</li>
      <li><strong>International Payments:</strong> If you are paying with a card issued in a currency other than LKR, your bank may apply currency conversion rates and additional fees. These conversion rates are determined by your card issuer, not by SLExplora.</li>
    </ul>
  </div>
);

export default PrivacyPolicy;