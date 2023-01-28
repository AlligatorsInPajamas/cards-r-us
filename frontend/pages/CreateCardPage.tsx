import React, { useEffect, useRef, useState } from 'react';
import Axios from 'axios';

import Button from '@mui/joy/Button';
import ChevronRight from '@mui/icons-material/ChevronRight';
import ChevronLeft from '@mui/icons-material/ChevronLeft';

import { redirect } from 'react-router-dom';
import Placeholder from '../images/testImg/img0.jpg';
import loading from '../images/loading.gif';

//import bg svg
import BG from '../images/bg.svg';
import useLoginState from '../hooks/useLoginHooke';

// Declare Interfaces Here
// Will need one for imgList
interface Image {
  url: string;
}

interface MsgData {
  color: string;
  message: string | undefined;
}

interface StepDisplayProps {
  allImagesState: [allImages: Image[], setAllImages: (arg0: any) => void];
  imageState: [
    selectedImage: Image | undefined,
    setSelectedImage: (arg0: Image) => void
  ];
  promptState: [
    selectedMessage: MsgData | undefined,
    setSelectedMessage: (arg0: MsgData) => void
  ];
  currentStep: number;
  canContinue: boolean;
  nextFunction: (e: React.SyntheticEvent) => void;
  steps: number;
}

// Step 1
const CreateImg = ({
  allImagesState,
  imageState,
  canContinue,
  currentStep,
  nextFunction,
  steps,
}: StepDisplayProps) => {
  const [selectedImage, setSelectedImage] = imageState;
  const [userPrompt, setUserPrompt] = useState('');
  // allImages is the state variable. In this case, setImgList will just be the second element of the allImagesState array through array destructuring
  const [imgList, setImgList] = allImagesState;

  const [searching, setSearching] = useState(false);
  //--DALL-E API fetch request--

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const
  // }

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setSearching(true);
    const prompt = { userPrompt };
    fetch('/api/generate/image/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(prompt),
    })
      .then((res) => res.json())
      .then((data: any) => {
        setImgList(data.data);
        setSearching(false);
      });
  };

  const ImgResult = imgList.map((el: Image, i: number) => (
    <div
      className='images
    noSelect'
      key={i}>
      <img
        className='noDrag image'
        onClick={(e: React.SyntheticEvent) => {
          let target = e.target as HTMLInputElement;
          setSelectedImage({ url: target.src });
        }}
        src={el.url}
      />
    </div>
  ));

  return (
    <div className='CreateImg'>
      <div className='search-part'>
        <form className='askAi-img' onSubmit={handleSubmit}>
          {/* is the type of this input box 'search'?? */}
          <input
            type='search'
            id='ai-img-bar'
            value={userPrompt}
            placeholder=' generate an image for your card... '
            onChange={(e) => setUserPrompt(e.target.value)}
          />
          <button>
            <i className='fa-solid fa-magnifying-glass'></i>
          </button>
        </form>
      </div>
      <div className='imgDisplay'>
        <div className='img-result'>
          {searching ? (
            <div className='loading'>
              <img src={loading} />
              <h1>loading</h1>
            </div>
          ) : (
            ImgResult
          )}
        </div>
      </div>
      <div className='Next'>
        {/* The button to continue */}
        <Button
          variant='soft'
          endDecorator={<ChevronRight />}
          disabled={!canContinue}
          onClick={nextFunction}>
          {currentStep >= steps - 1 ? 'Create' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

// Step 2  create prompt and confirm card
const CreatePrompt = ({
  allImagesState,
  promptState,
  imageState,
  canContinue,
  currentStep,
  nextFunction,
  steps,
}: StepDisplayProps) => {
  const [imgList, setImgList] = allImagesState;
  const [selectedImage, setSelectedImage] = imageState;
  const [selectedMessage, setSelectedMessage] = promptState;
  const [textColor, setTextColor] = useState('#eef0f2');

  const image = imageState[0];

  const ImgResult = imgList.map((el: Image, i: number) => (
    <div className='image' key={i}>
      <img
        className='noDrag'
        onClick={(e: React.SyntheticEvent) => {
          let target = e.target as HTMLInputElement;
          setSelectedImage({ url: target.src });
        }}
        src={el.url}
      />
    </div>
  ));

  return (
    <div className='CreatePrompt'>
      <div className='funStuff'>
        <div className='MessageInput'>
          <input
            type='text'
            placeholder='Say something nice...'
            id='message'
            onChange={(e) =>
              setSelectedMessage({ message: e.target.value, color: 'white' })
            }
            value={selectedMessage?.message ?? ''}
          />
          <input
            type='color'
            name=''
            id='color'
            onChange={(e) => {
              // setselectedMessage?.color(e.target.value);
              setSelectedMessage({
                message: selectedMessage?.message,
                color: e.target.value,
              });
              console.log(selectedMessage?.color);
            }}
          />
        </div>
        <div
          className='Preview'
          style={{
            backgroundImage: `url(${image?.url ?? Placeholder})`,
            borderRadius: '1em',
          }}>
          <h2
            style={{
              color: `${selectedMessage?.color}`,
            }}>
            {selectedMessage?.message || 'Say something nice...'}
          </h2>
        </div>
        <div className='Next'>
          <Button
            variant='soft'
            endDecorator={<ChevronRight />}
            disabled={!canContinue}
            onClick={nextFunction}>
            {currentStep >= steps - 1 ? 'Create' : 'Next'}
          </Button>
        </div>
      </div>
      <div className='img-result'>{ImgResult}</div>
    </div>
  );
};

// The main page component that will handle state for prompt and image generation and it will control whether the user can continue to the next step
const CreateCard = () => {
  const steps = [CreateImg, CreatePrompt];

  const [createCardState, setCreateCardState] = useState({
    stepDisplayed: steps[0],
    currentStep: 0,
    canContinue: false,
  });

  const [selectedImage, setSelectedImage] = useState<Image | undefined>(
    undefined
  );
  const [selectedMessage, setSelectedMessage] = useState<MsgData | undefined>(
    undefined
  );
  const [allImages, setAllImages] = useState<Image[]>([]);
  const [error, setError] = useState(false);
  const { isLoggedIn } = useLoginState();

  if (error) return new Error('Something went wrong.');
  console.log(selectedMessage);

  const handleNext = () => {
    if (createCardState.currentStep >= steps.length - 1) {
      // TODO: POST to backend with the data
      fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: selectedImage?.url,
          message: selectedMessage?.message ?? 'placeholder',
          messageColor: selectedMessage?.color ?? 'placeholder',
        }),
      })
        .then((d) => {
          if (d.status === 401) window.location.href = '/login';
          if (d.status !== 200) {
            setError(true);
          }
          window.location.href = '/cards';
        })
        .catch((e) => {
          setError(true);
        });

      // post to backend then reedirect to the cards gallery
      // setTimeout(() => (window.location.href = '/cards'), 600);
    }

    // Set card state by moving through steps (with conditionals)
    setCreateCardState({
      ...createCardState,
      stepDisplayed:
        createCardState.currentStep < steps.length - 1
          ? steps[++createCardState.currentStep]
          : steps[createCardState.currentStep],
      currentStep:
        createCardState.currentStep < steps.length - 1
          ? ++createCardState.currentStep
          : createCardState.currentStep,
    });
  };

  if ((selectedImage || selectedMessage) && !createCardState.canContinue)
    setCreateCardState({ ...createCardState, canContinue: true });

  return (
    <div className='CreateCard'>
      <BG className='background' />
      {/* Displays the current step */}

      <div className='StepDisplay'>
        <createCardState.stepDisplayed
          allImagesState={[allImages, setAllImages]}
          imageState={[selectedImage, setSelectedImage]}
          promptState={[selectedMessage, setSelectedMessage]}
          currentStep={createCardState.currentStep}
          canContinue={createCardState.canContinue}
          nextFunction={handleNext}
          steps={steps.length}
        />
      </div>
    </div>
  );
};

export default CreateCard;
