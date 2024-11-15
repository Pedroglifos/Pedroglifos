
// SenteiaVF-variable-font-displayer.js
(function() {
  const fontUrl = 'https://freight.cargo.site/m/I2067048720445146708319645111634/SenteiaVF.woff2';
  const fontName = 'SenteiaVF';
  const id = 'vf-displayer-SenteiaVF';
  const initialText = 'The quick brown fox jumps over the lazy dog';
  const initialFontSize = 48;
  const axesValues = {"TEMP":0};
  const fontAxes = {"TEMP":{"min":0,"max":100,"default":0,"displayName":"Temperament"}};

  // Create and append style
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: 'CustomFont-${fontName}';
      src: url('${fontUrl}') format('woff2');
    }
    #${id} {
      font-family: sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #25264F;
      color: white;
    }
    #${id} .vfd-sample-text {
      font-family: 'CustomFont-${fontName}', sans-serif;
      font-size: ${initialFontSize}px;
      min-height: 100px;
      text-align: center;
      margin-bottom: 20px;
      padding: 10px;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 5px;
      outline: none;
    }
    #${id} .vfd-slider-wrapper {
      margin-bottom: 15px;
    }
    #${id} .vfd-slider {
      -webkit-appearance: none;
      width: 100%;
      height: 3px;
      background: #d3d3d3;
      outline: none;
      opacity: 0.7;
      transition: opacity .2s;
    }
    #${id} .vfd-slider:hover {
      opacity: 1;
    }
    #${id} .vfd-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      background: #FDFC9A;
      cursor: pointer;
      border-radius: 50%;
    }
    #${id} .vfd-slider::-moz-range-thumb {
      width: 20px;
      height: 20px;
      background: #FDFC9A;
      cursor: pointer;
      border-radius: 50%;
    }
    #${id} .vfd-label {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
    }
  `;
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
    const settings = Object.entries(axesValues).map(([axis, value]) => `"${axis}" ${value}`);
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
