import React from "react";

import "./styles.scss";

export default function NumberInput(props) {
  const onChange = (e) => {
    const s = e.target.value;
    // чтобы не оставались нули лишние
    e.target.value = "";
    props.onChange(s, props.name);
  };

  return (
    <input
      className="input-time"
      type="number"
      value={props.value}
      onChange={onChange}
      readOnly={props.readOnly}
    />
  );
}