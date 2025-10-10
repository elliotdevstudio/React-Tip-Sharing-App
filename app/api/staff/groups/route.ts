import { NextRequest, NextResponse } from 'next/server';
import { StaffService } from '../../../lib/services/staffService';
import { CreateStaffGroupRequest, CreateStaffGroupResponse } from '../../../../types';

// SEARCH ALL 
export async function GET() {
  try {
    const groups = await StaffService.getAllStaffGroups();
    
    return NextResponse.json({
      groups,
      success: true
    });
  } catch (error) {
    console.error('Error fetching staff groups:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch groups' },
      { status: 500 }
    );
  }
}

// CREATE STAFF GROUP
export async function POST(request: NextRequest) {
  try {
    const body: CreateStaffGroupRequest = await request.json();
    
    // Validate required fields
    if (!body.name || !body.staffMemberIds || body.staffMemberIds.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Name and at least one staff member are required' 
        },
        { status: 400 }
      );
    }

    const newGroup = await StaffService.createStaffGroup(body);

    const response: CreateStaffGroupResponse = {
      group: newGroup,
      success: true,
      message: 'Group created successfully'
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('Error creating staff group:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
// UPDATE
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get('id');
    
    if (!groupId) {
      return NextResponse.json(
        { success: false, message: 'Group ID is required' },
        { status: 400 }
      );
    }

    const updates = await request.json();
    console.log('📨 Received group update request:', { groupId, updates });

    const updatedGroup = await StaffService.updateStaffGroup(groupId, updates);

    return NextResponse.json({
      group: updatedGroup,
      success: true,
      message: 'Group updated successfully'
    });

  } catch (error) {
    console.error('Error updating staff group:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to update group'
      },
      { status: 500 }
    );
  }
}
// DELETE
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get('id');
    
    if (!groupId) {
      return NextResponse.json(
        { success: false, message: 'Group ID is required' },
        { status: 400 }
      );
    }

    await StaffService.deleteStaffGroup(groupId);

    return NextResponse.json({
      success: true,
      message: 'Group deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting staff group:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to delete group'
      },
      { status: 500 }
    );
  }
}
