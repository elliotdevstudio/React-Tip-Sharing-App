import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { cashTipState, creditCardTipState, tipSum } from '../recoilStore';

export const DailyTipEntry: React.FunctionComponent = () => {
  const [cashTips, setCashTips] = useRecoilState(cashTipState);
  const [creditCardTips, setCreditCardTips] = useRecoilState(creditCardTipState);
  const tipTotal = useRecoilValue(tipSum);

  const handleCreditCardTips = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseFloat(e.target.value);
    setCreditCardTips(isNaN(inputValue) ? 0 : inputValue);
    
  };
  
  const handleCashTips = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseFloat(e.target.value);
    setCashTips(isNaN(inputValue) ? 0 : inputValue);
  };

  return (
    <div>
      <label>
        Credit Card Tips:
        <input onChange={handleCreditCardTips}
          />
      </label>
      <label>
        Cash Tips:
        <input onChange={handleCashTips}
          /></label>
      <p>Total Tips:{tipTotal}</p>
    </div>
    );

}