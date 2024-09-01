import React, { useState, useEffect } from 'react';
import { StaffGroup } from './StaffGroup';
// import { useRecoilState, useRecoilValue } from 'recoil';
// import { cashTipState, creditCardTipState, tipSum } from '../recoilStore';

const currentDate: Date = new Date(); 
const options: Intl.DateTimeFormatOptions = {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
};

const formattedDate: string = currentDate.toLocaleDateString(undefined, options);

type StaffMember = {
  id: number;
  name: string;
  hours: number;
  tipOutAmount: number;
}

type StaffData = {
  cashTips: number;
  creditCardTips: number;
  staff: StaffMember[];
}

//function to generate random hours and tips

const getRandomHours = (min: number, max: number) => 
  +(Math.random() * (max - min) + min).toFixed(1);

const getRandomTips = (min: number, max: number) => 
  +(Math.random() * (max - min) + min).toFixed(2);


export const DailyTipSheet: React.FunctionComponent = () => {
  const [data, setData] = useState<StaffData | null>(null);
  const [isEditingCashTips, setIsEditingCashTips] = useState(false);
  const [isEditingStaffHours, setIsEditingStaffHours] = useState(false);
  const [cashTipsInput, setCashTipsInput] = useState<number>(0);

  const calculateTipOutAmounts = (staff: StaffMember[], cashTips: number, creditCardTips: number) => {
    const tipTotal = cashTips + creditCardTips;
    const totalHours = staff.reduce((sum, member) => sum + member.hours, 0);
    const tipOutRate = totalHours > 0 ? tipTotal / totalHours : 0;

    return staff.map(member => ({
      ...member,
      tipOutAmount: member.hours * tipOutRate
    }));
  };
  useEffect (() => {
    //handles updates to saved changes for staff hours and cash tips
    const today = new Date().toISOString().split('T')[0];

    const generatedStaff = [
      {id: 1, name: 'Adrian', hours: getRandomHours(4.5, 8), tipOutAmount: 0 },
      {id: 2, name: 'Antonio', hours: getRandomHours(4.5, 8), tipOutAmount: 0 },
      {id: 3, name: 'Zachary', hours: getRandomHours(4.5, 8), tipOutAmount: 0 },
      {id: 4, name: 'Ryan', hours: getRandomHours(4.5, 8), tipOutAmount: 0 },
      {id: 5, name: 'Alex', hours: getRandomHours(4.5, 8), tipOutAmount: 0 },
      {id: 6, name: 'Victor', hours: getRandomHours(4.5, 8), tipOutAmount: 0 }
    ];

    const generatedData: StaffData = {
      cashTips: 0, // sets cash Tips to zero on load
      creditCardTips: getRandomTips(92, 387), // Set rand. CC tips
      staff: generatedStaff,
      
    }
    const tipTotal = generatedData.cashTips + generatedData.creditCardTips;
    const totalHours = generatedData.staff.reduce((sum, member) => sum + member.hours, 0);
    const tipOutRate = totalHours > 0 ? tipTotal / totalHours : 0;

    const updatedStaff = generatedData.staff.map(member => ({
      ...member,
      tipOutAmount: member.hours * tipOutRate,
    }));

    setData({ ...generatedData, staff: updatedStaff }); // Sets generated data to state
  }, []);

  useEffect(() => {
    if (data) {
      // computes the tipTotal and tipOut rate after changes
      const tipTotal = data.cashTips + data.creditCardTips;
      const totalHours = data.staff.reduce((sum, member) => sum + member.hours, 0);
      const tipOutRate = totalHours > 0 ? tipTotal / totalHours : 0;

      //updates tip amount for each staff member
      const updatedStaff = data.staff.map(member => ({
        ...member, 
        tipOutAmount: member.hours * tipOutRate,
      }))

      setData({ ...data, staff: updatedStaff });
    }
  }, [data?.cashTips, data?.staff]);

  
  const handleCashTipsSave = () => {
    if (data) {
      setData({...data, cashTips: cashTipsInput });
      setIsEditingCashTips(false);
    }
  }

  const handleStaffHoursSave = (updatedStaff: StaffMember[]) => {
    if (data) {
      setData({ ...data, staff: updatedStaff });
      setIsEditingStaffHours(false);
    }
  };

  if (!data) {
    return <div>Loading...</div>
  }
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
            ${data.cashTips.toFixed(2)}
            <button onClick={() => setIsEditingCashTips(true)}>Add Cash Tips</button>
          </>
        )}
      </div>
      <div>
        <strong>Credit Card Tips: </strong>${data.creditCardTips.toFixed(2)}
      </div>
      <StaffGroup
        title="Staff Group"
        staff={data.staff}
        isEditingStaffHours={isEditingStaffHours}
        onEditStaffHours={() => setIsEditingStaffHours(true)}
        onSaveStaffHours={handleStaffHoursSave}
      />
    </div>
    
  ) 
};

