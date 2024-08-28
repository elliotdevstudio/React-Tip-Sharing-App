import React from 'react';
import { DailyTipEntry } from './DailyTipEntry';

const currentDate: Date = new Date(); 
const options: Intl.DateTimeFormatOptions = {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
};

const formattedDate: string = currentDate.toLocaleDateString(undefined, options);

export const DailyTipSheet: React.FunctionComponent = () => {
  return (
    <div>
        <h1>{formattedDate}</h1><h1>Restaurant -- Tip Sharing Chart</h1>
        <DailyTipEntry />
        {/* <DailyAverages />
        <StaffGroupList /> */}
    </div>
    
  ) 
}

export {};