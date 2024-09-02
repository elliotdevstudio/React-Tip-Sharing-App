import React from 'react';


type StaffMemberProps = {
  id: number;
  name: string; 
  hours: number;
  tipOutAmount: number;
  isEditing: boolean;
  onHoursChange: (id: number, hours: number) => void;
}


export const StaffMember: React.FC<StaffMemberProps> = ({ 
  id,
  name,
  hours,
  tipOutAmount,
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
        <span> | Tip Out: ${tipOutAmount.toFixed(2)}</span>
    </div>
  )
}