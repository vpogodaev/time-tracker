import React from "react";

import "./styles.scss";

export default function NumberInput(props) {
  const onChange = (e) => {
    const s = e.target.value;
    // чтобы не оставались нули лишние
    e.target.value = "";
    props.onChange(s, props.name);
  };

  const className =
    "input-time" + (props.readOnly ? " input-time__no-arrows" : "");

  return (
    <input
      className={className}
      type={props.readOnly ? "text" : "number"}
      value={props.value}
      onChange={onChange}
      readOnly={props.readOnly}
    />
  );
}
