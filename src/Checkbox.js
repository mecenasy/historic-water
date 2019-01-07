import React from 'react';
import PropTypes from 'prop-types';

const Checkbox = ({ value, label, checked, handleChange }) => (
    <div className="checkbox">
        <label>
            <input
              type="checkbox"
              value={ value }
              checked={ checked }
              onChange={ handleChange }
              style={ { marginRight: '12px' } }
            />
           { label }
        </label>
    </div>
);

Checkbox.propTypes = {
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    handleChange: PropTypes.func.isRequired,
};

export default Checkbox;
