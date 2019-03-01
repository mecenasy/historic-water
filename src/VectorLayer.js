import React from 'react';
import PropTypes from 'prop-types';
import { GeoJSON } from 'react-leaflet';

// komponent VectorLayer jest to komponent prezentacyjny tak zwany DumpComponent
// nie ma potrzeby urzywania do jego budowania clasy wystarczy arrow function
// 
class VectorLayer extends React.Component{
    // jezeli już potrzebny ci jest konstruktor to tylko w wypadku kiedy potrzebujesz jakąś logik wykonać 
    // w przeciwnym wypaku wystarc przypisać warości do pola state w klasie przykłąd poniżej
    // w tym przypadku w ogule niepotrebne
    // state = {
    //      doSomethis: this.props.doSomethig,
    // }
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
        // ten else nie jest potrzebny jeżeli w if'ie masz return nie ma potrzeby pisać 'else return costam'
        // pozatynm nie pisa jedno linijkowych if'ów bez klamer. wiem że to jest dozwolone ale jest rónież bardzo nie czytelne
        else return null;
    }

    render(){
        return (
            <GeoJSON
                // 'key' w tym przypadku nie jest w ogule potrzebny ten komponent jest jako single
                // po wyrenderowaniu react i tak będzie wiedział który ma odświerzyć
                // pole 'key' urzywasz tylko jeśli na podstawie jakieść tablicy w 'map' zwracasz jakieś komponenty
                key={ this.state.key + "_vector_layer" }
                data={ this.state.data }
                // do pola style nie ma potrzeby przzekazywać funkcji tylo wystarczy sam obiekt przekazać 
                // co do zasady nie pisze się arrow function w skopie danego pola tylko odpowienio wczesniej się przygotowywuje 
                // w skopie klasy lub przed returnem a do pola przekazuje się referencje tejże funkcji
                style={() => {return ({
                    weight: 0,
                    fillColor: this.state.style.fillColor,
                    fillOpacity: this.state.style.fillOpacity})}}
            />
        );
    }
}

// Generalnie cały ten plik można sprowadzić do tego 
// const VectorLayer = (props) => ({
 //     <GeoJSON
//             data={ props.data }
//             style={{
//                    weight: 0,
//                    fillColor: props.style.fillColor,
//                    fillOpacity: props.style.fillOpacity}}
//            />
//});
VectorLayer.propTypes = {
    layer: PropTypes.shape().isRequired,
    color: PropTypes.string.isRequired
};

export default VectorLayer;
