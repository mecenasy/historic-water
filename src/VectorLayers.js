import React from 'react';
import PropTypes from 'prop-types';
import { GeoJSON } from 'react-leaflet';

class VectorLayers extends React.Component{
    constructor(props){
        super(props);
        this.state={
            key: this.props.layer.name,
            data: this.props.layer,
            style: {
                weight: 0,
                fillColor: this.props.color,
                fillOpacity: this.props.color,
            },
        }
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.color!==prevState.style.fillColor || nextProps.alpha!==prevState.style.fillOpacity){
            return {style: {
                weight: 0,
                fillColor : nextProps.color,
                fillOpacity : nextProps.color
            }}
        }
        else return null;
    }

    render(){
        return (
            <GeoJSON
                key={ this.state.key }
                data={ this.state.data }
                style={() => {return ({
                    weight: 0, 
                    fillColor: this.state.style.fillColor, 
                    fillOpacity: this.state.style.fillOpacity})}}
            />
        );
    }
}

VectorLayers.propTypes = {
    layer: PropTypes.shape().isRequired,
    color: PropTypes.string.isRequired
};

export default VectorLayers;
