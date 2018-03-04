import { Dropdown } from 'semantic-ui-react'

export const SelectCustom = ({ input, label, options, multiple, disabled, placeholder, className, meta: { touched, visited, error } }) => (
  <div className={`field ${className || ''}`}>
    {label ? <div className="label-text">{label}</div> : null}
    <Dropdown
      name={input.name}
      value={input.value || (multiple ? [] : '')}
      className="select-custom"
      onChange={(param, data) => input.onChange(data.value)}
      onBlur={null}
      placeholder={placeholder}
      multiple={multiple}
      fluid
      search
      selection
      minCharacters={0}
      disabled={disabled}
      options={options}
      />
    {touched && ((error && <div className="message-error">{error}</div>))}
  </div>
)