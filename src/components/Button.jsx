import React from 'react';
import { withStyles, css } from 'react-with-styles';


const Button = ({ styles, onClick, label }) => <button type="button" {...css(styles.primaryButton)} onClick={onClick}>{label}</button>;


export default withStyles(({ reactDates: { color, font, spacing, typography } }) => ({
  primaryButton: {
    border: '0px',
    color: color.primary,
    ...typography.Tertiary_Action,
    cursor: 'pointer',
    ':hover': {
      outline: 'none !important',
      color: color.primary_hover,
    },
  },

}), { pureComponent: typeof React.PureComponent !== 'undefined' })(Button);
