import { useCallback, useState, useEffect } from 'react';
import { getApiBaseUrl, getSamlLoginUrl } from '../../../constants/api.constants.js';



export default function App() {

  const [errorMessage, setErrorMessage] = useState('');
  const [groupnamevalue, setGroupnamevalue] = useState('');
  const [subjectnamevalue, setSubjectnamevalue] = useState('');
  const [groupnamevalueerror, setGroupnamevalueerror] = useState('');
  const [subjectnamevalueerror, setSubjectnamevalueerror] = useState('');
  const [groupdescriptionvalue, setGroupdescriptionvalue] = useState('');
  const [isVisible, setIsvisible] = useState(true);

  const [bannerFile, setBannerfile] = useState(null);
  const [bannerPreview, setBannerpreview] = useState(null);

  var elements = [
    {id:0, name:'Laboratorium 1'},
    {id:1, name:'Laboratorium 2'},
    {id:2, name:'Laboratorium 3'},
    {id:3, name:'Laboratorium 4'}
  ];




  return (
    <div className="profile-content">
      <div className="profile-content__inner">

          <div style = {{width: '98%', height: '7.5%', position: 'absolute', top: '3%', left: '1%', color: 'rgb(227, 224, 247)', fontSize: '250%', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}>Narzedzia</div>
          <div style = {{width: '98%', height: '5%', position: 'absolute', top: '10.5%', left: '1%', color: 'rgb(187, 203, 185)', fontSize: '100%', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '1%'}}><span>Widok pozwalajacy na wygenerowanie podsumowania, importowanie danych przy uzyciu plikow CSV oraz eksportowanie danych.</span></div>
        </div>





        <div style={{width: '98%', top: '17.5%', position: 'absolute', left: '1%', display: 'flex', flexDirection: 'column', paddingBottom: '1%', gap: '2.5vh'}}>

          <div style={{backgroundColor: 'rgb(26, 26, 42)', width: '100%', position: 'relative', borderRadius: '16px', display: 'flex', flexDirection: 'column', paddingBottom: '1%', gap: '1vh'}}>
            <div style = {{width: '100%', height: '7.5vh', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '21px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '2.5%'}}>Pliki CSV</div>
            <div style = {{width: '100%', height: '5vh', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '2.5%'}}><span>Skroty do najwazniejszych funkcji:</span></div>
            <div style={{width: '100%', height: '25vh', position: 'relative', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingLeft: '5%', paddingRight: '5%', justifyContent: 'center', gap: '4%', paddingTop: '5%', paddingBottom: '5%'}}>
              <div style={{backgroundColor: 'rgba(40, 40, 52)', width: '15vw', height: '25vh', top: '1%', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: '20%', paddingTop: '2.5%', paddingBottom: '1%', borderRadius: '16px', cursor: 'pointer'}}>
                <img style = {{aspectRatio: '1 / 1', height: '50%'}}/>
                <span style={{color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 900, justifyContent: 'center', textAlign: 'center', paddingLeft: '5%', paddingRight: '5%'}}>Wczytaj graczy z pliku</span>
              </div>
              <div style={{backgroundColor: 'rgba(40, 40, 52)', width: '15vw', height: '25vh', top: '1%', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: '20%', paddingTop: '2.5%', paddingBottom: '1%', borderRadius: '16px', cursor: 'pointer'}}>
                <img style = {{aspectRatio: '1 / 1', height: '50%'}}/>
                <span style={{color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 900, justifyContent: 'center', textAlign: 'center', paddingLeft: '5%', paddingRight: '5%'}}>Wczytaj wyniki z pliku</span>
              </div>
              <div style={{backgroundColor: 'rgba(40, 40, 52)', width: '15vw', height: '25vh', top: '1%', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', gap: '20%', paddingTop: '2.5%', paddingBottom: '1%', borderRadius: '16px', cursor: 'pointer'}}>
                 <img style = {{aspectRatio: '1 / 1', height: '50%'}}/>
                <span style={{color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 900, justifyContent: 'center', textAlign: 'center', paddingLeft: '5%', paddingRight: '5%'}}>Eksportuj wyniki do pliku</span>
              </div>
            </div>
          </div>


          <div style={{backgroundColor: 'rgb(26, 26, 42)', width: '100%', position: 'relative', borderRadius: '16px', display: 'flex', flexDirection: 'column', paddingBottom: '1%', gap: '1vh'}}>
            <div style = {{width: '100%', height: '7.5vh', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '21px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '2.5%'}}>Kreator podsumowania</div>
            <div style = {{width: '100%', height: '5%', position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '2.5%'}}><span>Prosimy o zaznaczenie elementow, ktorych podsumowanie zostanie wygenerowane.</span></div>


{elements.map((checkbox) => (

            <div key={'checkbox' + checkbox.id}  style={{backgroundColor: 'rgb(26, 26, 42)', width: '100%', height: '5vh', position: 'relative', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingLeft: '5%'}}>
              <input type="checkbox" id = "checkbox0" style = {{cursor: 'pointer'}}/>
              <span style={{color: 'rgb(227, 224, 247)', fontSize: '14px', display: 'flex', fontWeight: 500, paddingLeft: '1%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{checkbox.name}</span>
            </div>
))}
            <div style = {{backgroundColor: 'rgba(66, 243, 125)', width: '25%', height: '7.5vh', position: 'relative', left: '37.5%', borderRadius: '8px', color: 'rgb(0, 57, 21)', fontSize: '14px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer'}}>Wygeneruj podsumowanie</div>
          </div>




      </div>





    </div>
  )
}




