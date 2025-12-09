import React from 'react'
import word from '../assets/Card/word.webp'
import excel from '../assets/Card/excel.svg'
import powerpoint from '../assets/Card/Powerpoint.svg'
import Javascript from '../assets/Card/javascript.webp'
import { NavLink } from 'react-router-dom'

function CardBelajar() {
  return (
    <div className='grid grid-cols-4 gap-16'>
      <div className='w-64  max-w-[380px] h-auto border-1 border-10 p-4 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300'>
      <NavLink to="/belajar/word" className="block">
        <img 
          src={word}
          alt="Belajar Ms WORD"
          className='w-full h-auto rounded-lg mb-4'
        />
        <h2 className='font-bold text-2xl text-black mb-4'>WORD</h2>
        <div className='hover:shadow-2xl bg-blue-700 py-3 w-56 h-10 flex items-center justify-center text-white font-bold rounded-lg transition-all duration-300 hover:bg-blue-800 hover:scale-105'>
          Mulai Belajar
        </div>
      </NavLink>
      </div>
      
    <div className='w-64 max-w-[380px] h-auto border-1 border-10 p-4 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300'>
      <NavLink to="/belajar/Excel" className="block">
        <img 
          src={excel}
          alt="Belajar Ms EXCEL"
          className='w-full h-auto rounded-lg mb-4'
        />
        <h2 className='font-bold text-2xl text-black mb-4'>EXCEl</h2>
        <div className='hover:shadow-2xl bg-blue-700 py-3 w-56 h-10 flex items-center justify-center text-white font-bold rounded-lg transition-all duration-300 hover:bg-blue-800 hover:scale-105'>
          Mulai Belajar
        </div>
      </NavLink>
    </div>


    <div className='w-64 max-w-[380px] h-auto border-1 border-10 p-4 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300'>
      <NavLink to="/belajar/PowerPoint" className="block">
        <img 
          src={powerpoint}
          alt="Belajar Ms WORD"
          className='w-full h-auto rounded-lg mb-4'
        />
        <h2 className='font-bold text-2xl text-black mb-4'>PowerPoint</h2>
        <div className='hover:shadow-2xl bg-blue-700 py-3 w-56 h-10 flex items-center justify-center text-white font-bold rounded-lg transition-all duration-300 hover:bg-blue-800 hover:scale-105'>
          Mulai Belajar
        </div>
      </NavLink>
    </div>


    <div className='w-64 max-w-[380px] h-auto border-1 border-10 p-4 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300'>
      <NavLink to="/belajar/JS" className="block">
        <img 
          src={Javascript}
          alt="Belajar Ms WORD"
          className='w-full h-auto rounded-lg mb-4'
        />
        <h2 className='font-bold text-2xl text-black mb-4'>JavaScript</h2>
        <div className='hover:shadow-2xl bg-blue-700 py-3 w-56 h-10 flex items-center justify-center text-white font-bold rounded-lg transition-all duration-300 hover:bg-blue-800 hover:scale-105'>
          Mulai Belajar
        </div>
      </NavLink>
    </div>
    </div>
    
  )
}

export default CardBelajar