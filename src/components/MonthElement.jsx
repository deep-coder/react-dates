import React from 'react';
import moment from 'moment';
import { withStyles, css } from 'react-with-styles';
import MonthSelector from './MonthSelector';
import YearSelector from './YearSelector';
import Button from './Button';

const MonthElement = ({
  month, onMonthSelect, onYearSelect, minYear, maxYear, styles,
}) => {
  const onPrevMonthClick = () => () => onMonthSelect(month, month.month() - 1);
  const onNextMonthClick = () => () => onMonthSelect(month, month.month() + 1);
  const onTodayCliked = () => () => onYearSelect(moment(), moment().format('YYYY'));
  return (
    <div {...css(styles.monthElementStyle)}>
      <MonthSelector
        onPrevMonthClick={onPrevMonthClick(month, onMonthSelect, onYearSelect)}
        onNextMonthClick={onNextMonthClick(month, onMonthSelect, onYearSelect)}
        monthLabel={moment.months(month.month())}
      />

      <YearSelector
        month={month}
        onYearSelect={onYearSelect}
        minYear={minYear}
        maxYear={maxYear}
      />
      <Button onClick={onTodayCliked(month, onMonthSelect, onYearSelect)} label="Today" />
    </div>
  );
};

export default withStyles(() => ({
  monthElementStyle: {
    display: 'flex',
    justifyContent: 'space-around',
  },

}), { pureComponent: typeof React.PureComponent !== 'undefined' })(MonthElement);
