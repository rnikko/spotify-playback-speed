const spsBase = document.createElement
let spotifyPlaybackEl = null

document.createElement = function (message) {
  const element = spsBase.apply(this, arguments)
  if (message == 'video' || message == 'audio') { spotifyPlaybackEl = element }
  return element
}

const getLastPitchSetting = () => {
  if (localStorage.getItem('pb-settings-prepitch')) {
    return JSON.parse(localStorage.getItem('pb-settings-prepitch'))
  }
  return true
}

const addButtonDisplay = () => {
  const controlsWrapper = document.createElement('div')
  controlsWrapper.id = 'pb-speed-controls-wrapper'
  controlsWrapper.setAttribute('class', 'pb-settings-hover')
  controlsWrapper.onclick = () => { toggleShowControlPanel() }

  const controlsIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  controlsIcon.setAttribute('preserveAspectRatio', 'xMidYMid meet')
  controlsIcon.setAttribute('width', '32')
  controlsIcon.setAttribute('height', '32')
  controlsIcon.setAttribute('viewBox', '0 0 24 24')
  controlsIcon.style = 'padding: 6px'
  const controlsIconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  controlsIconPath.setAttribute('d', 'M13 2.05v2c4.39.54 7.5 4.53 6.96 8.92c-.46 3.64-3.32 6.53-6.96 6.96v2c5.5-.55 9.5-5.43 8.95-10.93c-.45-4.75-4.22-8.5-8.95-8.97v.02M5.67 19.74A9.994 9.994 0 0 0 11 22v-2a8.002 8.002 0 0 1-3.9-1.63l-1.43 1.37m1.43-14c1.12-.9 2.47-1.48 3.9-1.68v-2c-1.95.19-3.81.94-5.33 2.2L7.1 5.74M5.69 7.1L4.26 5.67A9.885 9.885 0 0 0 2.05 11h2c.19-1.42.75-2.77 1.64-3.9M4.06 13h-2c.2 1.96.97 3.81 2.21 5.33l1.42-1.43A8.002 8.002 0 0 1 4.06 13M10 16.5l6-4.5l-6-4.5v9z')
  controlsIconPath.setAttribute('fill', 'currentColor')
  controlsIcon.appendChild(controlsIconPath)

  const controlsSpan = document.createElement('span')
  controlsSpan.id = 'pb-settings-display'
  // controlsSpan.innerHTML = '1.00x'

  controlsWrapper.appendChild(controlsIcon)
  controlsWrapper.appendChild(controlsSpan)

  document.getElementsByClassName('ExtraControls')[0].insertBefore(
    controlsWrapper,
    document.getElementsByClassName('ExtraControls')[0].firstChild
  )
}

const addControlPanel = () => {
  const bottomOffset = document.getElementsByClassName('Root__now-playing-bar')[0].offsetHeight

  const controlPanel = document.createElement('div')
  controlPanel.id = 'pb-speed-control-panel'
  controlPanel.style = `display: none; bottom: ${bottomOffset}px;`

  const headerTextSpan = document.createElement('span')
  headerTextSpan.style = 'line-height: 32px; font-weight: 600;'
  headerTextSpan.innerHTML = 'Playback Speed'
  const headerTextDiv = document.createElement('div')
  headerTextDiv.style = 'flex-grow: 1;'
  headerTextDiv.appendChild(headerTextSpan)

  const resetIconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  resetIconPath.setAttribute('d', 'M12 4c2.1 0 4.1.8 5.6 2.3c3.1 3.1 3.1 8.2 0 11.3c-1.8 1.9-4.3 2.6-6.7 2.3l.5-2c1.7.2 3.5-.4 4.8-1.7c2.3-2.3 2.3-6.1 0-8.5C15.1 6.6 13.5 6 12 6v4.6l-5-5l5-5V4M6.3 17.6C3.7 15 3.3 11 5.1 7.9l1.5 1.5c-1.1 2.2-.7 5 1.2 6.8c.5.5 1.1.9 1.8 1.2l-.6 2c-1-.4-1.9-1-2.7-1.8z')
  resetIconPath.setAttribute('fill', 'currentColor')
  const resetIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  resetIcon.setAttribute('class', 'pb-settings-hover')
  resetIcon.setAttribute('preserveAspectRatio', 'xMidYMid meet')
  resetIcon.setAttribute('width', '32')
  resetIcon.setAttribute('height', '32')
  resetIcon.setAttribute('viewBox', '0 0 24 24')
  resetIcon.style = 'padding: 6px; cursor: pointer'
  resetIcon.appendChild(resetIconPath)
  resetIcon.onclick = () => { resetSettings() }

  const controlPanelHeader = document.createElement('div')
  controlPanelHeader.style = 'height: 32px; display: flex; margin: 0 12px'
  controlPanelHeader.appendChild(headerTextDiv)
  controlPanelHeader.appendChild(resetIcon)

  const sliderLeftText = document.createElement('span')
  sliderLeftText.style = 'line-height: 32px;'
  sliderLeftText.innerHTML = '0.5x'

  const sliderInput = document.createElement('input')
  sliderInput.id = 'pb-speed-slider'
  sliderInput.setAttribute('type', 'range')
  sliderInput.setAttribute('min', '50')
  sliderInput.setAttribute('max', '200')
  sliderInput.oninput = () => { setValues() }
  sliderInput.value = localStorage.getItem('pb-settings-speed') || 100
  setDisplayValue(sliderInput.value / 100)

  const sliderRightText = document.createElement('span')
  sliderRightText.style = 'line-height: 32px;'
  sliderRightText.innerHTML = '2.0x'

  const controlPanelSlider = document.createElement('div')
  controlPanelSlider.style = 'display: flex; margin: 6px 12px;'
  controlPanelSlider.appendChild(sliderLeftText)
  controlPanelSlider.appendChild(sliderInput)
  controlPanelSlider.appendChild(sliderRightText)

  const pPitchInput = document.createElement('input')
  pPitchInput.setAttribute('type', 'checkbox')
  pPitchInput.setAttribute('id', 'preservepitch')
  pPitchInput.style = 'height: 20px; margin: 0px; width: 20px; padding: 8px'
  pPitchInput.oninput = () => { setValues() }
  pPitchInput.checked = getLastPitchSetting()

  const pPitchInputDiv = document.createElement('div')
  pPitchInputDiv.style = 'padding: 6px'
  pPitchInputDiv.appendChild(pPitchInput)

  const pPitchSpan = document.createElement('span')
  pPitchSpan.setAttribute('class', 'pb-settings-hover')
  pPitchSpan.style = 'line-height: 32px; padding-left: 6px;'
  pPitchSpan.innerHTML = 'Preserve Pitch'

  const pPitchLabel = document.createElement('label')
  pPitchLabel.setAttribute('for', 'preservepitch')
  pPitchLabel.style = 'display: flex; height: 32px; width: 100%; margin: 0 6px;'
  pPitchLabel.appendChild(pPitchInputDiv)
  pPitchLabel.appendChild(pPitchSpan)

  const pPitchToggleDiv = document.createElement('div')
  pPitchToggleDiv.style = 'width: 50%; display: flex'
  pPitchToggleDiv.appendChild(pPitchLabel)

  const controlPanelToggles = document.createElement('div')
  controlPanelToggles.style = 'display: flex;'
  controlPanelToggles.appendChild(pPitchToggleDiv)

  controlPanel.appendChild(controlPanelHeader)
  controlPanel.appendChild(controlPanelSlider)
  controlPanel.appendChild(controlPanelToggles)

  document.getElementsByClassName('ExtraControls')[0].appendChild(controlPanel)
}

const setValues = () => {
  const pbSpeed = document.getElementById('pb-speed-slider').value
  const pbPitch = document.getElementById('preservepitch').checked

  spotifyPlaybackEl.playbackRate = pbSpeed / 100
  spotifyPlaybackEl.preservesPitch = pbPitch

  if (localStorage.getItem('pb-settings-speed') !== pbSpeed) {
    setDisplayValue(pbSpeed / 100)
    localStorage.setItem('pb-settings-speed', pbSpeed);
  }

  if (getLastPitchSetting() !== pbPitch) {
    localStorage.setItem('pb-settings-prepitch', pbPitch);
  }
}

const setDisplayValue = (val) => {
  if (val % 1 === 0) {
    document.getElementById('pb-settings-display').innerHTML = `${val}.00x`
  } else {
    document.getElementById('pb-settings-display').innerHTML = `${(val).toString().padEnd(4, '0')}x`
  }
}

const resetSettings = () => {
  document.getElementById('pb-speed-slider').value = 100
  document.getElementById('preservepitch').checked = true
  setValues()
}

const toggleShowControlPanel = () => {
  const controlPanel = document.getElementById('pb-speed-control-panel');
  if (controlPanel.style.display === 'none') {
    controlPanel.style.display = 'block';
  } else {
    controlPanel.style.display = 'none';
  }
}

const init = () =>  {
  try {
    addButtonDisplay()
    addControlPanel()
    setInterval(setValues, 500);
  } catch {
    setTimeout(init, 100)
    return
  }
}

window.onload = () => {
  init()
};
