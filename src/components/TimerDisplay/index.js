import React, { Component, PropTypes } from 'react';

import styles from './TimerDisplay.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

import TimerButton from '../TimerButton';
import ProgressIndicator from './ProgressIndicator';

export default class TimerDisplay extends Component {
  static propTypes = {
    remainingTime: PropTypes.number.isRequired,
    perc: PropTypes.number,
    paused: PropTypes.bool,
    playing: PropTypes.bool,
    completed: PropTypes.bool,
    label: PropTypes.string,
    updateTime: PropTypes.func,
    stopped: PropTypes.bool,
    addOneMinute: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.beginEdit = this.beginEdit.bind(this);
    this.finishEdit = this.finishEdit.bind(this);
    this.state = {
      label: 'label',
      editing: false,
    };
  }
  onChange(e) {
    const label = e.target.value;
    this.setState({
      label,
    });
  }
  // takes time in milliseconds, renders to hh:mm:ss for readable time
  formatTime(ms) {
    const seconds = ms / 1000;
    let mins = Math.floor(seconds / 60);
    let secs = Math.ceil(seconds % 60);
    // prevent displaying ex. 00:00:60 for 1min
    if (secs === 60) {
      mins++;
      secs = 0;
    }
    let hours = Math.floor(mins / 60);
    hours = this.zeroPad(hours);
    mins = this.zeroPad(mins % 60);
    secs = this.zeroPad(secs);
    const output = `${hours}:${mins}:${secs}`;
    return output;
  }
  // add padding zero to hh:mm:ss if needed
  zeroPad(num) {
    const paddedNum = `0${num}`;
    if (num >= 10) {
      return num;
    }
    return paddedNum;
  }
  beginEdit() {
    this.setState({ editing: true });
  }
  finishEdit() {
    this.setState({ editing: false });
  }
  render() {
    const { paused, completed, stopped, perc, remainingTime } = this.props;
    const { label, editing } = this.state;
    const formattedTime = this.formatTime(remainingTime);
    const timeCx = cx({
      timer: true,
      paused,
      completed,
    });
    const clockfaceCx = cx({
      clockface: true,
      paused,
      completed,
    });
    const labelWrap = {
      padding: '0px',
      margin: '0 0 5px 0',
      borderBottom: '2px solid transparent',
      transition: 'all .25s ease-out',
      minWidth: '105px',
    };
    const labelWrapEditing = {
      padding: '0px 0px 4px 0px',
      margin: '0 0 5px 0',
      borderBottom: '2px solid #FF5252',
      transition: 'all .25s ease-in',
      minWidth: '105px',
    };
    const labelDisplay = <span className={styles.title} onClick={this.beginEdit}>{label}</span>;
    const labelForm =
      <input autoFocus className={styles.input} type="text" value={label} onChange={this.onChange} onBlur={this.finishEdit}></input>;
    const timeUpMessage = <span className={styles.timeup}>Time's up!</span>;
    const plusOneStyles = {
      marginBottom: '0px',
      paddingBottom: '0px',
    };
    return (
      <div>
        <ProgressIndicator
          perc={perc}
        />
        <div className={styles.timewrap}>
          <div className={styles.timewrapinner}>
            <div className={clockfaceCx}>
              {!editing
                ? <div style={labelWrap}>{labelDisplay}</div>
                : <div style={labelWrapEditing}>{labelForm}</div>
              }
              <h2 className={timeCx}>{!completed ? formattedTime : timeUpMessage}</h2>
              {!stopped
              ? <TimerButton
                customStyles={plusOneStyles}
                text="+1&#39;"
                title="Add one minute"
                action={this.props.addOneMinute}
              />
              : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

