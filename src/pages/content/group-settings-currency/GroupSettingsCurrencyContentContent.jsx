import {useState, useEffect, useRef} from 'react';
import {useParams} from 'react-router-dom';
import { DEFAULT_CURRENCY_SYMBOL } from '../../../constants/currency.constants.js';
import { invalidateGroupCurrency } from '../../../services/groupCurrencyEvents.js';
import { fetchGroupCurrencyConfig, updateGroupCurrencyConfig } from '../../../services/groupCurrency.api.js';

import leftleft from '../../../../public/assets/icons/chevron-left-double-svgrepo-com.svg';
import left from '../../../../public/assets/icons/chevron-left-svgrepo-com.svg';
import rightright from '../../../../public/assets/icons/chevron-right-double-svgrepo-com.svg';
import right from '../../../../public/assets/icons/chevron-right-svgrepo-com.svg';

import 'unicode-emoji-picker';

export default function App() {

  const {groupId} = useParams();
  const [errorMessage, setErrorMessage] = useState('');

  const [currenticon, setCurrenticon] = useState(DEFAULT_CURRENCY_SYMBOL);
  const [currencyname, setCurrencyname] = useState('');
  
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const pickerRef = useRef(null);


  function onPickerMounted(picker) {
    if (!picker) {
      return;
    }

    picker.addEventListener('emoji-pick', (event) => {
      setCurrenticon(event.detail.emoji);
      setIsPickerOpen(false);
    });
  }





  function applycurrencydata(data) {

    let namevalue = data.currency;

    if (namevalue == null) {
      namevalue = '';
    }

    setCurrencyname(namevalue);

    let iconvalue = data.currencyEmoji;

    if (iconvalue == null || iconvalue == '') {
      iconvalue = DEFAULT_CURRENCY_SYMBOL;
    }

    setCurrenticon(iconvalue);
  }





  async function onfetchcurrencysettings() {

    setErrorMessage('');

    try {
      const result = await fetchGroupCurrencyConfig(groupId);
      if (result.ok && result.config) {
        applycurrencydata(result.config);
      }
    } catch (error) {

      let message;

      if (error instanceof Error) {
        message = error.message;
      } else {
        message = String(error);
      }

      setErrorMessage(message);
    }
  }





  function resetcurrencysettings() {
    onfetchcurrencysettings();
  }





  async function savecurrencychanges() {

    setErrorMessage('');

    try {
      const result = await updateGroupCurrencyConfig(groupId, {
        currency: currencyname.trim(),
        currencyEmoji: currenticon,
      });

      if (result.ok && result.config) {
        applycurrencydata(result.config);
        invalidateGroupCurrency(groupId);
      }
    } catch (error) {

      let message;

      if (error instanceof Error) {
        message = error.message;
      } else {
        message = String(error);
      }

      setErrorMessage(message);
    }
  }





  useEffect(() => {
    onfetchcurrencysettings();
  }, []);



  return (
    <div>
      <div>
        <div style = {{width: '75vw', height: '100%', position: 'relative', top: '0%', left: '0%'}}>

          <div style = {{width: '98%', position: 'relative', top: '0%', left: '1%', display: 'flex', flexDirection: 'column', gap: '2vh', paddingBottom: '4vh'}}>



            <div style = {{backgroundColor: 'rgb(26, 26, 42)', width: '100%', position: 'relative', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '2vh', paddingTop: '2vh', paddingBottom: '2vh', paddingLeft: '2%', paddingRight: '2%'}}>

              <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', gap: '1vh'}}>
                <div style = {{width: '100%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start'}}>Ikona waluty</div>
                <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '2vh'}}>
                  
                  <div onClick = {() => setIsPickerOpen(!isPickerOpen)} style = {{backgroundColor: 'rgb(40, 40, 52)', height: '14vh', aspectRatio: '1 / 1', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer'}}>
                    <div style = {{color: 'rgb(227, 224, 247)', fontSize: '48px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'center'}}>{currenticon}</div>
                  </div>
                  
                  {isPickerOpen ? (
                    <div onClick = {() => setIsPickerOpen(false)} style = {{position: 'fixed', top: '0vh', left: '0vw', width: '100vw',  height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999}}>
                      <div onClick = {(event) => event.stopPropagation()} style = {{position: 'relative'}}><unicode-emoji-picker ref = {onPickerMounted} style = {{'--fill-color': 'rgb(40, 40, 52)', '--text-color': 'rgb(227, 224, 247)', '--title-bar-fill-color': 'rgb(40, 40, 52)', '--variations-fill-color': 'rgb(26, 26, 42)', '--variations-backdrop-fill-color': 'rgba(40, 40, 52, 0.75)'}}></unicode-emoji-picker></div>
                    </div>
                  ) : null}

                </div>
              </div>

              <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.5vh'}}>
                <div style = {{width: '100%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}>Nazwa waluty</div>
                <input onChange = {(event) => setCurrencyname(event.target.value)} style = {{backgroundColor: 'rgb(40, 40, 52)', width: '30%', height: '5vh', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%', borderRadius: '8px', border: 'none', outline: 'none'}} value = {currencyname} onFocus = {(event) => (event.target.style.border = '2px solid rgb(30, 204, 56)')} onBlur = {(event) => (event.target.style.border = 'none')}></input>
              </div>

              <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: '2%', paddingTop: '1vh'}}>
                <div onClick = {() => resetcurrencysettings()} style = {{backgroundColor: 'rgb(40, 40, 52)', width: '10vw', position: 'relative', borderRadius: '8px', color: 'rgb(227, 224, 247)', fontSize: '16px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer', paddingTop: '1vh', paddingBottom: '1vh'}}>Cofnij zmiany</div>
                <div onClick = {() => savecurrencychanges()} style = {{backgroundColor: 'rgba(30, 204, 56)', width: '10vw', position: 'relative', borderRadius: '8px', color: 'rgb(0, 57, 21)', fontSize: '16px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer', paddingTop: '1vh', paddingBottom: '1vh'}}>Zapisz zmiany</div>
              </div>

            </div>

          </div>

        </div>
      </div>


    </div>
  )
}


