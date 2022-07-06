import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import { api } from '../utils/api.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import React from 'react';

function App() {
  const [cards, setData] = React.useState([]);
  const [currentUser, setDataProfile] = React.useState({ name: '', about: '' });
  const [card, setCard] = React.useState(null);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(
    false
  );
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(
    false
  );
  React.useEffect(() => {
    Promise.all([api.getInitialCards(), api.getProfile()])
      .then(([initialCards, dataProfile]) => {
        setData(initialCards);
        setDataProfile(dataProfile);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleCardClick = (card) => {
    setCard(card);
  };

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };
  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };
  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };
  const closeAllPopups = () => {
    setIsAddPlacePopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setCard(null);
  };

  const handleCardLike = (card) => {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setData((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCardDelete = (card) => {
    api
      .deleteCard(card._id)
      .then(() => {
        setData(cards.filter((result) => result._id !== card._id));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUpdateUser = (profile) => {
    api
      .setProfile(profile)
      .then((result) => {
        setDataProfile(result);
        setIsEditProfilePopupOpen(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUpdateAvatar = (avatar) => {
    api
      .setAvatar(avatar)
      .then((result) => {
        setDataProfile(result);
        setIsEditAvatarPopupOpen(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAddPlaceSubmit = (newCard) => {
    api
      .sendNewCard(newCard)
      .then((result) => {
        setData([result, ...cards]);
        setIsAddPlacePopupOpen(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="App">
      <CurrentUserContext.Provider value={currentUser}>
        <div className="page">
          <Header />
          <Main
            cards={cards}
            handleCardClick={handleCardClick}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            handleCardLike={handleCardLike}
            handleCardDelete={handleCardDelete}
          />
          <Footer />
          <ImagePopup card={card} onClose={closeAllPopups} />
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
          />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
          />
        </div>
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
