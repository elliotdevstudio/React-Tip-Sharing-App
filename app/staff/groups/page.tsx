'use client';
import { useAtom } from 'jotai';
import { useState, useEffect } from 'react';
import { staffGroupsAtom, staffMembersAtom } from '../../atoms/staffAtoms';
import StaffGroupForm from '../../components/staff/StaffGroupForm';
import { CreateStaffGroupRequest, CreateStaffGroupResponse } from '../../../types';

export default function StaffGroupsPage() {
  const [staffGroups, setStaffGroups] = useAtom(staffGroupsAtom);
  const [staffMembers, setStaffMembers] = useAtom(staffMembersAtom);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🔄 Loading staff data...');
        
        // Load staff members first
        console.log('📋 Fetching staff members...');
        const membersResponse = await fetch('/api/staff/members');
        
        if (!membersResponse.ok) {
          throw new Error(`Members API error: ${membersResponse.status}`);
        }
        
        const membersData = await membersResponse.json();
        console.log('📊 Members API response:', membersData);
        
        if (membersData.success && membersData.members) {
          console.log(`✅ Setting ${membersData.members.length} staff members in state`);
          setStaffMembers(membersData.members);
        } else {
          console.error('❌ Members API returned unsuccessful response:', membersData);
          setError('Failed to load staff members');
        }

        // Load staff groups
        console.log('📋 Fetching staff groups...');
        const groupsResponse = await fetch('/api/staff/groups');
        
        if (!groupsResponse.ok) {
          throw new Error(`Groups API error: ${groupsResponse.status}`);
        }
        
        const groupsData = await groupsResponse.json();
        console.log('📊 Groups API response:', groupsData);
        
        if (groupsData.success && groupsData.groups) {
          console.log(`✅ Setting ${groupsData.groups.length} staff groups in state`);
          setStaffGroups(groupsData.groups);
        } else {
          console.error('❌ Groups API returned unsuccessful response:', groupsData);
        }
        
      } catch (error) {
        console.error('❌ Failed to load data:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [setStaffMembers, setStaffGroups]);

  // Debug: Log current state
  useEffect(() => {
    console.log('🔍 Current staff members in state:', staffMembers.length);
    console.log('🔍 First few staff members:', staffMembers.slice(0, 3));
  }, [staffMembers]);

  const handleCreateGroup = async (request: CreateStaffGroupRequest): Promise<void> => {
    try {
      console.log('📤 Creating group with request:', request);
      
      const response = await fetch('/api/staff/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });

      const result: CreateStaffGroupResponse = await response.json();
      
      if (result.success) {
        console.log('✅ Group created successfully:', result.group);
        setStaffGroups(prev => [...prev, result.group]);
        setShowForm(false);
      } else {
        console.error('❌ Group creation failed:', result.message);
        alert(result.message || 'Failed to create group');
      }
    } catch (error) {
      console.error('❌ Failed to create group:', error);
      alert('Failed to create group. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-lg">Loading staff data...</div>
          <div className="text-sm text-gray-500 mt-2">This may take a moment for initial seeding</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          <div className="text-lg">Error loading data</div>
          <div className="text-sm mt-2">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Staff Groups</h1>
        <div className="text-sm text-gray-500">
          {staffMembers.length} staff members loaded
        </div>
        <button
          onClick={() => setShowForm(true)}
          disabled={staffMembers.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create New Group
        </button>
      </div>

      {staffMembers.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="text-yellow-800">
            No staff members loaded. Please ensure the database is seeded with staff data.
          </div>
        </div>
      )}

      {showForm ? (
        <StaffGroupForm
          onSubmit={handleCreateGroup}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <div className="grid gap-4">
          {staffGroups.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No staff groups created yet. Click "Create New Group" to get started.
            </div>
          ) : (
            staffGroups.map((group) => (
              <div key={group.id} className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold">{group.name}</h3>
                {group.description && (
                  <p className="text-gray-600 mt-1">{group.description}</p>
                )}
                <div className="mt-2 text-sm text-gray-500">
                  {group.staffMemberIds.length} staff members
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  Distributes gratuities: {group.gratuityConfig.distributesGratuities ? 'Yes' : 'No'}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}