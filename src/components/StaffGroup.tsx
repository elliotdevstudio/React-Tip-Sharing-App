import React from 'react';
import { StaffMember } from './StaffMember';

  type StaffGroupProps = {
    title: string;
    staff: { id: number; name: string; hours: number }[];
  }

  export const StaffGroup: React.FC<StaffGroupProps> = ({title, staff}) => {
    return (
      <div>
        <h2>{title}</h2>
        {staff.map(member => (
          <StaffMember key={member.id} id={member.id} name={member.name} hours={member.hours} />
        ))};
      </div>
    )
  };