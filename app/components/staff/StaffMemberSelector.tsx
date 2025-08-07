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

  const handleToggle = (memberId: string) => {
    const newSelection = selectedIds.includes(memberId)
    ? selectedIds.filter(id => id !== memberId)
    : [...selectedIds, memberId];
  onSelectionChange(newSelection);
  };

return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Select Staff Members</h3>
      <div className="max-h-60 overflow-y-auto space-y-2">
        {staffMembers.map((member) => (
          <label key={member.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
            <input
              type="checkbox"
              checked={selectedIds.includes(member.id)}
              onChange={() => handleToggle(member.id)}
              className="rounded border-gray-300"
            />
            <span>{member.firstName} {member.lastName}</span>
          </label>
        ))}
      </div>
    </div>
  );
}