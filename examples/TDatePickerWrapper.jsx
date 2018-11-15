import React from 'react';
import TDatePicker from '../src/components/TDatePicker';

const TDatePickerWrapper = props => (
       <TDatePicker 
         {...props}    
         onDateSelect={date => console.log("On Date Change-->", date)} 
       />
    );
export default TDatePickerWrapper;
