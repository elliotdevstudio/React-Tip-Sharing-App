import React from 'react';
import { StaffMember } from './StaffMember';
import { StaffMemberType } from '../types';

  type StaffGroupProps = {
    title: string;
    staff: StaffMemberType[];
    isEditingStaffHours: boolean;
    onSaveStaffHours: (updatedStaff: StaffMemberType[]) => void;
    onEditStaffHours: () => void;
  }

  export const StaffGroup: React.FC<StaffGroupProps> = ({
    title, 
    staff,
    isEditingStaffHours,  
    onSaveStaffHours,
  }) => {

    const handleHoursChange = (id: number, hours: number) => {
      const updatedStaff = staff.map(member => 
        member.id === id ? { ...member, hours } : member
      );
      onSaveStaffHours(updatedStaff);
    };
    
    return (
      <div>
        <h2>
          {title}
        </h2>
        {staff.map(member => (
          <StaffMember
            key={member.id}
            id={member.id}
            name={member.name}
            hours={member.hours}
            tipOutAmount={member.tipOutAmount}
            isEditing={isEditingStaffHours}
            onHoursChange={handleHoursChange}
          />
        ))}
      </div>
    )
  }