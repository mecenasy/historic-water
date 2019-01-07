import React, { Component } from 'react';
import { Map, TileLayer} from 'react-leaflet';
import './App.css';
import { Hydro1, Osady } from '../src/GeoJSON_layers/hydro1';
import VectorLayers from './VectorLayers';
import { Card, CardTitle, CardText } from 'reactstrap';
import LayersControls from './LayersControls';
import update from 'immutability-helper'

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            location: {
                lat: 50.06,
                lng: 19.94,
            },
            zoom: 13.5,
            layers: [Hydro1, Osady],
            colors: {
                [Hydro1.name]: {r: 111, g: 111, b: 111, a: 1},
                [Osady.name]: {r: 111, g: 111, b: 111, a: 1}
            },
            checkboxes: {
                [Hydro1.name]: false,
                [Osady.name]: false
            }
        }
    }

    handleChangeColor = (color) => {
        var newColor = update(this.state, {
            colors: {
                [Hydro1.name]: {
                        r: {$set: color.rgb.r},
                        g: {$set: color.rgb.g},
                        b: {$set: color.rgb.b},
                    }
                }
        });
        this.setState(newColor);
    };

    handleChangeAlpha = (color) => {
        var newAlpha = update(this.state, {
            colors: {
                [Hydro1.name]: {
                        a: {$set: color.rgb.a}
                    }
                }
        });
        this.setState(newAlpha);
    };

    
    toggleCheckbox = (e) => {
        this.setState({
            checkboxes: {
                ...this.state.checkboxes,
                [e.target.value]: e.target.checked
            }
        })
    }

    readRGBA = (objectRGBA) => {
        var arrayRGBA = Object.values(objectRGBA);
        return 'rgba(' + arrayRGBA.join(', ') + ')';
    }

    render() {
        const position = [this.state.location.lat, this.state.location.lng];
        return (
            <div className='map'>
                <Map className='map' center={position} zoom={this.state.zoom}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    />
                    {
                        this.state.layers.map((layer) => ( 
                            this.state.checkboxes[layer.name] && (
                                <VectorLayers
                                    key={ layer.name }
                                    layer={ layer }
                                    color={ this.readRGBA(this.state.colors[layer.name]) }
                                />
                            )
                        ))
                    }
                </Map>
                <Card body className="layers-card">
                    <CardTitle>HISTORIC WATER</CardTitle>
                    <CardText>Historyczna hydrografia Krakowa</CardText>
                    <LayersControls
                        layers={this.state.layers}
                        handleChange={this.toggleCheckbox}
                        checkboxes={ this.state.checkboxes }
                        colors={ this.state.colors }
                        alpha={ this.state.alpha }
                        onChangeColor={ this.handleChangeColor }
                        onChangeAlpha={ this.handleChangeAlpha }
                    />
                </Card>
            </div>
        );
    }
}

export default App;
