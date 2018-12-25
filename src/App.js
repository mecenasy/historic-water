import React, { Component } from 'react';
import { Map, TileLayer} from 'react-leaflet';
import './App.css';
import {Hydro1, Osady} from '../src/GeoJSON_layers/hydro1';
import VectorLayers from './VectorLayers';
import { Card, CardTitle, CardText } from 'reactstrap';
import Checkbox from './Checkbox'
//import LayersCard from './LayersCard';

const items = ['   ' + Hydro1.name, '   ' + Osady.name];

class App extends Component {

    state = {
        location: {
            lat: 50.06,
            lng: 19.94,
        },
        zoom: 13.5,
        layers: [Hydro1, Osady]
    }

    handleFormSubmit = formSubmitEvent => {
        formSubmitEvent.preventDefault();

        for (const checkbox of this.selectedCheckboxes) {
            console.log(checkbox, 'is selected.');
        }     
    }

    componentWillMount = () => {
        this.selectedCheckboxes = new Set();
    }

    toggleCheckbox = label => {
        if (this.selectedCheckboxes.has(label)) {
            this.selectedCheckboxes.delete(label);
        } else {
            this.selectedCheckboxes.add(label);
        }
    }

    createCheckbox = label => (
        <Checkbox
            label={label}
            handleCheckboxChange={this.toggleCheckbox}
            key={label}
        />
    )

    createCheckboxes = () => (
        items.map(this.createCheckbox)
    )
    
    render() {
        const position = [this.state.location.lat, this.state.location.lng];
        return (
            <div className='map'>
                <Map className='map' center={position} zoom={this.state.zoom}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    />       
                    <VectorLayers layersArray={this.state.layers}/>
                </Map>
                <Card body className="layers-card">
                    <CardTitle>HISTORIC WATER</CardTitle>
                    <CardText>Historyczna hydrografia Krakowa</CardText>
                    <div className="container">
                        <div className="row">
                        <div className="col-sm-12">

                            <form onSubmit={this.handleFormSubmit}>
                            {this.createCheckboxes()}

                            <button className="btn btn-default" type="submit">Save</button>
                            </form>

                        </div>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }
}

export default App;
