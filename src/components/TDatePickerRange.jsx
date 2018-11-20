import React from 'react';
import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';
import moment from 'moment';
import omit from 'lodash/omit';

import { withStyles, withStylesPropTypes, css } from 'react-with-styles';

import DateRangePicker from './DateRangePicker';

import MonthSelector from './MonthSelector';
import YearSelector from './YearSelector';
import Button from './Button';
import CalendarIcon from './CalendarIcon';

import { DateRangePickerPhrases } from '../defaultPhrases';
import DateRangePickerShape from '../shapes/DateRangePickerShape';
import {
  START_DATE, END_DATE, HORIZONTAL_ORIENTATION, ANCHOR_LEFT,
} from '../constants';
import isSameDay from '../utils/isSameDay';

const propTypes = {
  ...withStylesPropTypes,

  // example props for the demo
  autoFocus: PropTypes.bool,
  autoFocusEndDate: PropTypes.bool,
  initialStartDate: momentPropTypes.momentObj,
  initialEndDate: momentPropTypes.momentObj,
  minYear: PropTypes.number,
  maxYear: PropTypes.number,
  presets: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    start: momentPropTypes.momentObj,
    end: momentPropTypes.momentObj,
  })),

  ...omit(DateRangePickerShape, [
    'startDate',
    'endDate',
    'onDatesChange',
    'focusedInput',
    'onFocusChange',
  ]),
};

const defaultProps = {
  // example props for the demo
  minYear: 2011,
  maxYear: 2030,
  autoFocus: false,
  autoFocusEndDate: false,
  initialStartDate: null,
  initialEndDate: null,
  presets: [],

  // input related props
  startDateId: START_DATE,
  startDatePlaceholderText: 'Start Date',
  endDateId: END_DATE,
  endDatePlaceholderText: 'End Date',
  disabled: false,
  required: false,
  screenReaderInputMessage: '',
  showClearDates: false,
  showDefaultInputIcon: false,
  customInputIcon: null,
  customArrowIcon: null,
  customCloseIcon: null,

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
  reopenPickerOnClearDates: false,
  isRTL: false,

  // navigation related props
  navPrev: null,
  navNext: null,
  onPrevMonthClick() {},
  onNextMonthClick() {},
  onClose() {},

  // day presentation and interaction related props
  renderDayContents: null,
  minimumNights: 0,
  enableOutsideDays: false,
  isDayBlocked: () => false,
  isOutsideRange: day => false,
  isDayHighlighted: () => false,

  // internationalization
  displayFormat: () => moment.localeData().longDateFormat('L'),
  monthFormat: 'MMMM YYYY',
  phrases: DateRangePickerPhrases,
};

class DateRangePickerWrapper extends React.Component {
  constructor(props) {
    super(props);

    let focusedInput = null;
    if (props.autoFocus) {
      focusedInput = START_DATE;
    } else if (props.autoFocusEndDate) {
      focusedInput = END_DATE;
    }

    this.state = {
      focusedInput,
      startDate: props.initialStartDate,
      endDate: props.initialEndDate,
    };

    this.onDatesChange = this.onDatesChange.bind(this);
    this.onFocusChange = this.onFocusChange.bind(this);
    this.renderDatePresets = this.renderDatePresets.bind(this);
    this.onPrevMonthClick = this.onPrevMonthClick.bind(this);
    this.onNextMonthClick = this.onNextMonthClick.bind(this);
    this.onTodayCliked = this.onTodayCliked.bind(this);
  }

  onDatesChange({ startDate, endDate }) {
    this.setState({ startDate, endDate });
  }

  onFocusChange(focusedInput) {
    this.setState({ focusedInput });
  }

  onPrevMonthClick(month, onMonthSelect) {
    return () => onMonthSelect(month, month.month() - 1);
  }

  onNextMonthClick(month, onMonthSelect) {
    return () => onMonthSelect(month, month.month() + 1);
  }

  onTodayCliked(month, onMonthSelect) {
    return () => {
      this.setState({ date: moment() }, () => {
        onMonthSelect(month, moment.months().indexOf(moment().format('MMMM')));
      });
    };
  }

  renderDatePresets() {
    const { presets, styles } = this.props;
    const { startDate, endDate } = this.state;

    return (
      <div {...css(styles.PresetDateRangePicker_panel)}>
        <div {...css(styles.PresetDateRangePicker_header)}>Select Date</div>
        {presets.map(({ text, start, end }) => {
          const isSelected = isSameDay(start, startDate) && isSameDay(end, endDate);
          return (
            <button
              key={text}
              {...css(
                styles.PresetDateRangePicker_button,
                isSelected && styles.PresetDateRangePicker_button__selected,
              )}
              type="button"
              onClick={() => this.onDatesChange({ startDate: start, endDate: end })}
            >
              {text}
            </button>
          );
        })}
      </div>
    );
  }

  render() {
    const { focusedInput, startDate, endDate } = this.state;

    // autoFocus, autoFocusEndDate, initialStartDate and initialEndDate are helper props for the
    // example wrapper but are not props on the SingleDatePicker itself and
    // thus, have to be omitted.
    const props = omit(this.props, [
      'autoFocus',
      'autoFocusEndDate',
      'initialStartDate',
      'initialEndDate',
      'presets',
    ]);

    return (
      <div>
        <DateRangePicker
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
                minYear={props.minYear}
                maxYear={props.maxYear}
              />
              <Button onClick={this.onTodayCliked(month, onMonthSelect)} label="Today" />
            </div>
          )}
          {...props}
          customInputIcon={<CalendarIcon />}
          inputIconPosition="after"
          readOnly
          calendarInfoPosition="before"
          renderCalendarInfo={this.renderDatePresets}
          onDatesChange={this.onDatesChange}
          onFocusChange={this.onFocusChange}
          focusedInput={focusedInput}
          startDate={startDate}
          endDate={endDate}
          weekDayFormat="ddd"
          displayFormat="ddd MMM DD,YYYY"
          hideKeyboardShortcutsPanel
        />
      </div>
    );
  }
}

DateRangePickerWrapper.propTypes = propTypes;
DateRangePickerWrapper.defaultProps = defaultProps;

export default withStyles(({ reactDates: { color } }) => ({
  PresetDateRangePicker_panel: {
    padding: '0 11px 11px 0px',
    display: 'flex',
    flexDirection: 'column',
  },
  monthElementStyle: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  PresetDateRangePicker_header: {
    padding: '25px 10px 10px 15px',
    fontWeight: '600',
  },

  PresetDateRangePicker_button: {
    fontFamily: 'Proxima-Nova-Regular',
    fontWeight: '300',
    textAlign: 'left',
    borderRight: 0,
    borderBottom: 0,
    borderTop: 0,
    borderLeft: '2px solid transparent',
    position: 'relative',
    height: '100%',
    background: 'none',
    padding: '4px 0px',
    marginRight: 8,
    font: 'inherit',
    lineHeight: 'normal',
    overflow: 'visible',
    boxSizing: 'border-box',
    cursor: 'pointer',
    outline: 'none',
    marginBottom: '10px',
    paddingLeft: '12px',
    ':active': {
      outline: 0,
    },
  },

  PresetDateRangePicker_button__selected: {
    borderLeft: '2px solid green',
    fontWeight: '600',

  },
}))(DateRangePickerWrapper);
