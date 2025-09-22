'use client';
import { useState, useEffect } from 'react';
import { StaffMember } from '../types';

export default function HomePage() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStaffMembers = async () => {
      try {
        const response = await fetch('/api/staff/members');
        const data = await response.json();
        
        if (data.success) {
          setStaffMembers(data.members);
        }
      } catch (error) {
        console.error('Failed to load staff members:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStaffMembers();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="text-lg">Loading staff members...</div>
      </div>
    );
  }

  // Sort staff members alphabetically by last name
  const sortedStaff = [...staffMembers].sort((a, b) => 
    a.lastName.localeCompare(b.lastName)
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Staff Members
        </h1>
        <p className="text-gray-600">
          {sortedStaff.length} team members (sorted by last name)
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
            All Staff
          </h2>
          <div className="space-y-3">
            {sortedStaff.map((member) => (
              <div 
                key={member.id}  // Now uses unique MongoDB ObjectId strings
                className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
              >
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {member.lastName}, {member.firstName} 
                  </h3>
                  <p className="text-sm text-gray-500">
                    Added: {new Date(member.dateCreated).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-400">
                    ID: {member.id.slice(-6)}  {/* Show last 6 chars of ObjectId */}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}