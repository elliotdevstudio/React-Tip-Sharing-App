import React, { useState, useEffect } from 'react';
import { RecoilRoot } from 'recoil';
import { DailyTipSheet } from './components/DailyTipSheet';
import { StaffGroup } from './components/StaffGroup';
import staffData from '../staffData.json';




export default function App() {
  

  return (
    <RecoilRoot> 
      <DailyTipSheet />
    </RecoilRoot>
  );
}





  
