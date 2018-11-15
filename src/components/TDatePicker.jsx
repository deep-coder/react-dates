import React from 'react';
import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';
import moment from 'moment';
import omit from 'lodash/omit';
import { withStyles, css } from 'react-with-styles';

import SingleDatePicker from './SingleDatePicker';
import MonthSelector from './MonthSelector';
import YearSelector from './YearSelector';
import Button from './Button';

import { SingleDatePickerPhrases } from '../defaultPhrases';
import SingleDatePickerShape from '../shapes/SingleDatePickerShape';
import { HORIZONTAL_ORIENTATION, ANCHOR_LEFT } from '../constants';
import isInclusivelyAfterDay from '../utils/isInclusivelyAfterDay';

const propTypes = {
  // example props for the demo
  autoFocus: PropTypes.bool,
  initialDate: momentPropTypes.momentObj,

  ...omit(SingleDatePickerShape, [
    'date',
    'onDateChange',
    'focused',
    'onFocusChange',
  ]),
  onDateSelect: PropTypes.func.isRequired,
};

const defaultProps = {
  // example props for the demo
  autoFocus: false,
  initialDate: null,

  // input related props
  id: 'date',
  placeholder: 'Date',
  disabled: false,
  required: false,
  screenReaderInputMessage: '',
  showClearDate: false,
  showDefaultInputIcon: false,
  customInputIcon: null,
  block: false,
  small: false,
  regular: false,
  verticalSpacing: undefined,
  keepFocusOnInput: false,

  // calendar presentation and interaction related props
  renderMonthText: null,
  orientation: HORIZONTAL_ORIENTATION,
  anchorDirection: ANCHOR_LEFT,
  horizontalMargin: 0,
  withPortal: false,
  withFullScreenPortal: false,
  initialVisibleMonth: null,
  numberOfMonths: 2,
  keepOpenOnDateSelect: false,
  reopenPickerOnClearDate: false,
  isRTL: false,

  // navigation related props
  navPrev: null,
  navNext: null,
  onPrevMonthClick() {},
  onNextMonthClick() {},
  onClose() {},

  // day presentation and interaction related props
  renderCalendarDay: undefined,
  renderDayContents: null,
  enableOutsideDays: false,
  isDayBlocked: () => false,
  isOutsideRange: day => !isInclusivelyAfterDay(day, moment()),
  isDayHighlighted: () => {},

  // internationalization props
  displayFormat: () => moment.localeData().longDateFormat('L'),
  monthFormat: 'MMMM YYYY',
  phrases: SingleDatePickerPhrases,
};
class TDatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focused: props.autoFocus,
      date: props.initialDate,
    };

    this.onDateChange = this.onDateChange.bind(this);
    this.onFocusChange = this.onFocusChange.bind(this);
    this.onPrevMonthClick = this.onPrevMonthClick.bind(this);
    this.onNextMonthClick = this.onNextMonthClick.bind(this);
    this.onTodayCliked = this.onTodayCliked.bind(this);
  }

  onDateChange(date) {
    this.props.onDateSelect(date);
    this.setState({ date });   
  }

  onFocusChange({ focused }) {
    this.setState({ focused });
  }

  onPrevMonthClick(month, onMonthSelect, onYearSelect) {
    return () => onMonthSelect(month, month.month() - 1);
  }

  onNextMonthClick(month, onMonthSelect, onYearSelect) {
    return () => onMonthSelect(month, month.month() + 1);
  }

  onTodayCliked(month, onMonthSelect) {
    return () => {
      this.setState({ date: moment() }, () => {
        onMonthSelect(month, moment.months().indexOf(moment().format('MMMM')));
      });
    };
  }

  render() {
    const { focused, date } = this.state;

    // autoFocus and initialDate are helper props for the example wrapper but are not
    // props on the SingleDatePicker itself and thus, have to be omitted.
    const props = omit(this.props, [
      'autoFocus',
      'initialDate',
    ]);

    return (
      <SingleDatePicker
        {...props}
        renderMonthElement={({ month, onMonthSelect, onYearSelect }) => (
          <div {...css(props.styles.monthElementStyle)}>
            <MonthSelector
              onPrevMonthClick={this.onPrevMonthClick(month, onMonthSelect, onYearSelect)}
              onNextMonthClick={this.onNextMonthClick(month, onMonthSelect, onYearSelect)}
              monthLabel={moment.months(month.month())}
            />

            <YearSelector
              month={month}
              onYearSelect={onYearSelect}
              minYear={2011}
              maxYear={2030}
            />
            <Button onClick={this.onTodayCliked(month, onMonthSelect)} label="Today" />
          </div>
        )}
        readOnly
        numberOfMonths={1}
        id="date_input"
        date={date}
        placeholder="Day Month DD,YYYY"
        focused={focused}
        onDateChange={this.onDateChange}
        onFocusChange={this.onFocusChange}
        weekDayFormat="ddd"
        displayFormat="ddd MMM DD,YYYY"
        hideKeyboardShortcutsPanel
      />
    );
  }
}

TDatePicker.propTypes = propTypes;
TDatePicker.defaultProps = defaultProps;
export default withStyles(({
  reactDates: {
    color, font, spacing, typography,
  },
}) => ({
  monthElementStyle: {
    display: 'flex',
    justifyContent: 'space-around',
  },

}), { pureComponent: typeof React.PureComponent !== 'undefined' })(TDatePicker);
