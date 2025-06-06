'use client'

import  { 
  atom
} from 'jotai';
import { getRandomHours, getRandomTips } from "../app/utils";
import type { StaffMemberType } from '../app/types';



// Define atoms 
export const cashTipState = atom(0);
export const creditCardTipState = atom(getRandomTips(92, 387));

export const staffDataState = atom([
  { id: 1, name: 'Adrian', hours: getRandomHours(4.5, 8), tipOutAmount: 0 },
  { id: 2, name: 'Antonio', hours: getRandomHours(4.5, 8), tipOutAmount: 0 },
  { id: 3, name: 'Zachary', hours: getRandomHours(4.5, 8), tipOutAmount: 0 },
  { id: 4, name: 'Ryan', hours: getRandomHours(4.5, 8), tipOutAmount: 0 },
  { id: 5, name: 'Alex', hours: getRandomHours(4.5, 8), tipOutAmount: 0 },
  { id: 6, name: 'Victor', hours: getRandomHours(4.5, 8), tipOutAmount: 0 },
]);

export const totalTipState = atom((get)=> {
  const cashTips = get(cashTipState);
  const creditCardTips = get(creditCardTipState);
  return cashTips + creditCardTips
})
  
export const totalHoursState = atom((get) => {
  const staff = get(staffDataState)
  return staff.reduce((sum, member) => sum + member.hours, 0)
})


export const tipOutRateState = atom((get) => {
  const totalTips = get(totalTipState)
  const totalHours = get(totalHoursState)
  // const totalHours = staff.reduce((sum, member) => sum + (member.hours || 0), 0);
  return totalHours > 0 ? totalTips / totalHours : 0;
})

export const staffWithTipOutAmountState = atom((get) => { 
  const staff = get(staffDataState)
  const tipOutRate = get(tipOutRateState)

  return staff.map(member => ({ 
    ...member,
    tipOutAmount: member.hours * tipOutRate,
    formattedTipOut: `$${(member.hours * tipOutRate).toFixed(2)}`,
    tipPercentage: tipOutRate > 0 ? ((member.hours * tipOutRate / get(totalTipState)) * 100).toFixed(1) : '0'
  }))
})