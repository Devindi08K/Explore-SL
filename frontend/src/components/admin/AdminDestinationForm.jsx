// ...in your form JSX...
<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">District</label>
  <select
    name="district"
    value={formData.district}
    onChange={handleChange}
    required
    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gold focus:ring-gold"
  >
    <option value="">Select a district</option>
    {districts.map((district) => (
      <option key={district} value={district}>
        {district}
      </option>
    ))}
  </select>
</div>