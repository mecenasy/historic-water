import React from 'react';
import VectorLayers from './src/VectorLayers';
import { Card, CardTitle, CardText } from 'reactstrap';
import Checkbox from './Checkbox';

export default class CheckboxTest extends React.Component { 

  render() {
    return (
        <Card body className="layers-card">
            <CardTitle>HISTORIC WATER</CardTitle>
            <CardText>Historyczna hydrografia Krakowa</CardText>
            <div>
                <Checkbox key={'testcheckbox'} name={'TestCheckbox'} onChange={} />
            </div>
        </Card>
    );
  }
}


