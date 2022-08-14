// Spotify Playback Speed || 2022 Github-@rnikko
(() => {
  const base = document.createElement;
  let spotifyPlaybackEl;

  let ppCheckbox;
  let ppButton;
  let ppOffPath;
  let ppOnPath;

  let sliderInput;
  let sliderMin;
  let sliderMax;
  let speedResetBtn;

  let settingsBtn;
  let settingsCloseBtn;

  let oldMin;
  let oldMax;
  let minInput;
  let maxInput;
  let resetMinmaxBtn;
  let saveMinmaxBtn;

  let spsMain;
  let spsControls;
  let spsSettings;

  let icon;
  let iconSpan;

  document.createElement = function (tagName) {
    const element = base.apply(this, arguments);
    if (tagName === 'video' || tagName === 'audio') {
      spotifyPlaybackEl = element;
    }
    return element;
  };

  const setValues = () => {
    const val = Number(sliderInput.value);
    const min = minInput.value;
    const max = maxInput.value;
    const pp = ppCheckbox.checked;

    iconSpan.innerHTML = `${val.toFixed(2)}x`;
    sliderInput.style.backgroundSize = `${(val - min) * 100 / (max - min)}% 100%`;

    if (pp) {
      ppButton.classList.add('sps-icon-active');
      ppButton.classList.remove('sps-hover-white');
      ppOffPath.style.display = 'none';
      ppOnPath.style.display = 'block';
    } else {
      ppButton.classList.remove('sps-icon-active');
      ppButton.classList.add('sps-hover-white');
      ppOffPath.style.display = 'block';
      ppOnPath.style.display = 'none';
    }

    localStorage.setItem('sps-speed', val);
    localStorage.setItem('sps-pp', pp);
    localStorage.setItem('sps-speed-min', min);
    localStorage.setItem('sps-speed-max', max);
  };
  let showSettings = false;
  let showMain = false;
  const toggleShowSettings = () => {
    showSettings = !showSettings;
    if (showSettings) {
      spsControls.style.display = 'none';
      spsSettings.style.display = 'block';
    } else {
      spsControls.style.display = 'block';
      spsSettings.style.display = 'none';
    }
  };
  const toggleShowMain = () => {
    showMain = !showMain;
    if (showMain) {
      spsMain.style.display = 'block';
    } else {
      spsMain.style.display = 'none';
    }
    if (showSettings) {
      toggleShowSettings();
    }
  };

  const resetMinMax = () => {
    minInput.value = 0.5;
    maxInput.value = 2;
  };
  const saveMinMax = () => {
    sliderInput.min = minInput.value;
    sliderInput.max = maxInput.value;
    localStorage.setItem('sps-speed-min', minInput.value);
    localStorage.setItem('sps-speed-max', maxInput.value);
    sliderMin.innerHTML = `${Number(minInput.value) * 1}x`;
    sliderMax.innerHTML = `${Number(maxInput.value) * 1}x`;
    setValues();
    toggleShowSettings();
  };

  const cleanStorage = () => {
    const oldSpeed = localStorage.getItem('pb-settings-speed');
    const oldPp = localStorage.getItem('pb-settings-prepitch');

    if (oldSpeed) {
      localStorage.setItem('sps-speed', Number(oldSpeed) / 100);
      localStorage.removeItem('pb-settings-speed');
    }

    if (oldPp) {
      localStorage.setItem('sps-pp', oldPp);
      localStorage.removeItem('pb-settings-prepitch');
    }
  };

  const checkForMainEl = () => {
    const mainEl = document.querySelector('#main');
    if (mainEl === null) {
      throw 'Main container element not found';
    }
  };

  const addHTML = () => {
    const sps = document.querySelector('#sps');
    if (sps) {
      sps.remove()
    }

    spsControls = document.createElement('div');
    spsControls.id = 'sps-controls';
    spsControls.style.display = 'block';
    spsControls.innerHTML = '<div class="sps-common"><span class="sps-header">Playback Speed</span><div style="flex-grow: 1;"></div><button id="sps-settings-btn" class="sps-text-button">SETTINGS</button></div><div class="sps-common"><span id="sps-speed-min" style="line-height: 32px;">0.5x</span><input id="sps-input-slider" name="sps-slider" type="range" min="0.5" max="2" step="0.01" style="margin: 0px 0.75rem; background-size: 33.3333% 100%;"><span id="sps-speed-max" style="line-height: 32px;">2x</span></div><div class="sps-common"><button id="sps-pp" class="sps-icon-active" style="font-size: 16px; background-color: transparent; display: flex; flex-wrap: nowrap; align-items: center; user-select: none;"><input name="sps-pp" type="checkbox" style="display: none"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1.27rem" height="1.125rem" preserveAspectRatio="xMidYMid meet" viewBox="0 0 576 512"><path class="pp-off" fill="currentColor" d="M384 64H192C85.961 64 0 149.961 0 256s85.961 192 192 192h192c106.039 0 192-85.961 192-192S490.039 64 384 64zM64 256c0-70.741 57.249-128 128-128c70.741 0 128 57.249 128 128c0 70.741-57.249 128-128 128c-70.741 0-128-57.249-128-128zm320 128h-48.905c65.217-72.858 65.236-183.12 0-256H384c70.741 0 128 57.249 128 128c0 70.74-57.249 128-128 128z" style="display: none" /><path class="pp-on" fill="currentColor" d="M384 64H192C86 64 0 150 0 256s86 192 192 192h192c106 0 192-86 192-192S490 64 384 64zm0 320c-70.8 0-128-57.3-128-128c0-70.8 57.3-128 128-128c70.8 0 128 57.3 128 128c0 70.8-57.3 128-128 128z" style="display: none" /></svg><span style="margin-left: 0.5rem; line-height: 1;">Preserve Pitch</span></button><div style="flex-grow: 1;"></div><button id="sps-reset-btn" class="sps-text-button">1x</button></div>';

    spsSettings = document.createElement('div');
    spsSettings.id = 'sps-settings';
    spsSettings.style.display = 'none';
    spsSettings.innerHTML = '<div class="sps-common"><span class="sps-header">Settings</span><div style="flex-grow: 1;"></div><button id="sps-settings-close-btn" class="sps-text-button">CLOSE</button></div><div style="display: flex; flex-wrap: wrap; width: 98px;"><label class="sps-common" style="width: 100%">Min:<div style="flex-grow: 1;"></div><input type="number" name="sps-min" min="0.07" max="15.999" step="0.1"></label><label class="sps-common" style="width: 100%">Max:<div style="flex-grow: 1;"></div><input type="number" name="sps-max" min="1" max="16" step="0.1"></label></div><div class="sps-common"><div style="flex-grow: 1;"></div><button id="sps-minmax-reset" class="sps-text-button">RESET</button><button id="sps-minmax-save" class="sps-text-button" style="margin-left: 0.5rem;">SAVE</button></div>';

    spsMain = document.createElement('div');
    spsMain.id = 'sps-main';
    spsMain.style.display = 'none';

    spsMain.appendChild(spsControls);
    spsMain.appendChild(spsSettings);

    const spsIcon = document.createElement('div');
    spsIcon.id = 'sps-icon';
    spsIcon.setAttribute('class', 'sps-hover-white');
    spsIcon.innerHTML = '<svg preserveAspectRatio="xMidYMid meet" width="2rem" height="2rem" viewBox="0 0 24 24" fill="currentColor" style="padding: 0.375rem;"><path d="M13 2.05v2c4.39.54 7.5 4.53 6.96 8.92c-.46 3.64-3.32 6.53-6.96 6.96v2c5.5-.55 9.5-5.43 8.95-10.93c-.45-4.75-4.22-8.5-8.95-8.97v.02M5.67 19.74A9.994 9.994 0 0 0 11 22v-2a8.002 8.002 0 0 1-3.9-1.63l-1.43 1.37m1.43-14c1.12-.9 2.47-1.48 3.9-1.68v-2c-1.95.19-3.81.94-5.33 2.2L7.1 5.74M5.69 7.1L4.26 5.67A9.885 9.885 0 0 0 2.05 11h2c.19-1.42.75-2.77 1.64-3.9M4.06 13h-2c.2 1.96.97 3.81 2.21 5.33l1.42-1.43A8.002 8.002 0 0 1 4.06 13M10 16.5l6-4.5l-6-4.5v9z" fill="currentColor"></path></svg><span id="sps-icon-text" style="margin-top: -0.125rem; font-size: 0.6875rem;">1.00x</span>';

    const appEl = document.createElement('div');
    appEl.id = 'sps';
    appEl.appendChild(spsMain);
    appEl.appendChild(spsIcon);

    const volumeBarContainer = document.querySelector('.volume-bar').parentNode;
    volumeBarContainer.insertBefore(
      appEl,
      volumeBarContainer.firstChild,
    );
  };
  const addStyle = () => {
    const style = document.createElement('style');
    style.textContent = '#sps{user-select:none;border-width:0 !important;border-style:solid !important;border-color:#e5e7eb}.sps-common{display:flex;flex-wrap:nowrap;align-items:center;height:32px}.sps-header{color:#f0f0f0;font-weight:600;line-height:1}#sps-main{border:1px solid #282828;border-right:0;bottom:90px;right:0;position:absolute}#sps-icon{display:flex;flex-wrap:wrap;justify-content:center;width:2rem;height:2rem}#sps-controls{padding:.5rem .75rem;background-color:#171717;width:320px}#sps-settings{width:240px;padding:.5rem .75rem;background-color:#171717}#sps-settings input{margin-left:.5rem;width:56px;border-radius:.125rem;padding-left:.125rem;padding-right:.125rem;text-align:center;font-size:.875rem}.sps-text-button:hover{background-color:#9B9B9B;cursor:pointer}#sps button:hover{cursor:pointer}#sps button,#sps input{border-width:0 !important;border-style:solid !important;border-color:#e5e7eb}#sps button:disabled{cursor:not-allowed}#sps input[type=number]::-webkit-outer-spin-button,#sps input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}#sps input[type=number]:focus{outline:0}#sps input[type=range]{-webkit-appearance:none;width:100%;height:6px;background:#494949;border-radius:.375rem;background-image:linear-gradient(#fff,#fff);background-size:70% 100%;background-repeat:no-repeat}#sps input[type=range]:hover{background-image:linear-gradient(#2edb64,#2edb64)}#sps input[type=range]::-webkit-slider-thumb{-webkit-appearance:none}#sps input[type=range]::-webkit-slider-runnable-track{width:calc(100% + 16px);height:6px;padding:8px 0;background:transparent}#sps input[type=range]:hover::-webkit-slider-runnable-track{cursor:ew-resize}#sps input[type=range]:hover::-webkit-slider-thumb{display:block;cursor:ew-resize}#sps input[type=range]::-webkit-slider-thumb{display:none;-webkit-appearance:none;border-radius:50%;height:14px;width:14px;background:white;box-shadow:0 4px 6px -1px rgb(0 0 0 / .1),0 2px 4px -2px rgb(0 0 0 / .1);margin-top:-7px}.sps-icon-active,.sps-icon-active:hover{color:#2edb64}.sps-hover-white:hover{color:#FFF}.sps-text-button{background-color:#535353;color:white;font-weight:600;font-size:.625rem;padding:.125rem .25rem;border-radius:.125rem}';
    document.head.append(style);
  };
  const addJS = () => {
    // set vars
    ppCheckbox = document.querySelector('input[name="sps-pp"]');
    ppButton = document.querySelector('button#sps-pp');
    ppOffPath = document.querySelector('path.pp-off');
    ppOnPath = document.querySelector('path.pp-on');

    sliderInput = document.querySelector('input[name="sps-slider"]');
    sliderMin = document.querySelector('span#sps-speed-min');
    sliderMax = document.querySelector('span#sps-speed-max');
    speedResetBtn = document.querySelector('button#sps-reset-btn');

    settingsBtn = document.querySelector('#sps-settings-btn');
    settingsCloseBtn = document.querySelector('#sps-settings-close-btn');

    minInput = document.querySelector('input[name="sps-min"]');
    maxInput = document.querySelector('input[name="sps-max"]');
    resetMinmaxBtn = document.querySelector('button#sps-minmax-reset');
    saveMinmaxBtn = document.querySelector('button#sps-minmax-save');

    spsMain = document.querySelector('#sps-main');
    spsControls = document.querySelector('#sps-controls');
    spsSettings = document.querySelector('#sps-settings');

    icon = document.querySelector('#sps-icon');
    iconSpan = document.querySelector('#sps-icon-text');

    let lastSpeed = 1;
    let lastPp = true;
    let lastMin = 0.5;
    let lastMax = 2;

    // init from storage
    if (localStorage.getItem('sps-speed')) {
      lastSpeed = Number(localStorage.getItem('sps-speed'));
      lastPp = JSON.parse(localStorage.getItem('sps-pp'));
      lastMin = Number(localStorage.getItem('sps-speed-min'));
      lastMax = Number(localStorage.getItem('sps-speed-max'));
    }

    oldMin = lastMin;
    oldMax = lastMax;
    ppCheckbox.checked = lastPp;
    sliderInput.value = lastSpeed;
    sliderInput.min = lastMin;
    sliderInput.max = lastMax;
    minInput.value = lastMin;
    maxInput.value = lastMax;

    sliderMin.innerHTML = `${lastMin}x`;
    sliderMax.innerHTML = `${lastMax}x`;

    // add event listeners
    sliderInput.oninput = setValues;
    ppCheckbox.oninput = setValues;
    minInput.onchange = (e) => {
      let newVal = Number(e.target.value);
      if (newVal >= oldMax) {
        newVal = oldMax - 0.01;
        e.target.value = newVal;
      }
      oldMin = newVal;
    };
    maxInput.onchange = (e) => {
      let newVal = Number(e.target.value);
      if (newVal < oldMin) {
        newVal = oldMin + 0.01;
        e.target.value = newVal;
      }
      oldMax = newVal;
    };
    resetMinmaxBtn.onclick = resetMinMax;
    saveMinmaxBtn.onclick = saveMinMax;
    speedResetBtn.onclick = () => {
      if (sliderInput.max < 1) {
        sliderInput.max = 1;
        maxInput.value = 1;
        localStorage.setItem('sps-speed-max', maxInput.value);
        sliderMax.innerHTML = `${Number(maxInput.value) * 1}x`;
      }
      if (sliderInput.min > 1) {
        sliderInput.min = 1;
        minInput.value = 1;
        localStorage.setItem('sps-speed-min', minInput.value);
        sliderMin.innerHTML = `${Number(minInput.value) * 1}x`;
      }
      sliderInput.value = 1;
      setValues();
    };
    icon.onclick = toggleShowMain;
    settingsBtn.onclick = toggleShowSettings;
    settingsCloseBtn.onclick = (() => {
      minInput.value = sliderInput.min;
      maxInput.value = sliderInput.max;
      toggleShowSettings();
    });
    ppButton.onclick = () => {
      ppCheckbox.checked = !ppCheckbox.checked;
      setValues();
    };

    // set values
    setValues();
    setInterval(() => {
      spotifyPlaybackEl.playbackRate = Number(sliderInput.value);
      spotifyPlaybackEl.preservesPitch = ppCheckbox.checked;
    }, 50);
  };

  let tries = 0;
  const init = () => {
    cleanStorage();
    addStyle();

    try {
      tries += 1;
      console.log('sps➕');
      checkForMainEl();
      addHTML();
      addJS();
      console.log('sps✅');
    } catch {
      if (tries <= 20) {
        setTimeout(init, 500);
        return;
      }
      console.log('sps❌');
    }
  };

  init();
})();
