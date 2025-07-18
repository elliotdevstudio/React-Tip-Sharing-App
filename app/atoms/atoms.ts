// 'use client'

// import  { 
//   atom
// } from 'jotai';

// import { mockStaffMembers } from '../lib/mock-data';
// import { getRandomTips } from "../utils";

// // Staff roster (master list of all staff)
// export const staffMemberState = atom(mockStaffMembers)

// // Current active staff group (working today)
// export const activeStaffGroupState = atom<StaffMember[]>([])

// // All staff groups created
// export const StaffGroupState = atom<StaffGroup[]>([])

// // Tip atoms - three sources
// // export const cashTipState = atom(0);
// export const creditCardTipState = atom(0);
// export const cashierCreditCardTipState = atom(() => getRandomCashierTips(75, 185))

// // export const totalTipState = atom((get)=> {
// //   const cashTips = get(cashTipState);
// //   const creditCardTips = get(creditCardTipState);
// //   return cashTips + creditCardTips
// // })
  
// export const totalHoursState = atom((get) => {
//   const staff = get(staffDataState)
//   return staff.reduce((sum, member) => sum + member.hours, 0)
// })


// export const tipOutRateState = atom((get) => {
//   const totalTips = get(totalTipState)
//   const totalHours = get(totalHoursState)
//   // const totalHours = staff.reduce((sum, member) => sum + (member.hours || 0), 0);
//   return totalHours > 0 ? totalTips / totalHours : 0;
// })

// export const staffWithTipOutAmountState = atom((get) => { 
//   const staff = get()
//   const tipOutRate = get(tipOutRateState)

//   return StaffMember.map(member => ({ 
//     ...member,
//     tipOutAmount: member.hours * tipOutRate,
//     formattedTipOut: `$${(member.hours * tipOutRate).toFixed(2)}`,
//     tipPercentage: tipOutRate > 0 ? ((member.hours * tipOutRate / get(totalTipState)) * 100).toFixed(1) : '0'
//   }))
// })