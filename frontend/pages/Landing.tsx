import React from 'react';

import Sponsors from '../components/landing/Sponsors';
import Head from '../components/landing/Head';
import Body from '../components/landing/body';

import Background from '../images/bg.svg';

const Landing = () => (
  <div className='LandingPage'>
    <Background className='background' />
    <Head />
    <Body />
    <Sponsors />
  </div>
);

export default Landing;
