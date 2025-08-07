import React from "react";

const RefundPolicy = () => (
  <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-10">
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold text-charcoal mb-6 text-center">Refund & Return Policy</h1>
      <p className="mb-4 text-gray-700">
        SLExplora strives to provide the best possible service to our customers and partners. Please read our refund and return policy below:
      </p>
      <ul className="list-disc ml-6 mb-4 text-gray-700 space-y-2">
        <li>
          <strong>All payments for premium services, listings, and sponsored content are non-refundable.</strong>
        </li>
        <li>
          Once a payment is completed and your service is activated, we cannot offer refunds or returns except in cases of duplicate transactions or technical errors.
        </li>
        <li>
          If you believe you have been charged in error or have a duplicate payment, please contact us at <a href="mailto:slexplora@hotmail.com" className="text-tan hover:underline">slexplora@hotmail.com</a> within 7 days of the transaction.
        </li>
        <li>
          Refund requests for duplicate or erroneous payments will be reviewed and processed within 10 business days.
        </li>
        <li>
          For questions or concerns about your payment, please reach out to our support team before initiating a chargeback.
        </li>
      </ul>
      <p className="text-gray-600 mt-6 text-sm">
        This policy is subject to change. Please refer to this page for the latest information.
      </p>
    </div>
  </div>
);

export default RefundPolicy;