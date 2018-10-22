import React, { Component } from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css'
import KosztZFaktury from './components/KosztZFaktury/KosztZFaktury'

class App extends Component {
  render() {
    return (
      <div>
      <KosztZFaktury />
      </div>
    );
  }
}

export default App;
