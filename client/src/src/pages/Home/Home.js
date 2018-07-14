import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Header from '../../sections/Header'
import '../../../game';

import { socket } from '../../../util';

class App extends Component {
    constructor() {
        super();
        socket.on('response', this.update)
    }

    state = {
        text: 'bye'
    }

    sendData = () => {
        socket.emit('sendData', 1000);
    }

    update = req => {
        this.setState({text: req.data})
    }

  render() {
    return (
      <div>
        <Header />
        <Grid container alignItems='center' justify='center'>
        <Grid item>
            <div id='game' style={{ border: '1px black solid'}} />
        </Grid>
        </Grid>
        <Button color="primary" onClick={this.sendData}>
        Click me!!
      </Button>
      <div>{this.state.text}</div>
      </div>
    )
  }
}
export default App