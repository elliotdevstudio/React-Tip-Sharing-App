// import  { 
//     atom, 
//     selector,
//   } from 'recoil';

// // Define atoms 
// export const cashTipState = atom<number>({
//   key:'cashTipState',
//   default: 0,
// });

// export const creditCardTipState = atom<number>({
//   key:'creditCardTipState',
//   default: getRandomTips(92, 387),
// });

// export const staffDataState = atom<StaffMember[]>({
//   key: 'staffDataState',
//   default: [
//     { id: 1, name: 'Adrian', hours: getRandomHours(4.5, 8), tipOutAmount: 0 },
//     { id: 2, name: 'Antonio', hours: getRandomHours(4.5, 8), tipOutAmount: 0 },
//     { id: 3, name: 'Zachary', hours: getRandomHours(4.5, 8), tipOutAmount: 0 },
//     { id: 4, name: 'Ryan', hours: getRandomHours(4.5, 8), tipOutAmount: 0 },
//     { id: 5, name: 'Alex', hours: getRandomHours(4.5, 8), tipOutAmount: 0 },
//     { id: 6, name: 'Victor', hours: getRandomHours(4.5, 8), tipOutAmount: 0 },
//   ],
// });

// export const tipSum = selector({
//   key: 'tipTotal',
//   get: ({ get }) => {
//     const cashTips = get(cashTipState);
//     const creditCardTips = get(creditCardTipState);
//     return cashTips + creditCardTips;
//   },
// });

// export const staffHourState = atom({
//   key: 'hours',
//   default: new Map<number, number>()
// });

// export const staffTipOutSelector = selector({
//   key: 'staffTipOutSelector',
//   get: ({ get }) => {
//     const cashTips = get(cashTipState);
//     const credit
//     const totalHours = Array.from(hoursMap.values()).reduce((sum, hours) => sum + hours, 0);

//     return new Map(
//       Array.from(hoursMap.entries()).map(([id, hours]) => [
//         id,
//         (tipTotal / totalHours) * hours,
//       ])
//     );
//   },
// });