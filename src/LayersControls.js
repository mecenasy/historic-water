import React from 'react';
import Checkbox from './Checkbox'
import {HuePicker, AlphaPicker} from 'react-color'

const LayersControls = ({ layers, handleChange, checkboxes, colors, onChangeColor, onChangeAlpha }) => (

    <div className="layers-controls">
        {
            layers.map((layer) => (
                <div key= {layer.name + '_div'}>
                    <Checkbox
                        value={ layer.name }
                        label={ layer.name }
                        handleChange={ handleChange }
                        checked={ checkboxes[layer.name] }
                        key={ layer.name + '_checkbox' }
                    />
                    <HuePicker
                        className='layer-changer'
                        key={ layer.name + '_hue' }
                        color={ colors[layer.name]}
                        onChange={ onChangeColor(layer.name) }
                    />
                    <AlphaPicker
                        className='layer-changer'
                        key={ layer.name + '_alpha' }
                        color={ colors[layer.name] }
                        onChange={ onChangeAlpha(layer.name) }
                    />
                    <br key={ layer.name + '_space' }/>
                </div>
            ))
        }
    </div>
);

export default LayersControls;
