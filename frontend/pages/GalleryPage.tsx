// React import
import React, { useEffect, useState } from 'react';

// Card import
import Card from '../components/CardDisplayComponent';

// mui component imports
import Avatar from '@mui/joy/Avatar';
import Button from '@mui/joy/Button';
import IconButton from '@mui/joy/IconButton';
import Divider from '@mui/joy/Divider';
import CircularProgress from '@mui/joy/CircularProgress';

// mui icon imports
import FilterList from '@mui/icons-material/FilterList';
import ChevronRight from '@mui/icons-material/ChevronRight';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import Menu from '@mui/icons-material/Menu';
import ExpandLess from '@mui/icons-material/ExpandLess';
import Logout from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';

// Hook imports
// import useIsMobile from '../hooks/isMobileHook';

// TODO: add preview image based on S3 url instead of img0
import Placeholder from '../images/testImg/img0.jpg';

import logo from '../images/logo.png';
import BG from '../images/BG2.svg';

const useLoginState = require('../hooks/useLoginHook');
import { useNavigate } from 'react-router';

// Define interface for card data (distinct from card display )
interface CardData {
  cardId: number;
  author: string;
  message: string;
  imageUrl: string;
}

export interface UserData {
  avatar: any;
  username: string;
  firstName: string;
}

let filterCardsByAuthor = false;
// This will be used to hold the un-filtered cards
let tmpCards: CardData[] = [];

const GalleryPage = () => {
  const [displaySideBar, setDisplaySideBar] = useState(true);
  // const [filterCardsByAuthor, setFilterCardsByAuthor] = useState(false);
  const [cards, setCards] = useState(tmpCards);

  // const isMobile = useIsMobile();
  const isMobile: boolean = false;
  const [error, setError] = useState(false);
  const [user, setUser] = useState<UserData | undefined>(undefined);
  // const { isLoggedIn, user } = useLoginState();

  // if (!isLoggedIn) window.location.href = '/login';
  if (error) return new Error('An error occured.');

  useEffect(() => {
    // TODO: Replace this with a fetch to backend
    // TODO: fix bug where "fetch" occurs on every filter
    if (!cards[0]) {
      fetch('/api/cards/', { method: 'GET' })
        .then((d) => {
          if (d.status !== 200) {
            setError(true);
          }
          console.log('hit no cards on gallery page');
          return d.json();
        })
        .then((d) => {
          // Create a copy of the cards.
          tmpCards = [{}, ...d];
          // Set the card state
          setCards(tmpCards);
        })
        .catch((e) => {
          setError(true);
          console.log('Error occured with cards');
          console.log('Error occured: ', e);
        });
    }

    if (!user) {
      fetch('/api/auth/user', { method: 'GET' })
        .then((d) => {
          if (d.status !== 200) {
            console.log(`Res status was not 200`);
            setError(true);
          }
          console.log('hit no user on gallery page');
          return d.json();
        })
        .then((d) => {
          // Set the card state
          setUser(d);
        })
        .catch((e) => {
          setError(true);
          console.log('hit no user on gallery page');
          console.log('Error occured: ', e);
        });
    }
  });

  // This will be used to delete cards
  const handleCardDelete = (e: any, id: number) => {
    e.preventDefault();
    console.log('delete ', id);

    const filtered = cards.filter((card: CardData) => card.cardId !== id);
    tmpCards = filtered;
    // TODO: have delete card in database as well
    fetch('/api/cards', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id }),
    }).catch((e) => {
      setError(true);
    });
    setCards(filtered);
  };

  // This will handle card filtering
  const doCardFilter = (e: any) => {
    e.preventDefault();
    filterCardsByAuthor = !filterCardsByAuthor;
    // if (!tmpCards) tmpCards = [...cards];
    if (filterCardsByAuthor) {
      setCards(cards.filter((card: CardData) => card.author));
    } else {
      setCards(tmpCards);
    }
  };

  // This will handle redirect for creating cards
  const navigate = useNavigate();

  const navCreateCard = (e: any) => {
    e.preventDefault();
    navigate('/create');
  };

  // TODO: Refactor the jank responsiveness
  return (
    <div className='GalleryPage'>
      <BG className='background' />
      <div className='logoContainer'>
        <img className='logo noDrag' src={logo} alt='CardsRUs' />
      </div>
      {/* Desktop Sidebar */}
      <div
        className='SideBar'
        style={{
          width: displaySideBar ? '' : '5em',
          display: isMobile ? 'none' : '',
        }}>
        {/* User/expand and minify sidebar */}
        <div className='User'>
          <Avatar
            style={{ display: displaySideBar ? '' : 'none' }}
            alt='Placeholder'
            src={user?.avatar ?? Placeholder}
          />
          <h2 style={{ display: displaySideBar ? '' : 'none' }}>
            {user?.username ?? 'Placeholder'}
          </h2>
          <IconButton
            variant='plain'
            onClick={() => setDisplaySideBar(!displaySideBar)}>
            {displaySideBar ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </div>

        {/* Expanded sidebar view */}
        <div className='SideBarContent'>
          <Divider orientation='horizontal' />
          <div className='MainControls'>
            <ul>
              <li>
                {displaySideBar ? (
                  <Button
                    onClick={doCardFilter}
                    startDecorator={<FilterList />}
                    variant='soft'>
                    {filterCardsByAuthor ? 'Show All' : 'Show Sent'}
                  </Button>
                ) : (
                  <IconButton onClick={doCardFilter}>
                    <FilterList />
                  </IconButton>
                )}
              </li>
              <li>
                {displaySideBar ? (
                  <Button
                    onClick={navCreateCard}
                    startDecorator={<AddIcon />}
                    variant='soft'>
                    Create New
                  </Button>
                ) : (
                  <IconButton onClick={navCreateCard}>
                    <AddIcon />
                  </IconButton>
                )}
              </li>
            </ul>
          </div>
          <div className='SecondaryControls'>
            {displaySideBar ? (
              <Button
                onClick={() => {
                  window.location.href = '/';
                }}
                variant='soft'>
                Logout
              </Button>
            ) : (
              <IconButton variant='soft'>
                <Logout
                  onClick={() => {
                    window.location.href = '/';
                  }}
                />
              </IconButton>
            )}
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div
        className='SideBarMobile'
        style={{
          display: isMobile ? '' : 'none',
          height: !displaySideBar ? '100vh' : '',
        }}>
        {/* User/expand and minify sidebar */}
        <div className='User'>
          <Avatar alt='Placeholder' src={user?.avatar ?? Placeholder} />
          <h2>{user?.username ?? 'HidInKyu'}</h2>
          <IconButton
            variant='plain'
            onClick={() => setDisplaySideBar(!displaySideBar)}>
            {!displaySideBar ? <ExpandLess /> : <Menu />}
          </IconButton>
        </div>

        {/* Expanded sidebar view */}
        <div
          className='SideBarContent'
          style={{ display: !displaySideBar ? '' : 'none' }}>
          <Divider orientation='horizontal' />
          <div className='MainControls'>
            <ul>
              <li>
                {!displaySideBar ? (
                  <Button
                    onClick={(e) => {
                      doCardFilter(e);
                      setTimeout(() => setDisplaySideBar(!displaySideBar), 200);
                    }}
                    startDecorator={<FilterList />}
                    variant='soft'>
                    {filterCardsByAuthor ? 'Show All' : 'Show Sent'}
                  </Button>
                ) : null}
              </li>
            </ul>
          </div>
          <div className='SecondaryControls'>
            {!displaySideBar ? (
              <Button onClick={() => {}} variant='soft'>
                Logout
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Gallary view */}
      <div className='Content'>
        <div className='Gallary'>
          {(cards ?? false) && cards.length ? (
            cards.map((card, i) => (
              <Card
                key={i}
                cardId={card.cardId}
                image={card.imageUrl}
                prompt={card.message}
                deleteFunction={handleCardDelete}
              />
            ))
          ) : cards === null ? (
            <CircularProgress color='primary' value={25} variant='soft' />
          ) : (
            <h1>No Cards.</h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
