import React from 'react';
import {TDatePicker} from '../lib';

const TDatePickerWrapper = props => (
       <TDatePicker 
         {...props}    
         onDateSelect={date => console.log("On Date Change-->", date)} 
       />
    );
export default TDatePickerWrapper;
