import React from 'react';
import { withStyles, css } from 'react-with-styles';
import Button from './Button';


const FormButtons = ({ styles, onClickApply, onClickCancel }) => (
  <div {...css(
    styles.DayPicker_FormButtons,
  )}
  >
    <Button label="Cancel" onClick={onClickCancel} />
    <Button label="Apply" onClick={onClickApply} />
  </div>
);


export default withStyles(({ reactDates: { color, typography } }) => ({
  DayPicker_FormButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

}), { pureComponent: typeof React.PureComponent !== 'undefined' })(FormButtons);
