// document.addEventListener('DOMContentLoaded', (e) => {

  const main = document.querySelector('main');
  const body = document.querySelector('body');

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

  function fadeInCards() {
    const cards = main.querySelectorAll('.card');
    let time = 50;
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = '';
      }, (time * index));
    });

  }

  function init() {
    fetchData('https://randomuser.me/api/?results=12&nat=us')
      .then(data => {
        const users = data.results;
        users.forEach(user => {
          let div = `
            <div class="card" style="opacity: 0;">
              <img class="profile" src="${user.picture.large}" alt=""/>
              <div>
                <div class="contact primary">
                  <h2 class="name">${user.name.first} ${user.name.last}</h2>
                  <p class="email">${user.email}</p>
                  <p class="city">${user.location.city}</p>
                </div>
                <div class="contact secondary">
                  <p class="phone">${user.cell}</p>
                  <p class="address">${formatAddress(user)}</p>
                  <p class="birthday">${formatBirthday(user.dob.date)}</p>
                </div>
              </div>
            </div>
          `;
          main.innerHTML += div;
        });
      })
      .then(e => {
        fadeInCards();
      });
  }

/*

<div class="modal">
  <div class="modal-content">
    <span class="close">×</span>
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
    const closeBtn = createElement('span', 'className', 'close');
    closeBtn.textContent = '×';
    modalContent.innerHTML = content;
    modalContent.insertBefore(closeBtn, modalContent.children[0]);
    modal.appendChild(modalContent);

    closeBtn.addEventListener('click', (e) => {
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
