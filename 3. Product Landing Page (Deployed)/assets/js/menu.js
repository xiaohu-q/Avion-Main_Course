const Body = document.querySelector('body');
const Body_Content = document.querySelector('#main_content');
const Menu = document.querySelector('#menu');
const Menu_Button = document.querySelector('#menu_button');
const Munu_Button_Close = document.querySelector('#close_sidebar_btn');

Body.insertAdjacentElement('beforeend', Menu);

// click listener for the hamburger
Menu_Button.addEventListener('click', function (event) {
    event.stopPropagation();
    Body.classList.add('is-menu-visible');
    Body_Content.classList.add('shifted_to_left');
})

// click listener for the close sidebar button
Munu_Button_Close.addEventListener('click', function (event) {
    event.stopPropagation();
    Body.classList.remove('is-menu-visible');
    Body_Content.classList.remove('shifted_to_left');
})

// click listener for the body to close only if the side bar is open
Body.addEventListener('click', function (event) {
    event.stopPropagation();
    if (this.className == 'is-menu-visible') {
        this.classList.remove('is-menu-visible')
        Body_Content.classList.remove('shifted_to_left');
    }
})