'use client'

import React, { useState, useEffect } from 'react'
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ClipboardCopy, RefreshCw } from 'lucide-react'

export default function Component() {
  const [fontUrl, setFontUrl] = useState('https://freight.cargo.site/m/N2066770576767101245032178292050/RaroProVF.woff2')
  const [fontAxes, setFontAxes] = useState<{ [key: string]: { min: number; max: number; default: number; displayName: string } }>({})
  const [axesValues, setAxesValues] = useState<{ [key: string]: number }>({})
  const [fontSize, setFontSize] = useState(48)
  const [text, setText] = useState("The quick brown fox jumps over the lazy dog")
  const [newAxis, setNewAxis] = useState({ name: '', displayName: '', min: 0, max: 100 })
  const [generatedJS, setGeneratedJS] = useState('')
  const [generatedHTML, setGeneratedHTML] = useState('')

  useEffect(() => {
    loadFont(fontUrl)
  }, [fontUrl])

  const loadFont = (url: string) => {
    const font = new FontFace('CustomFont', `url(${url})`)
    font.load().then(() => {
      document.fonts.add(font)
      setFontAxes({})
      setAxesValues({})
    }).catch(err => {
      console.error('Error loading font:', err)
    })
  }

  const addAxis = () => {
    if (newAxis.name && !fontAxes[newAxis.name]) {
      setFontAxes(prev => ({
        ...prev,
        [newAxis.name]: { 
          min: newAxis.min, 
          max: newAxis.max, 
          default: newAxis.min, 
          displayName: newAxis.displayName || newAxis.name 
        }
      }))
      setAxesValues(prev => ({
        ...prev,
        [newAxis.name]: newAxis.min
      }))
      setNewAxis({ name: '', displayName: '', min: 0, max: 100 })
    }
  }

  const removeAxis = (axisName: string) => {
    const { [axisName]: _, ...restAxes } = fontAxes
    setFontAxes(restAxes)
    const { [axisName]: __, ...restValues } = axesValues
    setAxesValues(restValues)
  }

  const handleFontUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFontUrl(e.target.value)
  }

  const fontStyle = {
    fontFamily: 'CustomFont, sans-serif',
    fontSize: `${fontSize}px`,
    fontVariationSettings: Object.entries(axesValues)
      .map(([axis, value]) => `"${axis}" ${value}`)
      .join(', '),
  }

  const generateCode = () => {
    const fontName = fontUrl.split('/').pop()?.split('.')[0] || 'customFont'
    const id = `vf-displayer-${fontName}`

    const js = `
// ${fontName}-variable-font-displayer.js
(function() {
  const fontUrl = '${fontUrl}';
  const fontName = '${fontName}';
  const id = '${id}';
  const initialText = '${text}';
  const initialFontSize = ${fontSize};
  const axesValues = ${JSON.stringify(axesValues)};
  const fontAxes = ${JSON.stringify(fontAxes)};

  // Create and append style
  const style = document.createElement('style');
  style.textContent = \`
    @font-face {
      font-family: 'CustomFont-\${fontName}';
      src: url('\${fontUrl}') format('woff2');
    }
    #\${id} {
      font-family: sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #25264F;
      color: white;
    }
    #\${id} .vfd-sample-text {
      font-family: 'CustomFont-\${fontName}', sans-serif;
      font-size: \${initialFontSize}px;
      min-height: 100px;
      text-align: center;
      margin-bottom: 20px;
      padding: 10px;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 5px;
      outline: none;
    }
    #\${id} .vfd-slider-wrapper {
      margin-bottom: 15px;
    }
    #\${id} .vfd-slider {
      -webkit-appearance: none;
      width: 100%;
      height: 3px;
      background: #d3d3d3;
      outline: none;
      opacity: 0.7;
      transition: opacity .2s;
    }
    #\${id} .vfd-slider:hover {
      opacity: 1;
    }
    #\${id} .vfd-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      background: #FDFC9A;
      cursor: pointer;
      border-radius: 50%;
    }
    #\${id} .vfd-slider::-moz-range-thumb {
      width: 20px;
      height: 20px;
      background: #FDFC9A;
      cursor: pointer;
      border-radius: 50%;
    }
    #\${id} .vfd-label {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
    }
  \`;
  document.head.appendChild(style);

  // Create main container
  const vfdContainer = document.createElement('div');
  vfdContainer.id = id;

  // Create sample text
  const sampleText = document.createElement('div');
  sampleText.className = 'vfd-sample-text';
  sampleText.contentEditable = 'true';
  sampleText.textContent = initialText;
  vfdContainer.appendChild(sampleText);

  // Create font size slider
  const fontSizeWrapper = document.createElement('div');
  fontSizeWrapper.className = 'vfd-slider-wrapper';
  const fontSizeLabel = document.createElement('div');
  fontSizeLabel.className = 'vfd-label';
  fontSizeLabel.innerHTML = '<span>Font Size</span><span>' + initialFontSize + 'px</span>';
  const fontSizeSlider = document.createElement('input');
  fontSizeSlider.type = 'range';
  fontSizeSlider.min = '12';
  fontSizeSlider.max = '72';
  fontSizeSlider.value = initialFontSize.toString();
  fontSizeSlider.className = 'vfd-slider';
  fontSizeWrapper.appendChild(fontSizeLabel);
  fontSizeWrapper.appendChild(fontSizeSlider);
  vfdContainer.appendChild(fontSizeWrapper);

  // Create axis sliders
  Object.entries(fontAxes).forEach(([axis, { min, max, displayName }]) => {
    const axisWrapper = document.createElement('div');
    axisWrapper.className = 'vfd-slider-wrapper';
    const axisLabel = document.createElement('div');
    axisLabel.className = 'vfd-label';
    axisLabel.innerHTML = '<span>' + displayName + '</span><span>' + axesValues[axis] + '</span>';
    const axisSlider = document.createElement('input');
    axisSlider.type = 'range';
    axisSlider.min = min.toString();
    axisSlider.max = max.toString();
    axisSlider.value = axesValues[axis].toString();
    axisSlider.className = 'vfd-slider';
    axisSlider.dataset.axis = axis;
    axisWrapper.appendChild(axisLabel);
    axisWrapper.appendChild(axisSlider);
    vfdContainer.appendChild(axisWrapper);
  });

  // Function to update font settings
  function updateFontSettings() {
    const settings = Object.entries(axesValues).map(([axis, value]) => \`"\${axis}" \${value}\`);
    sampleText.style.fontVariationSettings = settings.join(', ');
    sampleText.style.fontSize = fontSizeSlider.value + 'px';
    fontSizeLabel.lastElementChild.textContent = fontSizeSlider.value + 'px';
  }

  // Add event listeners
  fontSizeSlider.addEventListener('input', (e) => {
    fontSizeLabel.lastElementChild.textContent = e.target.value + 'px';
    updateFontSettings();
  });

  vfdContainer.querySelectorAll('.vfd-slider[data-axis]').forEach(slider => {
    slider.addEventListener('input', (e) => {
      const axis = e.target.dataset.axis;
      axesValues[axis] = parseFloat(e.target.value);
      e.target.previousElementSibling.lastElementChild.textContent = e.target.value;
      updateFontSettings();
    });
  });

  // Initial update
  updateFontSettings();

  // Append to document
  document.body.appendChild(vfdContainer);
})();
`

    const html = `<div id="${id}"></div>`

    setGeneratedJS(js)
    setGeneratedHTML(html)
  }

  const resetCode = () => {
    setGeneratedJS('')
    setGeneratedHTML('')
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="p-6 w-full bg-[#25264F] text-white">
      <h2 className="text-2xl font-bold mb-6 text-center">Variable Font Displayer</h2>
      
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-grow">
            <Label htmlFor="font-url" className="text-sm">Font URL</Label>
            <Input
              id="font-url"
              placeholder="Enter font URL"
              value={fontUrl}
              onChange={handleFontUrlChange}
              className="w-full bg-white text-black"
            />
          </div>
          <Button onClick={() => loadFont(fontUrl)}>Load Font</Button>
        </div>

        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <Label htmlFor="axis-name" className="text-sm">Axis name</Label>
            <Input
              id="axis-name"
              placeholder="Axis name"
              value={newAxis.name}
              onChange={(e) => setNewAxis(prev => ({ ...prev, name: e.target.value }))}
              className="w-32 bg-white text-black"
            />
          </div>
          <div>
            <Label htmlFor="axis-text" className="text-sm">Axis text</Label>
            <Input
              id="axis-text"
              placeholder="Axis text"
              value={newAxis.displayName}
              onChange={(e) => setNewAxis(prev => ({ ...prev, displayName: e.target.value }))}
              className="w-32 bg-white text-black"
            />
          </div>
          <div>
            <Label htmlFor="axis-min" className="text-sm">Min</Label>
            <Input
              id="axis-min"
              type="number"
              placeholder="Min"
              value={newAxis.min}
              onChange={(e) => setNewAxis(prev => ({ ...prev, min: Number(e.target.value) }))}
              className="w-24 bg-white text-black"
            />
          </div>
          <div>
            <Label htmlFor="axis-max" className="text-sm">Max</Label>
            <Input
              id="axis-max"
              type="number"
              placeholder="Max"
              value={newAxis.max}
              onChange={(e) => setNewAxis(prev => ({ ...prev, max: Number(e.target.value) }))}
              className="w-24 bg-white text-black"
            />
          </div>
          <Button onClick={addAxis}>Add Axis</Button>
        </div>
      </div>

      <div 
        contentEditable 
        suppressContentEditableWarning
        style={fontStyle} 
        className="mb-6 text-center break-words outline-none min-h-[100px]"
        onBlur={(e) => setText(e.currentTarget.textContent || '')}
      >
        {text}
      </div>

      <div className="space-y-4 w-full px-[6%]">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Font Size: {fontSize}px</Label>
          <Slider
            value={[fontSize]}
            onValueChange={(value) => setFontSize(value[0])}
            min={12}
            max={72}
            step={1}
            className="[&_[role=slider]]:bg-[#FDFC9A] [&_[role=slider]]:border-[#FDFC9A] [&_[role=slider]]:w-5 [&_[role=slider]]:h-5 [&>.relative]:h-[3px]"
          />
        </div>
        {Object.entries(fontAxes).map(([axis, { min, max, displayName }]) => (
          <div key={axis} className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">
                {displayName}: {axesValues[axis]?.toFixed(2)}
              </Label>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => removeAxis(axis)}
              >
                Remove
              </Button>
            </div>
            <Slider
              value={[axesValues[axis] || 0]}
              onValueChange={(value) => setAxesValues(prev => ({ ...prev, [axis]: value[0] }))}
              min={min}
              max={max}
              step={(max - min) / 100}
              className="[&_[role=slider]]:bg-[#FDFC9A] [&_[role=slider]]:border-[#FDFC9A] [&_[role=slider]]:w-5 [&_[role=slider]]:h-5 [&>.relative]:h-[3px]"
            />
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex justify-between">
          <Button onClick={generateCode} className="flex-grow mr-2">Generate Code</Button>
          <Button onClick={resetCode} variant="outline" className="flex items-center border border-white bg-transparent hover:bg-white/10">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
        {generatedHTML && (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="text-sm font-medium">HTML to Copy:</Label>
                <Button 
                  onClick={() => copyToClipboard(generatedHTML)} 
                  variant="outline" 
                  size="sm"
                  className="flex items-center border border-white bg-transparent hover:bg-white/10"
                >
                  <ClipboardCopy className="w-4 h-4 mr-2" />
                  Copy HTML
                </Button>
              </div>
              <Textarea
                value={generatedHTML}
                readOnly
                className="w-full h-24 bg-gray-800 text-white font-mono text-sm p-4"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label className="text-sm font-medium">JavaScript to Copy:</Label>
                <Button 
                  onClick={() => copyToClipboard(generatedJS)} 
                  variant="outline" 
                  size="sm"
                  className="flex items-center border border-white bg-transparent hover:bg-white/10"
                >
                  <ClipboardCopy className="w-4 h-4 mr-2" />
                  Copy JS
                </Button>
              </div>
              <Textarea
                value={generatedJS}
                readOnly
                className="w-full h-64 bg-gray-800 text-white font-mono text-sm p-4"
              />
            </div>
            <div className="mt-4">
              <p className="text-sm text-yellow-300 bg-gray-800 p-4 rounded">
                Don't forget your script tag in the head!
                <br />
                <code className="block mt-2">
                  &lt;script src=".../{fontUrl.split('/').pop()?.split('.')[0] || 'customFont'}-variable-font-displayer.js"&gt;&lt;/script&gt;
                </code>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}