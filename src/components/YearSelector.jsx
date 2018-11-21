import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { forbidExtraProps } from 'airbnb-prop-types';
import { withStylesPropTypes, withStyles } from 'react-with-styles';
import momentPropTypes from 'react-moment-proptypes';
import DropDown from './DropDown';

const propTypes = forbidExtraProps({
  ...withStylesPropTypes,
  minYear: PropTypes.number,
  maxYear: PropTypes.number,
  month: momentPropTypes.momentObj,
  onYearSelect: PropTypes.func,
});

const defaultProps = {
  minYear: 2011,
  maxYear: 2030,
};

class YearSelector extends Component {
  constructor(props) {
    super(props);
    const { minYear, maxYear } = props;
    const options = [];
    const currentYear = props.month.year();
    let selected = false;
    for (let i = minYear; i <= maxYear;) {
      selected = currentYear === i;
      options.push(
        {
          id: `${i - minYear}`,
          title: `${i}`,
          selected,
          key: 'year',
        },
      );
      i += 1;
    }
    this.state = {
      year: options,
    };
    this.resetThenSet = this.resetThenSet.bind(this);
  }


  resetThenSet(id) {
    const { onYearSelect, month } = this.props;
    const { year } = this.state;
    const years = [...year];
    const selectedIndex = years.findIndex(el => el.selected);
    years[selectedIndex].selected = true;
    years[`${id}`].selected = true;
    onYearSelect(month, parseInt(years[`${id}`].title, 10));
  }

  render() {
    const { month } = this.props;
    const { year } = this.state;
    return (
      <DropDown
        title={month.year()}
        list={year}
        resetThenSet={this.resetThenSet}
      />
    );
  }
}

YearSelector.propTypes = propTypes;
YearSelector.defaultProps = defaultProps;

export default withStyles(() => ({


}), { pureComponent: typeof React.PureComponent !== 'undefined' })(YearSelector);
