import React from 'react';
import PropTypes from 'prop-types';
import { GeoJSON } from 'react-leaflet';

const VectorLayer = ({ layer, color}) => {
    
    const layerStyle = {
        weight: 0,
        fillColor: color,
        fillOpacity: color
    };

    return (
        <GeoJSON
            key={ layer.name }
            data={ layer }
            style={ layerStyle }
        />
    );
}

VectorLayer.propTypes = {
    layer: PropTypes.shape().isRequired,
    color: PropTypes.string.isRequired
};

export default VectorLayer;
