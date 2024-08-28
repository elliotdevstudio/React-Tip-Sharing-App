import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { RecoilRoot } from 'recoil';
import { DailyTipSheet } from './components/DailyTipSheet';
import { StaffGroup } from './components/StaffGroup';

const sampleStaff = [
  { id: 1, name: 'Adrian', hours: 7.5 },
  { id: 2, name: 'Antonio', hours: 6.0 },
  { id: 3, name: 'Francisco', hours: 8.0 },
  { id: 4, name: 'Jorge', hours: 5.5 },
  { id: 5, name: 'Victor', hours: 7.0 },
];

export default function App() {
  return (
    <RecoilRoot>
      <DailyTipSheet />
      <StaffGroup title="BOH Staff" staff={sampleStaff} />
    </RecoilRoot>
  );
}
// create tipinput component that simply takes a number





  

  
  
    /*
    function StaffGroupList() {
      //** tasks to create this list */
      // subscribe to tip total 
      /**  create a file with an array of objects representing
       *   each staff member. start with fixed percentages for each 
       *   group to demonstrate the calculator, then add in the option
       *   to choose the percertage-- explore ways to create that functionality
       *   in pure functions to alter the state. might look like this at 
       *   first: 
       * 
       *    const groups = [
                kitchen staff: {
                  employees: [
                    David:{
                      hours: 2, 
                      tipout: 0, 
                      wage: 18;
                      dollarPerHour: 0; 
                      percentTotalPay: 0
                    },
                    Antonio: {
                      hours: 2, 
                      tipout: 0, 
                      wage: 18;
                      dollarPerHour: 0; 
                      percentTotalPay: 0
                    },
                    Ryan: {
                      hours: 2, 
                      tipout: 0, 
                      wage: 18;
                      dollarPerHour: 0; 
                      percentTotalPay: 0
                    },
                    Peter: {
                      hours: 6.5, 
                      tipout: 0, 
                      wage: 18;
                      dollarPerHour: 0; 
                      percentTotalPay: 0
                    },
                    Jorge: {
                      hours: 5.8, 
                      tipout: 0, 
                      wage: 18;
                      dollarPerHour: 0; 
                      percentTotalPay: 0
                    }]};
                  servers: {
                    PercentPayoutKitchenStaff: .15;
                    PercentPayoutSupportStaff: .15;
                    employees: [
                      Philip: {
                        hours: 6.15;
                        cashTips: 0;
                        creditCardTips: 0
                      },
                      Diane: {
                        hours: 5.85;
                        cashTips: 0;
                        creditCardTips: 0
                      }]};
              };
       *    
       * 
       *  
       * 
       * 
       
       * 
      */

    
      /* create employeehours state, inital (null)
      return (
        <div className={groupTableHeadings}>
        <h2>{group.title} + "staff"</h2>
        <h3>Name</h3>
        <h3>Hours</h3>
        <h3>Tips from To-go</h3>
        <h3>Tips from Tip-out</h3>
        <h3>NET TIPS Earned</h3>
        <h3>Pay per hour</h3>
        <h3>Gross Pay</h3>
        <h3>% of gross pay</h3>
        </div>
        **map through each staff member worked 
        staffEntry.map(()=> {
          <DailyStaffl
        })
        )
      }
      */
     
     
     
     // const [creditCardTips, setCreditCardTips] = useState<number>(0);
     // const [cashTips, setCashTips] = useState<number>(0);
     // const [totalTips, setTotalTips] = useState<number>(0);
     
     
     // function handleCreditCardTips(e: React.ChangeEvent<HTMLInputElement>) {
     //   setCreditCardTips(e.target.value);
       
     // }
     
     // function handleCashTips(e: React.ChangeEvent<HTMLInputElement>) {
     //   setCashTips(e.target.value);
     // }
     
     // function handleTipsChange(creditCardTips: number, cashTips: number){
     //   setTotalTips(cashTips + creditCardTips);