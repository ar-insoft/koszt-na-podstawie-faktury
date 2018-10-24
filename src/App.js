import React, { Component } from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import KosztZFaktury from './components/KosztZFaktury/KosztZFaktury'

class App extends Component {
  render() {
    return (
      <div>
        <KosztZFaktury />
        <ToastContainer
          position={toast.POSITION.TOP_RIGHT}
          closeOnClick={false}
          autoClose={6000}
          hideProgressBar={true}
        /> 
      </div>
    );
  }
}

export default App;
