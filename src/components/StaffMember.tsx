import React from 'react';
import { useState, useEffect } from 'react';

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

  useEffect(() => {
    setInputHours(hours);
  }, [hours]);

  const handleToggleEdit = () => {
    if (isEditing) {
      // Trigger update with new hours when editing is saved
      onHoursChange(id, inputHours);
    }
    setIsEditing(!isEditing); // Toggles editing state
  };
  return (
    <div>
      <span>{name}: </span>
      {isEditing ? (
         <input 
         type="number"
         value={inputHours}
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