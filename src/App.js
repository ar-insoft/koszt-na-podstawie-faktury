import React, { Component } from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css'
import KosztZFaktury from './components/KosztZFaktury/KosztZFaktury'

class App extends Component {
  render() {
    return (
      <div>
      <KosztZFaktury />

      <div className="App">
        <header className="App-header">
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          
        </header>
      </div>
      </div>
    );
  }
}

export default App;
