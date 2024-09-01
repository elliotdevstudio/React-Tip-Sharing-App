import React, {useState} from 'react';
import { StaffMember } from './StaffMember';

  type StaffGroupProps = {
    title: string;
    staff: { id: number; name: string; hours: number }[];
    isEditingStaffHours:boolean;
    onEditStaffHours: () => void;
    onSaveStaffHours: (updatedStaff: { id: number; name: string; hours: number }[]) => void;
  }

  export const StaffGroup: React.FC<StaffGroupProps> = ({
    title, 
    staff,
    isEditingStaffHours,
    onEditStaffHours,
    onSaveStaffHours,
  }) => {
    const [updatedStaff, setUpdatedStaff] = useState(staff);

    const handleHoursChange = (id: number, hours: number) => {
      setUpdatedStaff(updatedStaff.map(member => member.id === id ? {...member, hours } : member));
    };

    const handleSave = () => {
      onSaveStaffHours(updatedStaff);
    }
    return (
      <div>
        <h2>
          {title}
          {!isEditingStaffHours && <button onClick={onEditStaffHours}>Edit Staff Hours</button>}
        </h2>
        {updatedStaff.map(member => (
          <StaffMember
            key={member.id}
            id={member.id}
            name={member.name}
            hours={member.hours}
            isEditing={isEditingStaffHours}
            onHoursChange={handleHoursChange}
          />
        ))}
        {isEditingStaffHours && <button onClick={handleSave}>Save</button>}
      </div>
    )

  }