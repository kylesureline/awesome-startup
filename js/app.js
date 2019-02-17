// document.addEventListener('DOMContentLoaded', (e) => {

  const main = document.querySelector('main');
  const body = document.querySelector('body');
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
        card.style.opacity = '';
      }, (time * index));
    });
  }

  function placeCards() {
    people.forEach((person, index) => {
      let div = `
        <div id="card-${index}" class="card" style="opacity: 0;">
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

    fetchData('https://randomuser.me/api/?results=12&nat=us')
      .then(data => {
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

/*

<div class="modal">
  <div class="modal-content">
    <span class="close"><img src="icons/close.svg" alt></span>
    <span class="arrow left"><img src="icons/arrow_left.svg" alt></span>
    <span class="arrow right"><img src="icons/arrow_right.svg" alt></span>
    <img class="profile" src="https://randomuser.me/api/portraits/men/73.jpg" alt="">
    <div>
      <div class="contact primary">
        <h2 class="name">lee andrews</h2>
        <p class="email">lee.andrews@example.com</p>
        <p class="city">surprise</p>
      </div>
      <div class="contact secondary">
        <p class="phone">(171)-721-9019</p>
        <p class="address">5410 valwood pkwy surprise, kansas 39340</p>
        <p class="birthday">08/17/70</p>
      </div>
    </div>
  </div>
</div>

*/

  function displayModal(content) {

    function createElement(tagName, property, value) {
      const element = document.createElement(tagName);
      element[property] = value;
      return element;
    }

    const modal = createElement('div', 'className', 'modal');
    const modalContent = createElement('div', 'className', 'modal-content');

    const btns = `
      <span class="close"><img src="icons/close.svg" alt></span>
      <span class="arrow left"><img src="icons/arrow_left.svg" alt></span>
      <span class="arrow right"><img src="icons/arrow_right.svg" alt></span>
    `;

    modalContent.innerHTML = btns + content;
    // modalContent.insertBefore(closeBtn, modalContent.children[0]);
    modal.appendChild(modalContent);

    modalContent.querySelector('.close').addEventListener('click', (e) => {
      body.removeChild(modal);
    });

		body.insertBefore(modal, body.children[0]);
  }

  main.addEventListener('click', (e) => {
    function getContent(target) {

      function getCardDiv(target) {
        if(target.className === 'card') {
          return target;
        } else {
          return getCardDiv(target.parentNode);
        }
      }

      return getCardDiv(target).innerHTML;
    }
    if(e.target.tagName !== 'MAIN') {
      displayModal(getContent(e.target));
    }
  });

  init();

// });
