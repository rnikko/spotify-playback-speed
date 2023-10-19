// Spotify Playback Speed || 2022 Github-@rnikko
(() => {
  const base = document.createElement;
  let spotifyPlaybackEl;

  let ppCheckbox;
  let ppButton;
  let ppOffPath;
  let ppOnPath;
  let seekCheckbox;
  let seekButton;
  let seekOffPath;
  let seekOnPath;
  let sliderInput;
  let sliderMin;
  let sliderMax;
  let seekInput;
  let seekText;
  let speedResetBtn;

  let settingsBtn;
  let settingsCloseBtn;

  let oldMin;
  let oldMax;
  let minInput;
  let maxInput;
  let resetMinmaxBtn;
  let saveMinmaxBtn;
  let spsSeekButtonLeft;
  let spsSeekButtonRight;

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

  const setValues = (action) => { // This might be initialization 
    const val = Number(sliderInput.value);
    const min = minInput.value;
    const max = maxInput.value;
    const pp = ppCheckbox.checked;
    const seek = seekCheckbox.checked;

    iconSpan.innerHTML = `${val.toFixed(2)}x`;
    sliderInput.style.backgroundSize = `${((val - min) * 100) / (max - min)}% 100%`;

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

    if (seek) {
      seekButton.classList.add('sps-icon-active');
      seekButton.classList.remove('sps-hover-white');
      seekOffPath.style.display = 'none';
      seekOnPath.style.display = 'block';

      spsSeekButtonLeft.style.display = 'block';
      spsSeekButtonRight.style.display = 'block';
    } else {
      seekButton.classList.remove('sps-icon-active');
      seekButton.classList.add('sps-hover-white');
      seekOffPath.style.display = 'block';
      seekOnPath.style.display = 'none';

      spsSeekButtonLeft.style.display = 'none';
      spsSeekButtonRight.style.display = 'none';
    }

    localStorage.setItem('sps-speed', val);
    localStorage.setItem('sps-pp', pp);
    localStorage.setItem('sps-seek-toggle', seek);
    localStorage.setItem('sps-speed-min', min);
    localStorage.setItem('sps-speed-max', max);

    spotifyPlaybackEl.playbackRate = { source: 'sps', value: val };
    spotifyPlaybackEl.preservesPitch = pp;

    if (action && action.action === "seek"){
      seekInput.value = action.seekValue;
      spotifyPlaybackEl.currentTime = { source: 'sps', value: action.seekValue };
    }
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
    document.querySelector('#sps-icon').classList.toggle('sps-icon-active');
    if (showSettings) {
      toggleShowSettings();
    }
  };

  const resetMinMax = () => {
    minInput.value = 0.5;
    maxInput.value = 2;
  };

  const saveMinMax = () => {
    sliderInput.min = minInput.value !== '0' && minInput.value ? minInput.value : '0.5';
    sliderInput.max = maxInput.value !== '0' && maxInput.value ? maxInput.value : '2';
    localStorage.setItem('sps-speed-min', minInput.value);
    localStorage.setItem('sps-speed-max', maxInput.value);
    localStorage.setItem('sps-seek-amt', seekInput.value);
    sliderMin.innerHTML = `${Number(minInput.value) * 1}x`;
    sliderMax.innerHTML = `${Number(maxInput.value) * 1}x`;

    spsSeekButtonLeft.onclick = () => {
      setValues({action: "seek", seekValue: Number(seekInput.value) * -1});
    }
    spsSeekButtonRight.onclick = () => {
      setValues({action: "seek", seekValue: Number(seekInput.value)});
    }

    seekText[0].innerHTML = `${seekInput.value}`;
    seekText[1].innerHTML = `${seekInput.value}`;

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
    const spsSeekButtons = document.querySelectorAll('.sps-seek-button');
    if (sps) {
      sps.remove();
    }

    if (spsSeekButtons) {
        spsSeekButtons.forEach(element => {
          element.remove();
        });
    }

    spsControls = document.createElement('div');
    spsControls.id = 'sps-controls';
    spsControls.style.display = 'block';
    spsControls.innerHTML = '<div class="sps-common"><span class="sps-header">Playback Speed</span>  <div style="flex-grow: 1;"></div><button id="sps-settings-btn" class="sps-text-button">SETTINGS</button></div><div class="sps-common"><span id="sps-speed-min" style="line-height: 32px;">0.5x</span><input id="sps-input-slider"    name="sps-slider" type="range" min="0.5" max="2" step="0.01"    style="margin: 0px 0.75rem; background-size: 33.3333% 100%;"><span id="sps-speed-max"    style="line-height: 32px;">2x</span></div><div class="sps-common"><button id="sps-pp" class="sps-icon-active"    style="font-size: 16px; background-color: transparent; display: flex; flex-wrap: nowrap; align-items: center; user-select: none;"><input      name="sps-pp" type="checkbox" style="display: none"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true"      role="img" width="1.27rem" height="1.125rem" preserveAspectRatio="xMidYMid meet" viewBox="0 0 576 512">      <path class="pp-off" fill="currentColor"        d="M384 64H192C85.961 64 0 149.961 0 256s85.961 192 192 192h192c106.039 0 192-85.961 192-192S490.039 64 384 64zM64 256c0-70.741 57.249-128 128-128c70.741 0 128 57.249 128 128c0 70.741-57.249 128-128 128c-70.741 0-128-57.249-128-128zm320 128h-48.905c65.217-72.858 65.236-183.12 0-256H384c70.741 0 128 57.249 128 128c0 70.74-57.249 128-128 128z"        style="display: none" />      <path class="pp-on" fill="currentColor"        d="M384 64H192C86 64 0 150 0 256s86 192 192 192h192c106 0 192-86 192-192S490 64 384 64zm0 320c-70.8 0-128-57.3-128-128c0-70.8 57.3-128 128-128c70.8 0 128 57.3 128 128c0 70.8-57.3 128-128 128z"        style="display: none" />    </svg><span style="margin-left: 0.5rem; line-height: 1;">Preserve Pitch</span></button>  <div style="flex-grow: 1;"></div><button id="sps-reset-btn" class="sps-text-button">1x</button></div><div class="sps-common"><span class="sps-header">Seek</span><div style="flex-grow: 1;"></div></div><div class="sps-common"><button id="sps-seek" class="sps-icon-active"  style="font-size: 16px; background-color: transparent; display: flex; flex-wrap: nowrap; align-items: center; user-select: none;"><input    name="sps-seek" type="checkbox" style="display: none"><svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true"    role="img" width="1.27rem" height="1.125rem" preserveAspectRatio="xMidYMid meet" viewBox="0 0 576 512">    <path class="seek-off" fill="currentColor"      d="M384 64H192C85.961 64 0 149.961 0 256s85.961 192 192 192h192c106.039 0 192-85.961 192-192S490.039 64 384 64zM64 256c0-70.741 57.249-128 128-128c70.741 0 128 57.249 128 128c0 70.741-57.249 128-128 128c-70.741 0-128-57.249-128-128zm320 128h-48.905c65.217-72.858 65.236-183.12 0-256H384c70.741 0 128 57.249 128 128c0 70.74-57.249 128-128 128z"      style="display: none" />    <path class="seek-on" fill="currentColor"      d="M384 64H192C86 64 0 150 0 256s86 192 192 192h192c106 0 192-86 192-192S490 64 384 64zm0 320c-70.8 0-128-57.3-128-128c0-70.8 57.3-128 128-128c70.8 0 128 57.3 128 128c0 70.8-57.3 128-128 128z"      style="display: none" />  </svg><span style="margin-left: 0.5rem; line-height: 1;">Show Seek Buttons</span></button>';

    spsSettings = document.createElement('div');
    spsSettings.id = 'sps-settings';
    spsSettings.style.display = 'none';
    spsSettings.innerHTML = '<div class="sps-common"><span class="sps-header">Settings</span>  <div style="flex-grow: 1;"></div><button id="sps-settings-close-btn" class="sps-text-button">CLOSE</button></div><div style="display: flex; flex-wrap: wrap; width: 98px;">  <div>    Playback  </div>  <label class="sps-common" style="width: 100%">Min:<div style="flex-grow: 1;"></div><input type="number" name="sps-min"      min="0.07" max="15.999" step="0.1"></label><label class="sps-common" style="width: 100%">Max:<div      style="flex-grow: 1;"></div><input type="number" name="sps-max" min="1" max="16" step="0.1"></label></div><div style="display: flex; flex-wrap: wrap; width: 98px;">  <div>    Seek  </div>  <div style="display: flex; flex-wrap: wrap; width: 98px;">    <label class="sps-common" style="width: 100%; margin-right: 2rem;"><div style="flex-grow: 1;"></div><input type="number" name="sps-seek-input"        min="0.07" max="15.999" step="0.1">Seconds</label>  </div></div><div class="sps-common">  <div style="flex-grow: 1;"></div><button id="sps-minmax-reset" class="sps-text-button">RESET</button><button    id="sps-minmax-save" class="sps-text-button" style="margin-left: 0.5rem;">SAVE</button></div>';

    spsMain = document.createElement('div');
    spsMain.id = 'sps-main';
    spsMain.style.display = 'none';

    spsMain.appendChild(spsControls);
    spsMain.appendChild(spsSettings);

    const spsIcon = document.createElement('div');
    spsSeekButtonLeft = document.createElement('div');
    spsSeekButtonRight = document.createElement('div');
    spsIcon.id = 'sps-icon';
    spsSeekButtonLeft.classList.add('sps-seek-button', 'sps-hover-white');
    spsSeekButtonRight.classList.add('sps-seek-button', 'sps-hover-white');
    spsIcon.classList.add('sps-hover-white');
    spsIcon.innerHTML = '<svg preserveAspectRatio="xMidYMid meet" width="2rem" height="2rem" viewBox="0 0 24 24" fill="currentColor" style="padding: 0.375rem;"><path d="M13 2.05v2c4.39.54 7.5 4.53 6.96 8.92c-.46 3.64-3.32 6.53-6.96 6.96v2c5.5-.55 9.5-5.43 8.95-10.93c-.45-4.75-4.22-8.5-8.95-8.97v.02M5.67 19.74A9.994 9.994 0 0 0 11 22v-2a8.002 8.002 0 0 1-3.9-1.63l-1.43 1.37m1.43-14c1.12-.9 2.47-1.48 3.9-1.68v-2c-1.95.19-3.81.94-5.33 2.2L7.1 5.74M5.69 7.1L4.26 5.67A9.885 9.885 0 0 0 2.05 11h2c.19-1.42.75-2.77 1.64-3.9M4.06 13h-2c.2 1.96.97 3.81 2.21 5.33l1.42-1.43A8.002 8.002 0 0 1 4.06 13M10 16.5l6-4.5l-6-4.5v9z" fill="currentColor"></path></svg><span id="sps-icon-text" style="margin-top: -0.125rem; font-size: 0.6875rem;">1.00x</span>';

    spsSeekButtonLeft.innerHTML= '<svg role="img" height="20" width="20" aria-hidden="true" viewBox="-2 -2 20 20" data-encore-id="icon" class="Svg-sc-ytk21e-0 haNxPq" preserveAspectRatio="xMaxYMax meet"><g transform="scale(-1, 1) translate(-16,0)"><path d="M13.536 4.5h-1.473a.75.75 0 1 0 0 1.5H16V2.063a.75.75 0 0 0-1.5 0v1.27A8.25 8.25 0 1 0 3.962 15.887a.75.75 0 1 0 .827-1.25A6.75 6.75 0 1 1 13.535 4.5z"></path></g><svg text-anchor="end" width="20" viewBox="-1 0 20 20" height="20"><text class="sps-seek-txt" x="10" y="16">10</text></svg></svg>';
    spsSeekButtonRight.innerHTML= '<svg role="img" height="20" width="20" aria-hidden="true" viewBox="-2 -2 20 20" data-encore-id="icon" class="Svg-sc-ytk21e-0 haNxPq"><path d="M13.536 4.5h-1.473a.75.75 0 1 0 0 1.5H16V2.063a.75.75 0 0 0-1.5 0v1.27A8.25 8.25 0 1 0 3.962 15.887a.75.75 0 1 0 .827-1.25A6.75 6.75 0 1 1 13.535 4.5z"></path><text class="sps-seek-txt" x="6" y="16">15</text></svg>';

    const appEl = document.createElement('div');
    appEl.id = 'sps';
    appEl.appendChild(spsMain);
    appEl.appendChild(spsIcon);

    // appEl.appendChild(spsSeekButton); //not appending to correct thing rn
    const muteButton = document.querySelector('button[aria-describedby="volume-icon"]');
    const leftPlayButtons = document.querySelector('.player-controls__left');
    const rightPlayButtons = document.querySelector('.player-controls__right');
    const volumeBarContainer = muteButton.parentNode.parentNode;

    volumeBarContainer.insertBefore(
      appEl,
      volumeBarContainer.firstChild,
    );

    leftPlayButtons.appendChild(spsSeekButtonLeft);
    rightPlayButtons.insertBefore(
      spsSeekButtonRight,
      rightPlayButtons.firstChild,
    );
  };
  const addStyle = () => {
    const style = document.createElement('style');
    style.textContent = '#sps{user-select:none;border-width:0 !important;border-style:solid !important;border-color:#e5e7eb}.sps-common{display:flex;flex-wrap:nowrap;align-items:center;height:32px}.sps-header{color:#f0f0f0;font-weight:600;line-height:1}#sps-main{border:1px solid #282828;border-right:0;bottom:90px;right:0;position:absolute}#sps-icon{display:flex;flex-wrap:wrap;justify-content:center;width:2rem;height:2rem}#sps-controls{padding:.5rem .75rem;background-color:#171717;width:320px}#sps-settings{width:240px;padding:.5rem .75rem;background-color:#171717}#sps-settings input{margin-left:.5rem;width:56px;border-radius:.125rem;padding-left:.125rem;padding-right:.125rem;text-align:center;font-size:.875rem}.sps-text-button:hover{background-color:#9B9B9B;cursor:pointer}#sps button:hover{cursor:pointer}#sps button,#sps input{border-width:0 !important;border-style:solid !important;border-color:#e5e7eb}#sps button:disabled{cursor:not-allowed}#sps input[type=number]{border-radius:.125rem;text-align:center;font-size:.875rem;}#sps input[type=number]::-webkit-outer-spin-button,#sps input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}#sps input[type=number]:focus{outline:0}#sps input[type=range]{-webkit-appearance:none;width:100%;height:6px;background:#494949;border-radius:.375rem;background-image:linear-gradient(#fff,#fff);background-size:70% 100%;background-repeat:no-repeat}#sps input[type=range]:hover{background-image:linear-gradient(#2edb64,#2edb64)}#sps input[type=range]::-webkit-slider-thumb{-webkit-appearance:none}#sps input[type=range]::-webkit-slider-runnable-track{width:calc(100% + 16px);height:6px;padding:8px 0;background:transparent}#sps input[type=range]:hover::-webkit-slider-runnable-track{cursor:ew-resize}#sps input[type=range]:hover::-webkit-slider-thumb{display:block;cursor:ew-resize}#sps input[type=range]::-webkit-slider-thumb{display:none;-webkit-appearance:none;border-radius:50%;height:14px;width:14px;background:white;box-shadow:0 4px 6px -1px rgb(0 0 0 / .1),0 2px 4px -2px rgb(0 0 0 / .1);margin-top:-7px}.sps-icon-active,.sps-icon-active:hover{color:#2edb64!important}.sps-hover-white:hover{color:#FFF}.sps-text-button{background-color:#535353;color:white;font-weight:600;font-size:.625rem;padding:.125rem .25rem;border-radius:.125rem}text{font-size: .625rem;}.sps-seek-button{display:flex !important;align-items:center;}';
    document.head.append(style);
  };

  const addJS = () => {
    // set vars
    ppCheckbox = document.querySelector('input[name="sps-pp"]');
    ppButton = document.querySelector('button#sps-pp');
    ppOffPath = document.querySelector('path.pp-off');
    ppOnPath = document.querySelector('path.pp-on');
    seekCheckbox = document.querySelector('input[name="sps-seek"]');
    seekButton = document.querySelector('button#sps-seek');
    seekOffPath = document.querySelector('path.seek-off');
    seekOnPath = document.querySelector('path.seek-on');

    sliderInput = document.querySelector('input[name="sps-slider"]');
    sliderMin = document.querySelector('span#sps-speed-min');
    sliderMax = document.querySelector('span#sps-speed-max');
    seekInput = document.querySelector('input[name="sps-seek-input"]');
    seekText = document.querySelectorAll('text.sps-seek-txt');

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
    let seekAmt = localStorage.getItem('sps-seek-amt') ? localStorage.getItem('sps-seek-amt') : 1;

    // init from storage
    if (localStorage.getItem('sps-speed')) {
      lastSpeed = Number(localStorage.getItem('sps-speed')) || lastSpeed;
      lastPp = JSON.parse(localStorage.getItem('sps-pp')) || lastPp;

      const storedMin = Number(localStorage.getItem('sps-speed-min'));
      lastMin = (storedMin && storedMin !== 0) ? storedMin : lastMin;

      const storedMax = Number(localStorage.getItem('sps-speed-max'));
      lastMax = (storedMax && storedMax !== 0) ? storedMax : lastMax;
    }
    oldMin = lastMin;
    oldMax = lastMax;
    ppCheckbox.checked = lastPp;
    seekCheckbox.checked = localStorage.getItem('sps-seek-toggle') ? localStorage.getItem('sps-seek-toggle') === "true" : false;
    sliderInput.value = lastSpeed;
    seekInput.value = seekAmt;
    sliderInput.min = lastMin;
    sliderInput.max = lastMax;
    minInput.value = lastMin;
    maxInput.value = lastMax;
    sliderMin.innerHTML = `${lastMin}x`;
    sliderMax.innerHTML = `${lastMax}x`;
    seekText[0].innerHTML = `${seekAmt}`;
    seekText[1].innerHTML = `${seekAmt}`;
    sliderInput.oninput = setValues;
    ppCheckbox.oninput = setValues;
    seekButton.oninput = setValues;
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
    seekButton.onclick = () => {
      seekCheckbox.checked = !seekCheckbox.checked;
      setValues();
    };

    spsSeekButtonLeft.onclick = () => {
      setValues({action: "seek", seekValue: seekAmt * -1});
    };

    spsSeekButtonRight.onclick = () => {
      setValues({action: "seek", seekValue: seekAmt});
    }


    // Allow only {source: this_extension, value: number} type of objects to
    // be set in playbackRate
    if (spotifyPlaybackEl instanceof HTMLMediaElement) {
      const playbackRateDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'playbackRate');
      Object.defineProperty(HTMLMediaElement.prototype, 'playbackRate', {
        set(value) {
          console.log(value, value.source, "pp")
          if (value.source !== 'sps') {
            console.info('sps⚠️ prevented unintended playback speed change');
            playbackRateDescriptor.set.call(this, Number(sliderInput.value));
          } else {
            playbackRateDescriptor.set.call(this, value.value); //it defaults to 1
          }
        },
      });

      const currentTimeDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'currentTime');
      Object.defineProperty(HTMLMediaElement.prototype, 'currentTime', {
        set(value) {
          console.log(value, "sps🕒")
            if (value.source !== 'sps') {
              // console.info('sps⚠️ prevented unintended playback speed change');
              currentTimeDescriptor.set.call(this, value);
            } else {
              //TODO: Add direction to the thing
              console.log("setting it",document.querySelector('[data-test-position').attributes["data-test-position"], value.value)
              const currentTime = document.querySelector('[data-test-position').attributes["data-test-position"].value / 1000; //TODO make sure this is correct
              currentTimeDescriptor.set.call(this, currentTime + value.value);
            }
        }
      });

    }

    setValues();
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
    } catch (error) {
      console.log(`sps🔄 ${error}`);
      if (tries <= 20) {
        setTimeout(init, 500);
        return;
      }
      console.log('sps❌');
    }
  };

  init();
})();
