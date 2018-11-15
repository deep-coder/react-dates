/**
 * Created by deepcoder on 01/10/18.
 */
import React, { Component } from 'react';
import onClickOutside from 'react-onclickoutside';
import { withStyles, css } from 'react-with-styles';
import DownArrow from './DownArrow';

class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listOpen: false,
      headerTitle: this.props.title,
    };
    this.selectItem = this.selectItem.bind(this);
    this.toggleList = this.toggleList.bind(this);
  }

  handleClickOutside(e) {
    this.setState({
      listOpen: false,
    });
  }

  selectItem(title, id, stateKey) {
    this.setState({
      headerTitle: `${title}`,
      listOpen: false,
    }, this.props.resetThenSet(id, stateKey));
  }

  toggleList() {
    this.setState(prevState => ({
      listOpen: !prevState.listOpen,
    }));
  }

  render() {
    const { list, styles } = this.props;
    const { listOpen, headerTitle } = this.state;
    return (
      <div {...css(styles.DropDownWrapper)}>
        <div {...css(styles.DropDownHeader)} onClick={this.toggleList}>
          <div {...css(styles.DropDownHeaderTitle)}>{headerTitle}</div>
          <div {...css(styles.DropDownExpandMore)}><DownArrow /></div>
        </div>
        {listOpen && (<ul {...css(styles.DropDownList)}>
          {list.map(item => (
            <li {...css(styles.DropDownListItem, item.selected && styles.DropDownYearSelected)} key={item.id} onClick={() => this.selectItem(item.title, item.id, item.key)}>
              {item.title}
            </li>
          ))}
                      </ul>
        )}
      </div>
    );
  }
}

export default withStyles(({
  reactDates: {
    color, font, spacing, typography,
  },
}) => ({
  DropDownWrapper: {
    userSelect: 'none',
    width: '88px',
    cursor: 'pointer',
    ...typography.heading4,
  },
  DropDownHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    lineHeight: '25px',
    border: '1px solid #dfdfdf',
    borderRadius: '3px',
    cursor: 'default',
    position: 'relative',
    backgroundColor: '#fff',
    span: {
      marginRight: '20px',
    },
  },
  DropDownHeaderTitle: {
    marginLeft: '12px',
  },
  DropDownExpandMore: {
    display: 'flex',
    width:'16px',
    padding:2,
  },
  DropDownList: {
    transition: 'all 0.3s ease-in-out 0s, visibility 0s linear 0.3s, z-index 0s linear 0.01s',
    listStyle: 'none',
    width: '88px',
    zIndex: '100',
    position: 'absolute',
    border: '1px solid #dfdfdf',
    borderTop: 'none',
    borderBottomRightRadius: '3px',
    borderBottomLeftRadius: '3px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 5px -1px #e8e8e8',
    maxHeight: '215px',
    overflowY: 'scroll',
    paddingInlineStart: '0px',
    marginTop: '0px',
  },
  DropDownListItem: {
    textAlign: 'left',
    paddingLeft: '12px',
    lineHeight: '32px',
    verticalAlign: 'middle',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: color.secondary_hover,
    },
  },
  DropDownYearSelected: {
    backgroundColor: color.secondary_hover,
  },

}), { pureComponent: typeof React.PureComponent !== 'undefined' })(onClickOutside(Dropdown));
