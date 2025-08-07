import { mockStaffMembers } from '../mock-data';
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
      
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
            All Staff
          </h2>
          <div className="space-y-3">
            {sortedStaff.map((member) => (
              <div 
                key={member.id} 
                className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
              >
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {member.lastName}, {member.firstName} 
                  </h3>
                  <p className="text-sm text-gray-500">
                    Added: {member.dateCreated.toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-400">
                    ID: {member.id}
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