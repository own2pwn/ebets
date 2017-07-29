import React from 'react';
import moment from 'moment';

import Chip from 'material-ui/Chip';
import * as MColors from 'material-ui/styles/colors';

import { betTimeStates } from './betStates';

class Clock extends React.Component {
  secondsToEnd = 0;
  constructor(props) {
    super(props);
    this.state = {
      dateTimestamp : Date.now()
    };
    this.tick = this.tick.bind(this);
  }
  tick() {
    this.setState({
      dateTimestamp: this.state.dateTimestamp - 1000
    });
    // Match is happening
    if (moment().unix() >= this.props.beginDate) {
      if (this.props.parentState !== betTimeStates.matchRunning && 
          this.props.parentState !== betTimeStates.matchEnded) {
        console.log('Nottifying match Running');
        this.props.updateState(betTimeStates.matchRunning);
      }
      // Match ended
      if (moment().unix() >= this.props.endDate.toNumber()) {
        if (this.props.parentState !== betTimeStates.matchEnded) {
          console.log('Nottifying match end');
          this.props.updateState(betTimeStates.matchEnded);
        }
      }
    }
  }

  componentDidMount() {
    this.interval = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    var deltaSeconds;
    var msgString;
    if (this.props.parentState < betTimeStates.matchBegin) {
      deltaSeconds = this.props.beginDate - moment().unix();
      msgString = 'Begins in: '
    }
    else if (this.props.parentState === betTimeStates.matchRunning) {
      deltaSeconds = this.props.endDate.toNumber() - moment().unix();
      msgString = 'Ends in: '
    }
    else if (this.props.parentState === betTimeStates.matchEnded) {
      deltaSeconds = this.props.resolverDeadline.toNumber() - moment().unix();
      msgString = 'Resolver must answer in: '
    }

    //secondsToBegin = (moment().unix() + 1033) - moment().unix();
    //this.secondsToEnd = 10; 

    var days = deltaSeconds / (60 * 60 * 24);
    days = Math.floor(days);
    deltaSeconds -= days * (60 * 60 * 24);
    var hours = deltaSeconds / (60 * 60);
    hours = Math.floor(hours);
    deltaSeconds -= hours * (60 * 60);
    var minutes = deltaSeconds / 60;
    minutes = Math.floor(minutes);
    deltaSeconds -= minutes * 60;

    var result_str;
    if (days > 0)
      result_str = days + 'd ' + hours + 'h ' + minutes + 'm ' + deltaSeconds + 's';
    else if (hours > 0)
      result_str = hours + 'h ' + minutes + 'm ' + deltaSeconds + 's';
    else if (minutes > 0)
      result_str = minutes + 'm ' + deltaSeconds + 's';
    else
      result_str = deltaSeconds + 's';

    return(
        <div className='pushRight'>
          <Chip backgroundColor={MColors.white}>
            {msgString} {result_str}
          </Chip>
        </div>
      );

  }
}
export default Clock;
