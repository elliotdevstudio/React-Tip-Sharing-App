import React, { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { StaffGroup } from './StaffGroup';
import type { StaffMemberType } from '../types';
import { cashTipState, creditCardTipState, tipOutAmountState, staffDataState } from '../recoilStore';

const currentDate: Date = new Date(); 
const options: Intl.DateTimeFormatOptions = {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
};

// Today's date displayed on the landing page for the current daily entry 
const formattedDate: string = currentDate.toLocaleDateString(undefined, options);

export const DailyTipSheet: React.FunctionComponent = () => {
  const [cashTips, setCashTips] = useRecoilState(cashTipState);
  const [creditCardTips] = useRecoilState(creditCardTipState);
  const [staff, setStaff] = useRecoilState(staffDataState);
  const staffWithTipOutAmounts = useRecoilValue(tipOutAmountState);

  const [isEditingCashTips, setIsEditingCashTips] = useState(false);
  const [isEditingStaffHours, setIsEditingStaffHours] = useState(false);
  const [cashTipsInput, setCashTipsInput] = useState<number>(cashTips);

  const handleCashTipsSave = () => {
    setCashTips(cashTipsInput);
    setIsEditingCashTips(false);
  };
  const handleStaffHoursSave = (updatedStaff: StaffMemberType[]) => {
    setStaff(updatedStaff); // Update the Recoil state with the new staff data
    setIsEditingStaffHours(false); // Stops editing mode
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