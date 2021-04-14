import React, {
  Component
} from 'react'
import { Container, Row } from 'react-bootstrap';

import Timer from '../timer';

import './styles.scss';

class App extends Component {
  // constructor(props) {
  //   super(props);

  //   // this.watch = new StopWatch(() => { this.updateSec(this.watch.getTime()) });
  //   // this.timer = new Timer(
  //   //   10,
  //   //   () => { this.updateSec(this.timer.getTime()) },
  //   //   () => { this.setState({ over: true }) },
  //   //   true,
  //   //   // 5,
  //   //   // () => {
  //   //   //   console.log('Overtime!', this.timer.getTime())
  //   //   // }
  //   // );

  //   // this.handleClick = this.handleClick.bind(this);
  //   // this.start = this.start.bind(this);
  //   // this.stop = this.stop.bind(this);
  //   //this.log = this.log.bind(this);
  // }

  // state = {
  //   isToggled: true,
  //   isRunning: false,
  //   timeSec: 0,
  //   over: false
  // }

  // updateSec(sec) {
  //   this.setState({ timeSec: sec });
  // }

  // start() {
  //   this.timer.start();
  //   // if (!this.state.isRunning) {
  //   //   console.log('start');
  //   //   this.i = 0;
  //   //   this.watch = setInterval(() => this.log(), 1000);
  //   //   this.setState({ isRunning: true });
  //   // }
  // }

  // stop() {
  //   this.timer.stop();
  // }

  // log() {
  //   console.log(this.i++);
  // }

  // handleClick() {
  //   this.setState({ isToggled: !this.state.isToggled });
  //   //console.log('handle');
  // }

  // render() {
  //   return (
  //     <div>
  //       <div>
  //         {this.state.timeSec}
  //       </div>
  //       <div>
  //         {this.state.over ? 'Over!' : ''}
  //       </div>
  //       <div>
  //         <button onClick={this.handleClick}>{this.state.isToggled ? 'On' : 'Off'}</button>
  //       </div>
  //       <div>
  //         <button onClick={this.start}>Start</button>
  //       </div>
  //       <div>
  //         <button onClick={this.stop}>Stop</button>
  //       </div>
  //     </div>
  //   );
  // }
  render() {
    return (
      <Container>
        <Row>
          <Timer />
        </Row>
      </Container>
    );
  }
}

export default App;
