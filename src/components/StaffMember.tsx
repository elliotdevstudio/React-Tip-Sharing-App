import React from 'react';
import { useState } from 'react';

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
  onHoursChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputHours, setInputHours] = useState(hours);

  const handleToggleEdit = () => {
    if (isEditing) {
      // trigger update w/ new hours
      onHoursChange(id, inputHours);
    }
    setIsEditing(!isEditing); //toggles editing state
  }
  return (
    <div>
      <span>{name}: </span>
      {isEditing ? (
         <input 
         type="number"
         value={inputHours}
         placeholder={hours.toString()}
         onChange={(e) => onHoursChange(id, parseFloat(e.target.value))}
       />
      ) : (
        <span>{hours} hours</span>
      )}
        <span> | Tip Out: ${tipOutAmount.toFixed(2)}</span>
        <button onClick={handleToggleEdit}>
          {isEditing ? 'Save' : 'Edit Hours'}
        </button>
    </div>
  )
}