import React from 'react'

const DefualtBtn = ({ btntype, btnvalue, onclick}) => {
  return (
    <button
        type={btntype}
        onClick={onclick}
        className='
            bg-blue-500
            text-white
            py-2 px-4
            rounded
        '
    >{btnvalue}</button>
  )
}

export default DefualtBtn