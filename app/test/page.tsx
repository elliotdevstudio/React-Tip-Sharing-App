'use client';
import { useState } from 'react';

export default function TestPage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult('Testing...');
    
    try {
      // Test the simple endpoint
      const response = await fetch('/api/test-seed');
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
    
    setLoading(false);
  };

  const forceSeed = async () => {
    setLoading(true);
    setResult('Force seeding...');
    
    try {
      const response = await fetch('/api/test-seed', { method: 'POST' });
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
    
    setLoading(false);
  };

  const testMembers = async () => {
    setLoading(true);
    setResult('Testing members endpoint...');
    
    try {
      const response = await fetch('/api/staff/members');
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
    
    setLoading(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Database Test</h1>
      
      <div className="space-x-4 mb-4">
        <button 
          onClick={testConnection}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Test Connection
        </button>
        
        <button 
          onClick={forceSeed}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Force Seed
        </button>
        
        <button 
          onClick={testMembers}
          disabled={loading}
          className="px-4 py-2 bg-purple-500 text-white rounded"
        >
          Test Members API
        </button>
      </div>

      <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
        {result}
      </pre>
    </div>
  );
}