import React from 'react'

export const InputCustom = ({ input, label, type, placeholder, className, meta: { touched, visited, error } }) => {
  const defaultInput = (
    <input
      {...input}
      className={`input-custom ${touched && error ? "error" : ""}`}
      placeholder={placeholder}
      type={type} />
  );
  return (
    <div className={`field ${className || ''}`}>
      {label ? <div className="label-text">{label}</div> : null}
      <label className="label-custom">
        {defaultInput}
        {touched && ((error && <div className="message-error">{error}</div>))}
      </label>
    </div>
  )
}