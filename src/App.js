import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup} from 'react-leaflet';
import './App.css';
import { Hydro1, Osady, MAP1936 } from '../src/GeoJSON_layers/hydro1';
import VectorLayer from './VectorLayer';
import { Collapse, Button, Card, CardTitle, CardText, Input } from 'reactstrap';
import LayersControls from './LayersControls';
import update from 'immutability-helper';
import Checkbox from './Checkbox';
import icon from 'leaflet/dist/images/flood-mark.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';
import { FloodMarks } from '../src/GeoJSON_layers/flood_marks';
import SortedSet from 'collections/sorted-set'
import HorizontalTimeline from 'react-horizontal-timeline'

var floodMarkIcon = L.icon({
    iconUrl: icon,
    iconAnchor: [12.5, 30],
    popupAnchor: [0, -41],
    shadowUrl: iconShadow,
    shadowAnchor: [12.5, 41]
});

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            location: {
                lat: 50.06,
                lng: 19.94,
            },
            zoom: 13.5,
            layers: [Hydro1, Osady, MAP1936],
            colors: {
                [Hydro1.name]: {r: 50, g: 50, b: 255, a: 1},
                [Osady.name]: {r:50, g: 50, b: 255, a: 1},
                [MAP1936.name]: {r:50, g: 50, b: 255, a: 1}
            },
            checkboxes: {
                [Hydro1.name]: false,
                [Osady.name]: false,
                [MAP1936.name]: false
            },
            collapse: false,
            dropdownOpen: false,
            flood_marks_checked: false,
            timelineVisible: false,
            flood_marks: FloodMarks.features,
            valueTimeline: 0,
            previousValueTimeline: 0,
            floods_dates: [],
            flood_date: '1593-07-03'
        }
    }

    componentDidMount() {
        this.setState({
            floods_dates: this.getArrayOfFloodDates()
        })
    }

    getArrayOfFloodDates = () => {
        var datesSet = new SortedSet();
        const datesArray = [];
        this.state.flood_marks.forEach(function(nextDate) {
            datesSet.add(nextDate.properties.flood_date);
        });
        datesSet.forEach(function(date) {
            datesArray.push(date);

        })
        return datesArray;
    }

    indexClickDate = (floodIndex) => {
        this.setState({ 
            valueTimeline: floodIndex, 
            previousValueTimeline: this.state.valueTimeline,
            flood_date: this.state.floods_dates[floodIndex]
        })
    }

    handleChangeColor = (layerName) => {
      return (color) => {
        var newColor = update(this.state, {
            colors: {
                [layerName]: {
                        r: {$set: color.rgb.r},
                        g: {$set: color.rgb.g},
                        b: {$set: color.rgb.b},
                    }
                }
        });
        this.setState(newColor);
      }
    };

    handleChangeAlpha = (layerName) => {
      return (color) => {
        var newAlpha = update(this.state, {
            colors: {
                [layerName]: {
                        a: {$set: color.rgb.a}
                    }
                }
        });
        this.setState(newAlpha);
      };
    }

    readRGBA = (objectRGBA) => {
        var arrayRGBA = Object.values(objectRGBA);
        return 'rgba(' + arrayRGBA.join(', ') + ')';
    }

    
    toggleCollapseLayersList = () => {
        this.setState({ 
            collapse: !this.state.collapse });
    }

    toggleFloodMarksCheckbox = (e) => {
        this.setState({
            flood_marks_checked: !this.state.flood_marks_checked
        })
    }

    toggleLayerCheckbox = (e) => {
        this.setState({
            checkboxes: {
                ...this.state.checkboxes,
                [e.target.value]: e.target.checked
            }
        })
    }

    handleChangeSelect = (e) => {
        if(e.target.value==='Linia czasu') {
            this.setState({
                timelineVisible: true
            })
        } else {
            this.setState({
                timelineVisible: false
            })
        }
    }

    render() {
        const position = [this.state.location.lat, this.state.location.lng];
        return (
            <div className='map'>
                <Map className='map' center={position} zoom={this.state.zoom}>
                    <TileLayer className='main-map'
                        url='https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png'
                        attribution='Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> 
                            &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        opacity='1'
                    />
                    {
                        this.state.layers.map((layer) => (
                            this.state.checkboxes[layer.name] && (
                                <VectorLayer
                                    key={ layer.name }
                                    layer={ layer }
                                    color={ this.readRGBA(this.state.colors[layer.name]) }
                                />
                            )
                        ))
                    }
                    {   this.state.flood_marks_checked ?
                            this.state.timelineVisible ?
                                this.state.flood_marks.map((feature, index) => {
                                    if(this.state.flood_date === feature.properties.flood_date) {
                                        return (
                                            <Marker 
                                                key = {feature.geometry.coordinates.join('_') + '_' + index}
                                                position={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}
                                                icon={floodMarkIcon}>
                                                <Popup>{feature.properties.flood_date}<br />{feature.geometry.coordinates[1]}
                                                    <br />{feature.geometry.coordinates[0]}</Popup>
                                            </Marker>
                                        )
                                    } else return ""
                                })
                            :
                            this.state.flood_marks.map((feature, index) => (
                                <Marker 
                                    key = {feature.geometry.coordinates.join('_') + '_' + index}
                                    position={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}
                                    icon={floodMarkIcon}>
                                    <Popup>{feature.properties.flood_date}<br />{feature.geometry.coordinates[1]}
                                        <br />{feature.geometry.coordinates[0]}</Popup>
                                </Marker>
                            ))
                        :
                        <div />
                    }
                </Map>
                <div>
                    {
                        this.state.flood_marks_checked &&  this.state.timelineVisible ?
                            <div className='timeline'>
                                <HorizontalTimeline
                                    index={this.state.valueTimeline}
                                    indexClick={(index) => {
                                        this.indexClickDate(index);
                                    }} 
                                    values={this.state.floods_dates}
                                />
                            </div>
                        :
                        <div/>
                    }
                </div>
                <Card body className='layers-card'>
                    <CardTitle>HISTORIC WATER</CardTitle>
                    <CardText>Historyczna hydrografia Krakowa</CardText>
                    <Button 
                        color="primary" 
                        onClick={this.toggleCollapseLayersList} 
                        style={{ marginBottom: '1rem' }}>
                        {this.state.collapse ? 'Ukryj listę warstw' : 'Pokaż listę warstw'}
                    </Button>
                    
                    <Collapse isOpen={this.state.collapse}>
                        <div className='layers-controls'>
                            <Checkbox
                                value={ 'flood_marks_checkbox' }
                                label={ 'Znaki wielkiej wody' }
                                handleChange={ this.toggleFloodMarksCheckbox }
                                checked={ this.state.flood_marks_checked }
                                key={ 'flood_marks_checkbox' }
                            />
                            <Input 
                                type="select" 
                                name="selectFloodMarks" 
                                id="selectFloodMarks" 
                                onChange={this.handleChangeSelect}
                                disabled={!this.state.flood_marks_checked} >
                                    <option>Pokaż wszystkie</option>
                                    <option>Linia czasu</option>
                            </Input>
                        </div>
                        <LayersControls
                            layers={this.state.layers}
                            handleChange={this.toggleLayerCheckbox}
                            checkboxes={ this.state.checkboxes }
                            colors={ this.state.colors }
                            alpha={ this.state.alpha }
                            onChangeColor={ this.handleChangeColor }
                            onChangeAlpha={ this.handleChangeAlpha }
                        />
                    </Collapse>
                </Card> 
                <Card className = "footer-license">
                    <CardText>
                        Historic Water created by Marek Kania is licensed under a 
                        <a rel="license" href="https://github.com/mkaniaa/historic-water/blob/master/LICENSE"> GNU GENERAL PUBLIC LICENSE</a>
                    </CardText>                
                </Card>
            </div>
        );
    }
}

export default App;
