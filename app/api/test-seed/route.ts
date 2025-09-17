import { NextResponse } from 'next/server';
import { StaffService } from '../../lib/services/staffService';

export async function GET() {
  console.log('🧪 Test seed endpoint called');
  
  try {
    // Check current state
    const members = await StaffService.getAllStaffMembers();
    console.log(`Current member count: ${members.length}`);
    
    return NextResponse.json({
      success: true,
      currentMemberCount: members.length,
      hasData: members.length > 0,
      sampleMembers: members.slice(0, 3)
    });
  } catch (error) {
    console.error('❌ Test seed error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

export async function POST() {
  console.log('🧪 Force seed POST called');
  
  try {
    await StaffService.forceSeedData();
    const members = await StaffService.getAllStaffMembers();
    
    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${members.length} members`,
      memberCount: members.length,
      sampleMembers: members.slice(0, 3)
    });
  } catch (error) {
    console.error('❌ Force seed error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
}