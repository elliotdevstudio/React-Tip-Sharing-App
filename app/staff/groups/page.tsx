'use client';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { staffGroupsAtom, staffMembersAtom } from '../../atoms/staffAtoms';
import StaffGroupForm from '../../components/staff/StaffGroupForm';
import { CreateStaffGroupRequest, CreateStaffGroupResponse } from '../../../types';

export default function StaffGroupsPage() {
  const [staffGroups, setStaffGroups] = useAtom(staffGroupsAtom);
  const [showForm, setShowForm] = useState(false);

  const handleCreateGroup = async (request: CreateStaffGroupRequest): Promise<void> => {
    try {
      const response = await fetch('/api/staff/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });

      const result: CreateStaffGroupResponse = await response.json();
      
      if (result.success) {
        setStaffGroups(prev => [...prev, result.group]);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Staff Groups</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create New Group
        </button>
      </div>

      {showForm ? (
        <StaffGroupForm
          onSubmit={handleCreateGroup}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <div className="grid gap-4">
          {staffGroups.map((group) => (
            <div key={group.id} className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold">{group.name}</h3>
              {group.description && (
                <p className="text-gray-600 mt-1">{group.description}</p>
              )}
              <div className="mt-2 text-sm text-gray-500">
                {group.staffMemberIds.length} staff members
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}