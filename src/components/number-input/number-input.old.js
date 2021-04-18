// классовый компонент

import React, { Component } from 'react'

import './styles.scss';

class NumberInput extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const s = e.target.value;
    // чтобы не оставались нули лишние
    e.target.value = "";
    this.props.onChange(s, this.props.name);
  }

  render() {
    return (
      <input
        className="input-time"
        type="number"
        value={this.props.value}
        onChange={this.onChange}
        readOnly={this.props.readOnly}
      />
    );
  }
}

export default NumberInput;