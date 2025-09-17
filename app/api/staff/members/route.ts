// Updated app/api/staff/members/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { StaffService } from '../../../lib/services/staffService';

export async function GET() {
  console.log('🔥 Members API called - starting seeding check...');
  
  try {
    // Force seeding to happen
    await StaffService.seedInitialData();
    
    const members = await StaffService.getAllStaffMembers();
    
    console.log(`📤 Returning ${members.length} members to frontend`);
    
    return NextResponse.json({
      members,
      success: true,
      count: members.length
    });
  } catch (error) {
    console.error('❌ Error in members API:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error',
        error: error instanceof Error ? error.stack : String(error)
      },
      { status: 500 }
    );
  }
}
// import { NextRequest, NextResponse } from 'next/server';
// import { StaffService } from '../../../lib/services/staffService';

// export async function GET() {
//   console.log('🔥 GET /api/staff/members called - checking seeding...');
  
//   try {
//     // Always try to seed data on first request
//     await StaffService.seedInitialData();
    
//     const members = await StaffService.getAllStaffMembers();
    
//     console.log(`✅ Returning ${members.length} staff members to frontend`);
    
//     return NextResponse.json({
//       members,
//       success: true
//     });
//   } catch (error) {
//     console.error('❌ Error fetching staff members:', error);
//     return NextResponse.json(
//       { success: false, message: 'Failed to fetch staff members' },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const { firstName, lastName } = await request.json();
    
//     if (!firstName || !lastName) {
//       return NextResponse.json(
//         { success: false, message: 'First name and last name are required' },
//         { status: 400 }
//       );
//     }

//     const newMember = await StaffService.createStaffMember(firstName, lastName);

//     return NextResponse.json({
//       member: newMember,
//       success: true,
//       message: 'Staff member created successfully'
//     }, { status: 201 });

//   } catch (error) {
//     console.error('Error creating staff member:', error);
//     return NextResponse.json(
//       { success: false, message: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }