import React from 'react'
import word from '../assets/Card/CardWord.webp'
import excel from '../assets/Card/CardExcel.svg'
import powerpoint from '../assets/Card/CardPowerpoint.svg'
import Javascript from '../assets/Card/CardJavascript.webp'
import { NavLink } from 'react-router-dom'

function CardBelajar() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      
      <div className='bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col'>
        <NavLink to="/belajar/word" className="flex flex-col flex-1">
          <div className='flex items-center justify-center h-48 mb-4'>
            <img 
              src={word}
              alt="Belajar Ms WORD"
              className='max-h-full max-w-full object-contain rounded-lg'
            />
          </div>
          <h2 className='font-bold text-2xl text-black mb-4 text-center'>WORD</h2>
          <div className='mt-auto bg-blue-700 py-3 w-full flex items-center justify-center text-white font-bold rounded-lg transition-all duration-300 hover:bg-blue-800 hover:scale-105 hover:shadow-xl'>
            Mulai Belajar
          </div>
        </NavLink>
      </div>
      
      <div className='bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col'>
        <NavLink to="/belajar/Excel" className="flex flex-col flex-1">
          <div className='flex items-center justify-center h-48 mb-4'>
            <img 
              src={excel}
              alt="Belajar Ms EXCEL"
              className='max-h-full max-w-full object-contain rounded-lg'
            />
          </div>
          <h2 className='font-bold text-2xl text-black mb-4 text-center'>EXCEL</h2>
          <div className='mt-auto bg-blue-700 py-3 w-full flex items-center justify-center text-white font-bold rounded-lg transition-all duration-300 hover:bg-blue-800 hover:scale-105 hover:shadow-xl'>
            Mulai Belajar
          </div>
        </NavLink>
      </div>

      <div className='bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col'>
        <NavLink to="/belajar/PowerPoint" className="flex flex-col flex-1">
          <div className='flex items-center justify-center h-48 mb-4'>
            <img 
              src={powerpoint}
              alt="Belajar Ms PowerPoint"
              className='max-h-full max-w-full object-contain rounded-lg'
            />
          </div>
          <h2 className='font-bold text-2xl text-black mb-4 text-center'>PowerPoint</h2>
          <div className='mt-auto bg-blue-700 py-3 w-full flex items-center justify-center text-white font-bold rounded-lg transition-all duration-300 hover:bg-blue-800 hover:scale-105 hover:shadow-xl'>
            Mulai Belajar
          </div>
        </NavLink>
      </div>

      <div className='bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col'>
        <NavLink to="/belajar/JS" className="flex flex-col flex-1">
          <div className='flex items-center justify-center h-48 mb-4'>
            <img 
              src={Javascript}
              alt="Belajar JavaScript"
              className='max-h-full max-w-full object-contain rounded-lg'
            />
          </div>
          <h2 className='font-bold text-2xl text-black mb-4 text-center'>JavaScript</h2>
          <div className='mt-auto bg-blue-700 py-3 w-full flex items-center justify-center text-white font-bold rounded-lg transition-all duration-300 hover:bg-blue-800 hover:scale-105 hover:shadow-xl'>
            Mulai Belajar
          </div>
        </NavLink>
      </div>

    </div>
  )
}

export default CardBelajar