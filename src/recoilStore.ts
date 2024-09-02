import  { 
    atom, 
    selector,
  } from 'recoil';
import { getRandomHours, getRandomTips } from "./utils";
import type { StaffMemberType } from './types';
  


  
// Define atoms 
export const cashTipState = atom<number>({
  key:'cashTipState',
  default: 0,
});

export const creditCardTipState = atom<number>({
  key:'creditCardTipState',
  default: getRandomTips(92, 387),
});

export const staffDataState = atom<StaffMemberType[]>({
  key: 'staffDataState',
  default: [
    { id: 1, name: 'Adrian', hours: getRandomHours(4.5, 8), tipOutAmount: 0 },
    { id: 2, name: 'Antonio', hours: getRandomHours(4.5, 8), tipOutAmount: 0 },
    { id: 3, name: 'Zachary', hours: getRandomHours(4.5, 8), tipOutAmount: 0 },
    { id: 4, name: 'Ryan', hours: getRandomHours(4.5, 8), tipOutAmount: 0 },
    { id: 5, name: 'Alex', hours: getRandomHours(4.5, 8), tipOutAmount: 0 },
    { id: 6, name: 'Victor', hours: getRandomHours(4.5, 8), tipOutAmount: 0 },
  ],
});

export const tipOutAmountState = selector({
  key: 'tipOutAmountState',
  get: ({ get }) => {
    const cashTips = get(cashTipState);
    const creditCardTips = get(creditCardTipState);
    const staff = get(staffDataState);

    const tipTotal = cashTips + creditCardTips;
    const totalHours = staff.reduce((sum, member) => sum + member.hours, 0);
    const tipOutRate = totalHours > 0 ? tipTotal / totalHours : 0;

    return staff.map(member => ({
      ...member, 
      tipOutAmount: member.hours * tipOutRate,
    }));
  },
});

