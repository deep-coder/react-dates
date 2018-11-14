import React from 'react';
import PropTypes from 'prop-types';
import momentPropTypes from 'react-moment-proptypes';
import moment from 'moment';
import omit from 'lodash/omit';
import { withStyles, css } from 'react-with-styles';

import SingleDatePicker from '../src/components/SingleDatePicker';
import MonthSelector from '../src/components/MonthSelector';
import YearSelector from '../src/components/YearSelector';
import Button from '../src/components/Button';

import { SingleDatePickerPhrases } from '../src/defaultPhrases';
import SingleDatePickerShape from '../src/shapes/SingleDatePickerShape';
import { HORIZONTAL_ORIENTATION, ANCHOR_LEFT } from '../src/constants';
import isInclusivelyAfterDay from '../src/utils/isInclusivelyAfterDay';

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
const yearList = ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022'];
class SingleDatePickerWrapper extends React.Component {
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

  onTodayCliked(month, onMonthSelect, onYearSelect) {
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
            <Button onClick={this.onTodayCliked(month, onMonthSelect, onYearSelect)} label="Today" />
          </div>
        )}
        id="date_input"
        date={date}
        focused={focused}
        onDateChange={this.onDateChange}
        onFocusChange={this.onFocusChange}
        weekDayFormat="ddd"
      />
    );
  }
}

SingleDatePickerWrapper.propTypes = propTypes;
SingleDatePickerWrapper.defaultProps = defaultProps;
export default withStyles(({
  reactDates: {
    color, font, spacing, typography,
  },
}) => ({
  monthElementStyle :{
    display:'flex',
    justifyContent: 'space-around',
  }

}), { pureComponent: typeof React.PureComponent !== 'undefined' })(SingleDatePickerWrapper);
