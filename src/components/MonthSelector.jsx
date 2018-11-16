import React from 'react';
import { css, withStyles } from 'react-with-styles';
import RightArrow from './RightArrow';
import LeftArrow from './LeftArrow';

const MonthSelector = ({
  styles, onNextMonthClick, onPrevMonthClick, monthLabel,
}) => (
  <div {...css(styles.MonthSelector)}>
    <div onClick={onPrevMonthClick} {...css(styles.monthNavIcon)} role="button" tabIndex={0}>
      <LeftArrow />
    </div>
    <div {...css(styles.monthLabel)}>{monthLabel}</div>
    <div onClick={onNextMonthClick} {...css(styles.monthNavIcon)} role="button" tabIndex={0}>
      <RightArrow />
    </div>
  </div>
);

export default withStyles(({
  reactDates: { typography },
}) => ({
  MonthSelector: {
    display: 'flex',
    minWidth: '90px',
    justifyContent: 'space-around',
  },
  monthNavIcon: {
    paddingTop: 5,
    cursor: 'pointer',
    outline: 'none',
  },
  monthLabel: {
    minWidth: '90px',
    ...typography.heading4,
    lineHeight: '27px',
  },

}), { pureComponent: typeof React.PureComponent !== 'undefined' })(MonthSelector);
