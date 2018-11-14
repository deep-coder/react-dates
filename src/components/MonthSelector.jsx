import React from 'react';
import { css, withStyles } from 'react-with-styles';
import RightArrow from './RightArrow';
import LeftArrow from './LeftArrow';

const MonthSelector = ({
 styles, onNextMonthClick, onPrevMonthClick, monthLabel 
}) => (
  <div {...css(styles.MonthSelector)}>
    <div onClick={onPrevMonthClick} {...css(styles.monthNavIcon)}><LeftArrow /></div>
    <div {...css(styles.monthLabel)}>{monthLabel}</div>
    <div onClick={onNextMonthClick} {...css(styles.monthNavIcon)}><RightArrow /></div>
  </div>
);

export default withStyles(({ reactDates: {
 color, font, spacing, typography 
} }) => ({
  MonthSelector: {
    display: 'flex',
    minWidth: '90px',
    justifyContent: 'space-around',
  },
  monthNavIcon: {
    cursor: 'pointer',
  },
  monthLabel: {
    minWidth: '90px',
    ...typography.heading4,
  },

}), { pureComponent: typeof React.PureComponent !== 'undefined' })(MonthSelector);
