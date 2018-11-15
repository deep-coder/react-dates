import React, { Component } from 'react';
import DropDown from './DropDown';

class YearSelector extends Component {
  constructor(props) {
    super(props);
    const minYear = props.minYear ? props.minYear : 1990;
    const maxYear = props.maxYear ? props.maxYear : 2050;

    const options = [];
    const currentYear = props.month.year();
    let selected = false;
    for (let i = minYear; i <= maxYear; i++) {
      if (currentYear === i) {
        selected = true;
      } else {
        selected = false;
      }
      options.push(
        {
          id: `${i - minYear}`,
          title: `${i}`,
          selected,
          key: 'year',
        },
      );
    }
    this.state = {
      year: options,
    };
    this.toggleSelected = this.toggleSelected.bind(this);
    this.resetThenSet = this.resetThenSet.bind(this);
  }

  toggleSelected(id, key) {
    const temp = [...this.state[key]];
    temp[`${id}`].selected = !temp[id].selected;
    this.setState({
      [key]: temp,
    });
  }

  resetThenSet(id, stateKey) {
    const { onYearSelect, month } = this.props;
    const years = [...this.state.year];
    years.forEach(item => item.selected = false);
    years[`${id}`].selected = true;
    onYearSelect(month, parseInt(years[`${id}`].title, 10));
  }

  render() {
    return (
      <div>
        <DropDown
          title={this.props.month.year()}
          list={this.state.year}
          resetThenSet={this.resetThenSet}
        />
      </div>
    );
  }
}


export default YearSelector;
