import React, { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { StaffGroup } from './StaffGroup';
import {StaffMember} from './StaffMember';
import type { StaffMemberType, StaffData } from '../types';
import { cashTipState, creditCardTipState, tipOutAmountState, staffDataState } from '../recoilStore';
import { getRandomHours } from "../utils";

const currentDate: Date = new Date(); 
const options: Intl.DateTimeFormatOptions = {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
};

const formattedDate: string = currentDate.toLocaleDateString(undefined, options);


//function to generate random hours and tips


export const DailyTipSheet: React.FunctionComponent = () => {
  const [cashTips, setCashTips] = useRecoilState(cashTipState);
  const [creditCardTips] = useRecoilState(creditCardTipState);
  const [staff, setStaff] = useRecoilState(staffDataState);
  const staffWithTipOutAmounts = useRecoilValue(tipOutAmountState);

  const [isEditingCashTips, setIsEditingCashTips] = useState(false);
  const [isEditingStaffHours, setIsEditingStaffHours] = useState(false);
  const [cashTipsInput, setCashTipsInput] = useState<number>(cashTips);

  useEffect(() => {
    if (staff.length === 0) { // Check if staff data is empty to avoid re-initialization
      const initialStaff = [
        { id: 1, name: 'Adrian', hours: getRandomHours(4.5, 8), tipOutAmount: 0 },
        { id: 2, name: 'Antonio', hours: getRandomHours(4.5, 8), tipOutAmount: 0 },
        { id: 3, name: 'Zachary', hours: getRandomHours(4.5, 8), tipOutAmount: 0 },
        { id: 4, name: 'Ryan', hours: getRandomHours(4.5, 8), tipOutAmount: 0 },
        { id: 5, name: 'Alex', hours: getRandomHours(4.5, 8), tipOutAmount: 0 },
        { id: 6, name: 'Victor', hours: getRandomHours(4.5, 8), tipOutAmount: 0 },
      ];

      setStaff(initialStaff); // Set initial staff data with generated hours
    }
  }, [setStaff, staff]);

  const handleCashTipsSave = () => {
    setCashTips(cashTipsInput);
    setIsEditingCashTips(false);
  };

  const handleStaffHoursSave = (updatedStaff:StaffMemberType[]) => {
    setStaff(updatedStaff);
    setIsEditingStaffHours(false);
  };

  

  return (
    <div>
      <h1>{formattedDate} Restaurant -- Tip Sharing Chart</h1>
      <h2>Today's Gratuities / Payroll Breakdown</h2>
      <div>
        <strong>CASH TIPS: </strong>
        {isEditingCashTips ? (
          <>
            <input
              type="number"
              value={cashTipsInput}
              onChange={(e) => setCashTipsInput(parseFloat(e.target.value))}
            />
            <button onClick={handleCashTipsSave}>Save</button>
          </>
        ) : (
          <>
            ${cashTips.toFixed(2)}
            <button onClick={() => setIsEditingCashTips(true)}>Add Cash Tips</button>
          </>
        )}
      </div>
      <div>
        <strong>Credit Card Tips: </strong>${creditCardTips.toFixed(2)}
      </div>
      <StaffGroup
        title="Staff Group"
        staff={staffWithTipOutAmounts}
        isEditingStaffHours={isEditingStaffHours}
        onEditStaffHours={() => setIsEditingStaffHours(true)}
        onSaveStaffHours={handleStaffHoursSave}
      />
    </div>
  );
};