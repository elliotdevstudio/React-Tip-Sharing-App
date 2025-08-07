'use client';
import { useAtom } from 'jotai';
import { staffMembersAtom } from '../../atoms/staffAtoms';

export default function StaffMembersPage() {
  const [staffMembers] = useAtom(staffMembersAtom);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Staff Members</h1>
      
      <div className="grid gap-4">
        {staffMembers.map((member) => (
          <div key={member.id} className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold">
              {member.firstName} {member.lastName}
            </h3>
            <p className="text-gray-500 text-sm">
              Created: {member.dateCreated.toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}