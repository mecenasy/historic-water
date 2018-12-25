import React from 'react';
import { Card, CardTitle, CardText } from 'reactstrap';
import Checkbox from './Checkbox';

class LayersCard extends React.Component {
  constructor(props) {
    super(props);

    this.makeCheckboxes()
    
    this.state = {
      checkedItems: new Map(),
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const item = e.target.name;
    const isChecked = e.target.checked;
    this.setState(prevState => ({ checkedItems: prevState.checkedItems.set(item, isChecked) }));
  }

//   /                <Checkbox key={element.name+'_checkbox'} name={element.name} onChange={this.handleChange} />

    makeCheckboxes  = () => {
        let layersArray = this.props.layersArray
        let checkboxesArray = []
        layersArray.forEach(element => {
            checkboxesArray.push(

            )
        });

        return checkboxesArray
    }

  render() {
    return (
        <Card body className="layers-card">
            <CardTitle>HISTORIC WATER</CardTitle>
            <CardText>Historyczna hydrografia Krakowa</CardText>
            <div>
                {this.makeCheckboxes().forEach()}
            </div>
        </Card>
    );
  }
}

export default LayersCard;