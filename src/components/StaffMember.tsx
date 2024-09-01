import React from 'react';

type StaffMemberProps = {
  id: number;
  name: string; 
  hours: number;
  isEditing: boolean;
  onHoursChange: (id: number, hours: number) => void;
}

export const StaffMember: React.FC<StaffMemberProps> = ({ 
  id,
  name,
  hours,
  isEditing,
  onHoursChange,
}) => {
  return (
    <div>
      <span>{name}: </span>
      {isEditing ? (
         <input 
         type="number"
         value={hours}
         onChange={(e) => onHoursChange(id, parseFloat(e.target.value))}
       />
      ) : (
        <span>{hours} hours</span>
      )}
    </div>
  )
}