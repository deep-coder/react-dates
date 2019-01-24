import React from 'react';
import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';
import moment from 'moment';
import omit from 'lodash/omit';
import { withStyles } from 'react-with-styles';

import SingleDatePicker from './SingleDatePicker';
import MonthElement from './MonthElement';
import CalendarIcon from './CalendarIcon';

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
  minYear: PropTypes.number,
  maxYear: PropTypes.number,
  id: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  screenReaderInputMessage: PropTypes.string,
  showClearDate: PropTypes.bool,
  showDefaultInputIcon: PropTypes.bool,
  customInputIcon: null,
  block: PropTypes.bool,
  small: PropTypes.bool,
  regular: PropTypes.bool,
  verticalSpacing: undefined,
  keepFocusOnInput: PropTypes.bool,

  // calendar presentation and interaction related props
  renderMonthText: null,
  orientation: HORIZONTAL_ORIENTATION,
  anchorDirection: ANCHOR_LEFT,
  horizontalMargin: 0,
  withPortal: PropTypes.bool,
  withFullScreenPortal: PropTypes.bool,
  initialVisibleMonth: null,
  numberOfMonths: 2,
  keepOpenOnDateSelect: PropTypes.bool,
  reopenPickerOnClearDate: PropTypes.bool,
  isRTL: PropTypes.bool,

  // navigation related props
  navPrev: null,
  navNext: null,
  onPrevMonthClick: PropTypes.func,
  onNextMonthClick: PropTypes.func,
  onClose: PropTypes.func,

  // day presentation and interaction related props
  renderCalendarDay: undefined,
  renderDayContents: null,
  enableOutsideDays: PropTypes.bool,
  isDayBlocked: PropTypes.func,
  isOutsideRange: PropTypes.func,
  isDayHighlighted: PropTypes.func,

  // internationalization props
  displayFormat: PropTypes.func,
  monthFormat: PropTypes.string,
  phrases: PropTypes.Object,
};

const defaultProps = {
  minYear: 2011,
  maxYear: 2030,
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
  }

  componentWillReceiveProps(nextProps) {
    const { initialDate } = nextProps;
    const { initialDate: prevDate } = this.props;
    if (initialDate !== prevDate) {
      this.setState({ date: initialDate });
    }
  }

  onDateChange(date) {
    const { onDateSelect } = this.props;
    onDateSelect(date);
    this.setState({ date });
  }

  onFocusChange({ focused }) {
    this.setState({ focused });
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
          <MonthElement
            month={month}
            onMonthSelect={onMonthSelect}
            onYearSelect={onYearSelect}
            maxYear={props.maxYear}
            minYear={props.minYear}
          />)}
        customInputIcon={<CalendarIcon />}
        inputIconPosition="after"
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
export default withStyles(() => ({
  monthElementStyle: {
    display: 'flex',
    justifyContent: 'space-around',
  },

}), { pureComponent: typeof React.PureComponent !== 'undefined' })(TDatePicker);
