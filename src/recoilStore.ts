import  { 
    atom, 
    selector,
    RecoilState,
  } from 'recoil';

// Define atoms 
export const cashTipState: RecoilState<number> = atom({
  key:'cashTipState',
  default: 0,
});

export const creditCardTipState: RecoilState<number> = atom({
  key:'creditCardTipState',
  default: 0,
});

export const tipSum = selector({
  key: 'tipTotal',
  get: ({ get }) => {
    const cashTips = get(cashTipState);
    const creditCardTips = get(creditCardTipState);
    return cashTips + creditCardTips;
  },
});

export const staffHourState = atom({
  key: 'hours',
  default: new Map<number, number>()
});

export const staffTipOutSelector = selector({
  key: 'staffTipOutSelector',
  get: ({ get }) => {
    const tipTotal = get(tipSum);
    const hoursMap = get(staffHourState);
    const totalHours = Array.from(hoursMap.values()).reduce((sum, hours) => sum + hours, 0);

    return new Map(
      Array.from(hoursMap.entries()).map(([id, hours]) => [
        id,
        (tipTotal / totalHours) * hours,
      ])
    );
  },
});