export const TextareaCustom = ({ input, label, placeholder, className, meta: { touched, visited, error } }) => {
  return (
    <div className={`field ${className || ''}`}>
      {label ? <div className="label-text">{label}</div> : null}
      <label className="label-custom">
        <textarea
          {...input}
          className={`textarea-custom ${touched && error ? "error" : ""}`}
          placeholder={placeholder}></textarea>
        {touched && ((error && <div className="message-error">{error}</div>))}
      </label>
    </div>
  )
}