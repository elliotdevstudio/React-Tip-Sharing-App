'use client'

import React from 'react';
import { StaffMember } from './StaffMember';
import { StaffMemberType, StaffGroupProps } from '../types';

  

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