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

// wszsytkie plikie w których wystę pują komponenty nazywaj *.jsx łatwiej je będziesz identyfikował 
// pozatym generanie jest taki standera nazewnictwa

class App extends Component {

    constructor(props) {
        super(props);
        // nie będę się rozwodził na zasadnością tego statu
        // z innej strony do takiego globalnego stanu służy redux
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

            // componentDidMount już jest po pierwszym renderze
            // a całą tą operacje powinieneś zrobić własnie w construktorze całego componentu 
            // co spowoduje przyśpieszenie jego wyrenderowania
            // tutaj urzywamy setState generalnie tylko jeśli potrzebujemy elementy DOM
            // wszystko inne możan zrobić tak jak opisałem w VectorLayer

    componentDidMount() {
        this.setState({
            floods_dates: this.getArrayOfFloodDates()
        })
    }
    
    // generalnie jezeli tworzysz funcje które odnoszą się do `this` i przekazujesz je do innych componentów 
    // twórz je poprzez arrow function nie ma potrzeby ich bindować mniej w ten sposub błędów nie  popełnisz
    // na tomias wszystkie inne mozesz robić normalnie ja osobiście nie zalecam takieg sposobu bo mozesz popełniać błędy
    // zalecałbym mimo wszystko wszystkie pisać jak arrow function
    getArrayOfFloodDates = () => {
        // z typami typ Set Map itp trzeba uważać nie wszystie przeglądarki je poprawnie obsługuję
        // a zwłaszcza ich odmianami  jezeli juz to bym urzył tutaj zwykłego Set.
        var datesSet = new SortedSet();
        const datesArray = [];
        // funcje przekazywane do funkcji powiny być osobno delarowane i przekazywana referencja
        this.state.flood_marks.forEach(function(nextDate) {
            datesSet.add(nextDate.properties.flood_date);
        });
        // ten forEach jest w tym miejscu zupełnie nie potrzebny
        datesSet.forEach(function(date) {
            datesArray.push(date);

        })
        
        // wystarczy zwrucić Array.from(datesSet).sort();
        return datesArray;
    }

    indexClickDate = (floodIndex) => {
        // w setState nie odnosisz się do poprzedniego stanu poprzez 'this.state.doSomething' jest to bardzo niebezpieczne
        // w przypadku wystąpienia powiedzmy 100 setState nie masz żadnej pewności że się to poprwanie wykona poniaważ nie wiesz
        // jaką wartość ma 'this.state.doSomething' takie operacje tylko i wyłącznie za pośrednicwem prevStete przekazywanym do pierwszego 
        // argumentu funckje która jest prekazywana do 'setState'
        this.setState({ 
            valueTimeline: floodIndex, 
            previousValueTimeline: this.state.valueTimeline,
            flood_date: this.state.floods_dates[floodIndex]
        })
    }

    handleChangeColor = (layerName) => {
        // poco ten return wystacy zrobić  handle = (a) => (b) => { ..... }
      return (color) => {
          // urzywaj const lub let są bezpiechniejsz poczytaj o zasiengach zmiennych 
          // jezeli wyciągasz coś ze stata do innej na niej coś operujesz  zmiennej musisz mieć pewność
          // że nowy obiekt nie jest z mutowany 
          // w tym przypadku bardziej bym poszedł w stronę cloneDeep z loadash
          // generalnie zaznajom się z tą biblioteką jest bardzo przydatna
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
    // jak wyrzej
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
        // do takiego budowania stringa urzył bym template string 
        //  `cos ${zmienna lub wywołanie jakiejś funkcji } cos` 
        return 'rgba(' + arrayRGBA.join(', ') + ')';
    }

    
    toggleCollapseLayersList = () => {
        // to samo co w `indexClickDate`
        this.setState({ 
            collapse: !this.state.collapse });
    }
    // w tej funkcji nie urzywasz 'e' wiec nie ma sensu wstawiać takiego argumentu
     toggleFloodMarksCheckbox = (e) => {
        // to samo co w `indexClickDate`
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
                    // Generalnie z każdej z poniższych map zrobiłbym odobny komponent w tedy cały ten render byłby durzo czytelniejszy
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
                    // operator truj argumentowy zagnieżdzony w operatorze trujargumentowym ojej
                    // takie warunki są nie dopuszczalne bardzo trudno się w nich odnaleść co jest co 
                    {   this.state.flood_marks_checked ?
                        // po pierwszym warunk w przypadku nie powodzenia zwucisz postego diva poco?
                        // wystarczyło by urzyć operatora wyboru && ale musisz przy nim uwarzać 
                        // ponieważ jesli zminna na podstawie której wybierasz jest numberem  wyrenderuje ci się '0'
                        // bezpiecznie jest się zabezpieczyć na taką okolicznaoś podwujnym zaprzeczeniem albo 'Boolean(zmienna)'
                            this.state.timelineVisible ?
                                // takie przypadku gdzie potrzebujesz wyfiltrować nie pasujące elementy lub posortować etc..
                                // zrub to przed funkcją map wtedy kod jest durzo bardzie czytelniejszy ale również szybzy
                                this.state.flood_marks.map((feature, index) => {
                                    if(this.state.flood_date === feature.properties.flood_date) {
                                        return (
                                            <Marker 
                                                key = {feature.geometry.coordinates.join('_') + '_' + index}
                                                position={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]}
                                                icon={floodMarkIcon}>
                                                    // totaj formatowanie tych dwóch linijek bardzo by pomogło w czytelności
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
                                    // przekazana funkcja powinna być zdeklarowana w skopie class'y
                                    indexClick={(index) => {
                                        this.indexClickDate(index);
                                    }} 
                                    values={this.state.floods_dates}
                                />
                            </div>
                        : 
                        // tak jak porzyzej nie ma potrzeby trenderowania tego diva wdług mnie tego otacającego również 
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
