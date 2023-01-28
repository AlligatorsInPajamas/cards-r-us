import React from 'react';
import AIP from '../../images/PsudoLogos/AIP.png';
import GIS from '../../images/PsudoLogos/GIS.png';

const Sponsors = () => (
  <div className='sponsors noSelect'>
    {/* <a href='https://github.com/AlligatorsInPajamas'> */}
    <img src={AIP} alt='Alligators in Pajamas' draggable='false' />
    {/* </a>
    <a href='https://github.com/gorillainsuit'> */}
    <img src={GIS} alt='Gorilla in Suit' draggable='false' />
    {/* </a> */}
  </div>
);

export default Sponsors;
