import React from 'react';
import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';
import moment from 'moment';
import omit from 'lodash/omit';

import { withStyles, withStylesPropTypes, css } from 'react-with-styles';

import DateRangePicker from './DateRangePicker';

import CalendarIcon from './CalendarIcon';
import MonthElement from './MonthElement';

import { DateRangePickerPhrases } from '../defaultPhrases';
import DateRangePickerShape from '../shapes/DateRangePickerShape';
import {
  START_DATE, END_DATE, HORIZONTAL_ORIENTATION, ANCHOR_LEFT,
} from '../constants';
import isSameDay from '../utils/isSameDay';
// const TestCustomCloseIcon = () => (
//   <span
//     style={{
//       border: '1px solid #dce0e0',
//       backgroundColor: '#fff',
//       color: '#484848',
//       padding: '3px',
//     }}
//   >'X'</span>
// );
const today = moment();
const propTypes = {
  ...withStylesPropTypes,
  autoFocus: PropTypes.bool,
  autoFocusEndDate: PropTypes.bool,
  initialStartDate: momentPropTypes.momentObj,
  initialEndDate: momentPropTypes.momentObj,
  minYear: PropTypes.number,
  maxYear: PropTypes.number,
  RangePresets: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    start: momentPropTypes.momentObj,
    end: momentPropTypes.momentObj,
  })),
  presets: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    start: momentPropTypes.momentObj,
    end: momentPropTypes.momentObj,
  })),
  // input related props
  startDateId: PropTypes.string,
  startDatePlaceholderText: PropTypes.string,
  endDateId: PropTypes.string,
  endDatePlaceholderText: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  screenReaderInputMessage: PropTypes.string,
  showClearDates: PropTypes.bool,
  showDefaultInputIcon: PropTypes.bool,
  customInputIcon: PropTypes.node,
  customArrowIcon: PropTypes.node,
  customCloseIcon: PropTypes.node,

  // calendar presentation and interaction related props
  renderMonthText: PropTypes.node,
  orientation: PropTypes.string,
  anchorDirection: PropTypes.string,
  horizontalMargin: 0,
  withPortal: PropTypes.bool,
  withFullScreenPortal: PropTypes.bool,
  initialVisibleMonth: PropTypes.node,
  numberOfMonths: PropTypes.number,
  keepOpenOnDateSelect: PropTypes.bool,
  reopenPickerOnClearDates: PropTypes.bool,
  isRTL: PropTypes.bool,

  // navigation related props
  navPrev: PropTypes.node,
  navNext: PropTypes.node,

  // day presentation and interaction related props
  renderDayContents: PropTypes.node,
  minimumNights: PropTypes.number,
  enableOutsideDays: PropTypes.bool,
  isDayBlocked: PropTypes.func,
  isOutsideRange: PropTypes.func,
  isDayHighlighted: PropTypes.func,

  // internationalization
  displayFormat: () => moment.localeData().longDateFormat('L'),
  monthFormat: PropTypes.string,
  phrases: DateRangePickerPhrases,
  ...omit(DateRangePickerShape, [
    'startDate',
    'endDate',
    'onDatesChange',
    'focusedInput',
    'onFocusChange',
  ]),
  onDatesChange: PropTypes.func.isRequired,
  defaultPresets: PropTypes.bool,
};

const defaultProps = {
  // example props for the demo
  minYear: 2011,
  maxYear: 2030,
  autoFocus: false,
  autoFocusEndDate: false,
  initialStartDate: null,
  initialEndDate: null,
  defaultPresets: false,
  RangePresets: [],
  presets: [{
    text: 'Last Week',
    start: moment().add(-1, 'week'),
    end: today,
  },
  {
    text: 'Last 15 Days',
    start: moment().add(-15, 'days'),
    end: today,
  },
  {
    text: 'Last 30 Days',
    start: moment().add(-1, 'month'),
    end: today,
  },
  {
    text: 'Next Week',
    start: today,
    end: moment().add(1, 'week'),
  },
  {
    text: 'Next 15 Days',
    start: today,
    end: moment().add(15, 'days'),
  },
  {
    text: 'Next 30 Days',
    start: today,
    end: moment().add(1, 'month'),
  },
  ],

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

  // day presentation and interaction related props
  renderDayContents: null,
  minimumNights: 0,
  enableOutsideDays: false,
  isDayBlocked: () => false,
  isOutsideRange: () => false,
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
    const tempPreset = props.RangePresets.map(preset => ({
      text: preset.text,
      start: preset.value < 0 ? moment().add(preset.value, preset.dateType) : today,
      end: preset.value < 0 ? today : moment().add(preset.value, preset.dateType),
    }));

    this.state = {
      focusedInput,
      startDate: props.initialStartDate,
      endDate: props.initialEndDate,
      presets: props.defaultPresets ? [...props.presets, ...tempPreset] : tempPreset,
    };

    this.onDatesChange = this.onDatesChange.bind(this);
    this.onFocusChange = this.onFocusChange.bind(this);
    this.renderDatePresets = this.renderDatePresets.bind(this);
  }


  onDatesChange({ startDate, endDate }) {
    const { onDatesChange } = this.props;
    this.setState({ startDate, endDate },
      () => onDatesChange(startDate, endDate));
  }

  onFocusChange(focusedInput) {
    this.setState({ focusedInput });
  }


  renderDatePresets() {
    const { styles } = this.props;
    const { startDate, endDate, presets } = this.state;
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
            <MonthElement
              month={month}
              onMonthSelect={onMonthSelect}
              onYearSelect={onYearSelect}
              maxYear={props.maxYear}
              minYear={props.minYear}
            />)}
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
          // showClearDate
          // customCloseIcon={<TestCustomCloseIcon />}
        />
      </div>
    );
  }
}

DateRangePickerWrapper.propTypes = propTypes;
DateRangePickerWrapper.defaultProps = defaultProps;

export default withStyles(() => ({
  PresetDateRangePicker_panel: {
    padding: '0 11px 143px 0px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#EDEEF0',
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
