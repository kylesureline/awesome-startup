document.addEventListener('DOMContentLoaded', (e) => {

  const main = document.querySelector('main');
  const body = document.querySelector('body');
  const search = document.querySelector('.search input');
  let people = [];

  // fetch helper functions
  function checkStatus(response) {
    if(response.ok) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(new Error(response.statusText));
    }
  }
  function fetchData(url) {
    return fetch(url)
              .then(checkStatus)
              .then(res => res.json())
              .catch(error => console.log('Looks like there was a problem', error));
  }

  function fadeInCards() {
    const cards = main.querySelectorAll('.card');
    let time = 50;
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.remove('fade-out');
      }, (time * index));
    });
  }

  function placeCards() {
    main.innerHTML = '';

    people.forEach((person, index) => {
      let div = `
        <div id="card-${index}" class="card fade-out">
          <img class="profile" src="${person.picture}" alt=""/>
          <div>
            <div class="contact primary">
              <h2 class="name">${person.name}</h2>
              <p class="email">${person.email}</p>
              <p class="city">${person.city}</p>
            </div>
            <div class="contact secondary">
              <p class="phone">${person.phone}</p>
              <p class="address">${person.address}</p>
              <p class="birthday">${person.birthday}</p>
            </div>
          </div>
        </div>
      `;
      main.innerHTML += div;
    });
  } // end placeCards

  function init() {

    function formatAddress(user) {
      return `${user.location.street} ${user.location.city}, ${user.location.state} ${user.location.postcode}`;
    }

    function formatBirthday(date) {

      function pad(d) {
        const stringD = String(d);
        if(stringD.length === 1) {
          return '0' + stringD;
        }
        return stringD;
      }

      function formatYear(fullYear) {
        return String(fullYear).slice(2);
      }

      const d = new Date(date);

      const month = pad(d.getMonth() + 1);
      const day = pad(d.getDate());
      const year = formatYear(d.getFullYear());

      return `${month}/${day}/${year}`;
    }

    main.innerHTML = '<div class="loading"><p>Loading...</p></div>';

    let loadingP = main.querySelector('.loading p');
    let dotInterval = setInterval(() => {
      if(loadingP.textContent.length > 12) {
        loadingP.textContent = 'Loading...';
      } else {
        loadingP.textContent += '.';
      }
    }, 400);

    fetchData('https://randomuser.me/api/?results=12&nat=us')
      .then(data => {
        clearInterval(dotInterval);
        const users = data.results;
        users.forEach(user => {
          let userObj = {
            picture: user.picture.large,
            name: `${user.name.first} ${user.name.last}`,
            email: user.email,
            city: user.location.city,
            phone: user.cell,
            address: formatAddress(user),
            birthday: formatBirthday(user.dob.date)
          };
          people.push(userObj);
        })
      })
      .then(e => placeCards())
      .then(e => fadeInCards());
  } // end init

  function displayModal(personIndex) {

    const person = people[personIndex];

    const modal = document.createElement('div');
    modal.className = 'modal';

    const modalContent = `
      <div class="modal-content">
        <span class="close"><img src="icons/close.svg" alt></span>
        <span class="arrow left"><img src="icons/arrow_left.svg" alt></span>
        <span class="arrow right"><img src="icons/arrow_right.svg" alt></span>
        <img class="profile" src="${person.picture}" alt="">
        <div>
          <div class="contact primary">
            <h2 class="name">${person.name}</h2>
            <p class="email">${person.email}</p>
            <p class="city">${person.city}</p>
          </div>
          <div class="contact secondary">
            <p class="phone">${person.phone}</p>
            <p class="address">${person.address}</p>
            <p class="birthday">${person.birthday}</p>
          </div>
        </div>
      </div>
    `;

    modal.innerHTML = modalContent;

    body.insertBefore(modal, body.children[0]);

    modal.querySelector('.close').addEventListener('click', (e) => {
      body.removeChild(modal);
    });

    modal.querySelector('.right').addEventListener('click', (e) => {
      body.removeChild(modal);
      if(personIndex < (people.length - 1)) {
        displayModal(personIndex + 1);
      } else {
        displayModal(0);
      }
    });

    modal.querySelector('.left').addEventListener('click', (e) => {
      body.removeChild(modal);
      if(personIndex > 0) {
        displayModal(personIndex - 1);
      } else {
        displayModal(people.length - 1);
      }
    });

  } // end displayModal

  main.addEventListener('click', (e) => {

    function getCardDiv(target) {
      if(target.className === 'card') {
        return target;
      } else {
        return getCardDiv(target.parentNode);
      }
    }

    if(e.target.tagName !== 'MAIN') {
      const cardId = getCardDiv(e.target).id;
      const personIndex = parseInt(cardId.split('-')[1]);
      displayModal(personIndex);
    }

  });

  search.addEventListener('keyup', (e) => {

    const searchStr = search.value.toLowerCase();
    const cards = main.children;

    function showAllCards() {
      for(let i = 0; i < cards.length; i += 1) {
        let card = cards[i];
        card.classList.remove('hidden');
      }
    }

    if(search.value === '') {
      console.log('showing all cards');
      showAllCards();
    } else {
      for(let i = 0; i < cards.length; i += 1) {
        let card = cards[i];
        let name = card.querySelector('.name').textContent;
        if(!name.includes(searchStr)) {
          card.classList.add('hidden');
        }
      }
    }

  });

  init();

});
