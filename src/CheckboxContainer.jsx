import React from 'react';
import PropTypes from 'prop-types';
import checkboxes from './checkboxes';
import Checkbox from './Checkbox';

class CheckboxContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // ten map jest nie potrzebny Map to jest obiekt który posiada ubiekty a unikalnym kluczem i wartości
      // ten sam efekt osiąfniesz na zwykłym obiekcie 
      // obiekt[klucz] = wartość; 
      // jezeli klucz jest stringiem lub numberen nie ma porzeby stosowania Map'a
      
      // takim przypadku zamiast this.state.checkedItems.get(item.name)
      // powierasz wartość {this.state[item.name]
      // ile mniej pisania
      checkedItems: new Map(),
    }
    // urzyj arrowFunction pozbędziesz się tego;
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    // jesli byś się zastosowałe do wyższego komentarza to oto funkcje mozna by było zapisać do postacji takiej
    // const item = e.target.name;
    // this.setState(prevState => ({ ...prevState, [name]: !prevState[name] }));
    // popatrze ile chytelniejsze a funkcjonalność się nie zmienia
    const item = e.target.name;
    const isChecked = e.target.checked;
    this.setState(prevState => ({ checkedItems: prevState.checkedItems.set(item, isChecked) }));
  }

  render() {
    return (
      <React.Fragment>
        {
          checkboxes.map(item => (
            <label key={item.key}>
              {item.name}
              <Checkbox name={item.name} checked={this.state.checkedItems.get(item.name)} onChange={this.handleChange} />
            </label>
          ))
        }
      </React.Fragment>
    );
  }
}

export default CheckboxContainer;
