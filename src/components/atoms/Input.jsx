import React, { useState } from 'react'
import ApperIcon from '@/components/ApperIcon'

const Input = ({
  label,
  type = 'text',
  error,
  icon,
  className = '',
  ...props
}) => {
  const [focused, setFocused] = useState(false)
  const [hasValue, setHasValue] = useState(props.value || props.defaultValue || false)

  const handleFocus = (e) => {
    setFocused(true)
    props.onFocus?.(e)
  }

  const handleBlur = (e) => {
    setFocused(false)
    setHasValue(e.target.value.length > 0)
    props.onBlur?.(e)
  }

  const handleChange = (e) => {
    setHasValue(e.target.value.length > 0)
    props.onChange?.(e)
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <ApperIcon name={icon} size={20} />
          </div>
        )}
        <input
          type={type}
          className={`
            w-full px-3 py-3 border border-gray-300 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            transition-all duration-200
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-error focus:ring-error' : ''}
            ${label ? 'pt-6 pb-2' : ''}
          `}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        />
        {label && (
          <label className={`
            absolute left-3 transition-all duration-200 pointer-events-none
            ${icon ? 'left-10' : 'left-3'}
            ${focused || hasValue 
              ? 'top-2 text-xs text-primary font-medium' 
              : 'top-1/2 -translate-y-1/2 text-gray-500'
            }
          `}>
            {label}
          </label>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  )
}

export default Input