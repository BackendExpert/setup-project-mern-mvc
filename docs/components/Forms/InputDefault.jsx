import React from 'react'

const InputDefault = ({ type, name, value, onchange, required, placeholder }) => {
  return (
    <input 
        type={type} 
        name={name}
        value={value}
        onChange={onchange}
        required={!!required}
        placeholder={placeholder}
        className='
            w-full
            h-12
            bg-gray-200
            pl-2
            border
        '
    />
  )
}

export default InputDefault