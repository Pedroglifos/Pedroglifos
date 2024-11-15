'use client'

import React, { useState, useEffect } from 'react'
import * as Slider from '@radix-ui/react-slider'
import { ClipboardCopy, RefreshCw } from 'lucide-react'

export default function VariableFontDisplayer() {
  const [fontUrl, setFontUrl] = useState('https://freight.cargo.site/m/N2066770576767101245032178292050/RaroProVF.woff2')
  const [fontAxes, setFontAxes] = useState<{ [key: string]: { min: number; max: number; default: number; displayName: string } }>({})
  const [axesValues, setAxesValues] = useState<{ [key: string]: number }>({})
  const [fontSize, setFontSize] = useState(48)
  const [text, setText] = useState("The quick brown fox jumps over the lazy dog")
  const [newAxis, setNewAxis] = useState({ name: '', displayName: '', min: 0, max: 100 })
  const [generatedJS, setGeneratedJS] = useState('')
  const [generatedHTML, setGeneratedHTML] = useState('')

  // ... rest of your component code ...

  return (
    <div className="p-6 w-full bg-[#25264F] text-white">
      <h2 className="text-2xl font-bold mb-6 text-center">Variable Font Displayer</h2>
      
      {/* ... rest of your component JSX ... */}
    </div>
  )
}