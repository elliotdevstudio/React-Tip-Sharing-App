import { StaffMember } from "../../../types";

interface StaffMemberCardProps {
  member: StaffMember;
}

export default function StaffMemberCard({ member }: StaffMemberCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold text-gray-900">
        {member.firstName} {member.lastName}
      </h3>
      <p className="text-sm text-gray-500 mt-1">
        Added: {member.dateCreated.toLocaleDateString()}
      </p>
    </div>
  );
}