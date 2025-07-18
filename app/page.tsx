import { mockStaffMembers } from './lib/mock-data';
import StaffMember from './components/staff/StaffMember';

export default function HomePage() {
  // Sort staff members alphabetically by last name
  const sortedStaff = [...mockStaffMembers].sort((a, b) => 
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
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedStaff.map((member) => (
          <StaffMember 
            key={member.id} 
            member={member} 
          />
        ))}
      </div>
    </div>
  );
}