import { useState } from 'react';

function Converter() {
  const [amount, setAmount] = useState('');
  const [base, setBase] = useState('USD');
  const [target, setTarget] = useState('INR');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConvert = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/currency/rate/${base}/${target}`);
      const data = await res.json();
      if (res.ok && data.result) {
        setResult(amount * data.result);
      } else {
        setError('Conversion failed');
      }
    } catch {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Currency Converter</h2>
      <form onSubmit={handleConvert} className="flex flex-col gap-2 mb-4">
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" className="p-2 border rounded" required />
        <div className="flex gap-2">
          <input type="text" value={base} onChange={e => setBase(e.target.value.toUpperCase())} placeholder="From (e.g. USD)" className="p-2 border rounded w-1/2" required />
          <input type="text" value={target} onChange={e => setTarget(e.target.value.toUpperCase())} placeholder="To (e.g. INR)" className="p-2 border rounded w-1/2" required />
        </div>
        <button type="submit" className="bg-blue-600 text-white p-2 rounded" disabled={loading}>{loading ? 'Converting...' : 'Convert'}</button>
      </form>
      {result && (
        <div className="text-green-700 font-bold mb-2">Result: {amount} {base} = {result.toFixed(2)} {target}</div>
      )}
      {error && <div className="text-red-600 mb-2">{error}</div>}
    </div>
  );
}

export default Converter;
