import React from 'react';
import {GeoJSON} from 'react-leaflet';

export default class VectorLayers extends React.Component {
  
    
 
    shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.selected){
      this.setState({selected: true});
      this.refs.geojson.leafletElement.setStyle({
        color: 'red'
      });
    }
    return false;
  }


  styleLayers (feature) {
        return {
            color: '#11ffec',
            weight: 0.5,
            fillColor: "#1ffd62",
            fillOpacity: 0.5
        }; 
    };
    createJsonDivs = () => {
        let layersArray = this.props.layersArray
        let geojsonDivs = []
        layersArray.forEach(element => {
            console.log(element.name)
            geojsonDivs.push(
                <GeoJSON
                    ref="geojson"
                    key={element.name}
                    data={element}
                    style={this.styleLayers}
                />
            )
        });

        return geojsonDivs
    }
    
    render() {
        return(
            <div>
                {this.createJsonDivs()}
            </div>
        )
    }
}


