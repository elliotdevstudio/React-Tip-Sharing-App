import React, { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { staffHourState, staffTipOutSelector } from '../recoilStore';

type StaffMemberProps = {
  id: number;
  name: string;
  hours: number;
}


export const StaffMember: React.FC<StaffMemberProps> = ({ id, name, hours}) => {
  const [ hoursMap, setHoursMap ] = useRecoilState(staffHourState);
  const tipOutMap = useRecoilValue(staffTipOutSelector);

  useEffect(() => {
    // Only update the state if the current value is different from the initialHours
    const currentHours = hoursMap.get(id);
    if (currentHours !== hours) {
      const updatedMap = new Map(hoursMap);
      updatedMap.set(id, hours);
      setHoursMap(updatedMap);
    }
  }, [hours, id, hoursMap, setHoursMap]);

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHours = parseFloat(e.target.value);
    const updatedMap = new Map(hoursMap);
    updatedMap.set(id, isNaN(newHours) ? 0 : newHours);
    setHoursMap(updatedMap);
  };
  
  return (
    <div>
      <span>{name}</span>
      <input 
        type="number"
        value={hoursMap.get(id) || 0}
        onChange={handleHoursChange}
      />
      <span>{tipOutMap.get(id)?.toFixed(2) || 0}</span>
    </div>
  )
}