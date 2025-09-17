'use client';
import { useAtomValue } from 'jotai';
import { staffMembersAtom, staffGroupFormAtom } from '../../atoms/staffAtoms';
import { StaffMember } from '../../../types';


interface StaffMemberSelectorProps {
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

export default function StaffMemberSelector({ selectedIds, onSelectionChange }: StaffMemberSelectorProps) {
  const staffMembers = useAtomValue(staffMembersAtom);

  // Debug: Log the staff members to see what we're working with
  console.log('🔍 Staff members in selector:', staffMembers.length);
  console.log('🔍 First few members:', staffMembers.slice(0, 3));
  console.log('🔍 Selected IDs:', selectedIds);
  
  const handleToggle = (memberId: string) => {
    const newSelection = selectedIds.includes(memberId)
    ? selectedIds.filter(id => id !== memberId)
    : [...selectedIds, memberId];
  onSelectionChange(newSelection);
  };

  // Filter out any members with invalid IDs
  const validMembers = staffMembers.filter(member => 
    member && member.id && typeof member.id === 'string'
  );

  if (validMembers.length === 0) {
    return (
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Select Staff Members</h3>
        <div className="text-gray-500 italic">
          No staff members available. Please make sure data is loaded.
        </div>
      </div>
    );
  }

  return (
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Select Staff Members</h3>
        <div className="max-h-60 overflow-y-auto space-y-2">
          {validMembers.map((member) => (
            <label key={`member-${member.id}`} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
              <input
                type="checkbox"
                checked={selectedIds.includes(member.id)}
                onChange={() => handleToggle(member.id)}
                className="rounded border-gray-300"
              />
              <span>{member.firstName} {member.lastName}</span>
              <span className="text-xs text-gray-400">({member.id.slice(-6)})</span>
            </label>
          ))}
        </div>
        <div className="text-sm text-gray-500">
        Selected: {selectedIds.length} of {validMembers.length} members
        </div>
      </div>
    );
}