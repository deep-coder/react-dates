import React from 'react';
import TDatePickerRange from '../src/components/TDatePickerRange';

const TDatePickerWrapper = () => (
  <TDatePickerRange
    defaultPresets
    // RangePresets={[{
    //   text: 'Last 2 months',
    //   value: '-60',
    //   dateType: 'days',
    // },
    // {
    //   text: 'Next 2 months',
    //   value: '60',
    //   dateType: 'days',
    // }]}
    onDatesChange={(startDate, endDate) => console.log('On Dates <<>> Change-->', startDate, endDate)}
  />
);
export default TDatePickerWrapper;
