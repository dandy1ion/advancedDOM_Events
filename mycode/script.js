'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault(); //prevent page from jumping page back to top
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

//same as for loop but much simpler code with forEach
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
//for (let i = 0; i < btnsOpenModal.length; i++)
//  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////////////////////////
//IMPLEMENTING SMOOTH SCROLLING (Learn more button)

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  section1.scrollIntoView({ behavior: 'smooth' });
});

//////////////////////////////////////////////////////////////
//Page navigation (Event Deligation)

//first, add the event listener to a common parent element
//second, determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  //console.log(e.target); //use info to find which element event occured at
  e.preventDefault();

  //Matching strategy
  if (e.target.classList.contains('nav__link')) {
    //console.log('LINK');
    const id = e.target.getAttribute('href'); //want the HTML written for href
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////////////////////////////////
//Tabbed component

//tabs.forEach(t => t.addEventListener('click', () => console.log('TAB')));
//EVENT DELIGATION
tabsContainer.addEventListener('click', function (e) {
  //matching strategy
  //need to get btn when click on span or btn
  const clicked = e.target.closest('.operations__tab'); //find btn itself
  //console.log(clicked);
  //ignore clicks where result of closest is null
  //GUARD CLAUSE
  if (!clicked) return; //rest of code not executed

  //Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  //Activate tab
  clicked.classList.add('operations__tab--active');

  //Activate content
  //console.log(clicked.dataset.tab);
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//////////////////////////////////////////////////////////////////
//PASSING ARGUMENTS TO EVENT HANDLERS
//MENU FADE ANIMATION (HOVERING OVER LINKS FOR FOCUS)

const handelHover = function (e) {
  //console.log(this, e.currentTarget);
  if (e.target.classList.contains('nav__link')) {
    const link = e.target; //create variable containing element we are working with
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    //change opacity of siblings
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this; //this is now our opacity
    });
    logo.style.opacity = this; //this is now our opacity
  }
};
//Original:
//nav.addEventListener('mouseover', function (e) {
//  if (e.target.classList.contains('nav__link')) {
//    const link = e.target; //create variable containing element we are working with
//    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
//    const logo = link.closest('.nav').querySelector('img');
//
//    //change opacity of siblings
//    siblings.forEach(el => {
//      if (el !== link) el.style.opacity = 0.5; //1 for mouseout
//    });
//    logo.style.opacity = 0.5; //1 for mouseout
//  }
//});
//anonymous callback function with function:
//nav.addEventListener('mouseover', function (e) {
//  handelHover(e, 0.5);
//});
//nav.addEventListener('mouseout', function (e) {
//  handelHover(e, 1);
//});
//Bind method:(creates copy of function called on)
//entire navigation as the container = nav
nav.addEventListener('mouseover', handelHover.bind(0.5));

//bring back original settings
nav.addEventListener('mouseout', handelHover.bind(1));

//////////////////////////////////////////////////////////////
//IMPLEMENTING A STICKY NAVIGATION: THE SCROLL EVENT
//scroll = not very efficient (especially on older mobile) and should be avoided
//const initialCoords = section1.getBoundingClientRect();
//console.log(initialCoords);
//window.addEventListener('scroll', function (e) {
//console.log(e);
//console.log(window.scrollY);
//calculate position dynamically to start sticky
//if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//else nav.classList.remove('sticky');
//});

//////////////////////////////////////////////////////////////////
//A BETTER WAY: THE INTERSECTION OBSERVER API
//this API allows our code to observe changes to the way that...
//a certain target element intersects another element,
//or the way it intersects the viewport

//callback function
//two arguments: enteries, observer object itself
//if threshold is an array then entries is an array of the threshold enteries
//const obsCallback = function (entries, observer) {
//  enteries.forEach(entry => {
//    //console.log(entry);//look at intersectionRatio & isintersecting
//  });
//};

//options
//const obsOptions = {
//  root: null, //the element that the target is intersecting
//  //null gives you the whole viewport
//  //threshold: 0.1, //percentage of intersectiong at which callback called
//  threshold: [0, 0.2], //can be an array
//};

//pass in callback function and an object of options
//can store in variables or write directly in
//const observer = new IntersectionObserver(obsCallback, obsOptions);
//observe method with target element passed in
//observer.observe(section1);

//////////////////////////
//observe header element
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
//console.log(navHeight);

const stickyNav = function (entries) {
  const [entry] = entries;
  //console.log(entry);//isIntersecting property
  //if it's not intersecting then add sticky class
  if (!entry.isIntersecting) nav.classList.add('sticky');
  //if it's intersecting then remove sticky class
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0, //when 0% of header visable
  //rootMargin: '-90px', //box of pixels applied outside target element
  //sticky nav will appear 90px before section1 disapears
  rootMargin: `-${navHeight}px`, //create dynamically for each screen
});
headerObserver.observe(header);

/////////////////////////////////////////////////////////
//REVEALING ELEMENTS ON SCROLL

//Reveal sections
//remove section--hidden class to reveal as you scroll
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  //get entry from entries with destructuring
  const [entry] = entries;
  //console.log(entry); //interested in target (id)
  //which section intersected the viewport
  //Gaurd Clause(if not intersecting exit code)
  if (!entry.isIntersecting) return;
  //if intersecting:
  entry.target.classList.remove('section--hidden');
  //stop observing
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null, //veiwport
  threshold: 0.15, //section revealed when 15% visable
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  //add class 'section--hidden' to hide the sections
  section.classList.add('section--hidden');
});

////////////////////////////////////////////////////////////
//LAZING LOADING IMAGES(great for performance)

//low-resolution very small img loaded first = src (standard attribute)
//high-resolution img loaded = data-src (special data attribute)
//remove class 'lazy-img' = blur filter hiding low-resolution photo

//select imgs with data-src property
const imgTargets = document.querySelectorAll('img[data-src]');
//console.log(imgTargets);

const loadImg = function (entries, observer) {
  const [entry] = entries;
  //console.log(entry);

  //Gaurd Clause
  if (!entry.isIntersecting) return;

  //Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  //use network tab in inspector to change speed:
  //to see how others might observe the load of your page/images

  //listen for load event(data-src img loaded)
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  //stop observing
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null, //viewport
  threshold: 0, //use 0.5 or greater here if you like seeing the effect
  //&don't use the rootMargin
  rootMargin: '200px', //load without user knowing
});

imgTargets.forEach(img => imgObserver.observe(img));

//////////////////////////////////////////////////////////////////
//BUILDING A SLIDER COMPONENT

//create function to not pollute the global name space:
const slider1 = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  //define number of slides so JS knows when to stop slider
  const maxSlide = slides.length; //node list length

  //easier to see full slider during production:
  //const slider = document.querySelector('.slider');
  //slider.style.transform = 'scale(0.4) translateX(-1200px)';
  //slider.style.overflow = 'visible';

  //FUNCTIONS:
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      ); //i=index (0,2,3.etc)
    });
  };
  //createDots();//put in init function

  const activateDot = function (slide) {
    //remove all active classes
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    //add active class to one slide that is active
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };
  //activateDot(0);//put in init function

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };
  //slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`));
  //1st slide 0%, 2nd slide 100%, 3rd slide 200%, 4th slide 300%
  //goToSlide(0);//put in init function

  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      //-1 makes it zero based like the node list is
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    //activate the dot for that slide
    activateDot(curSlide);
  };
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    //activate the dot for that slide
    activateDot(curSlide);
  };
  // Go to next slide (active slide at 0%)
  //btnRight.addEventListener('click', function () {
  //if (curSlide === maxSlide - 1) {
  //  //-1 makes it zero based like the node list is
  //  curSlide = 0;
  //} else {
  //  curSlide++;
  //}
  //goToSlide(curSlide);
  //});
  //curSlide = 1: -100%, 0%, 100%, 200%

  //Initialization function:
  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  //EVENT HANDLERS
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  //keyboard events
  document.addEventListener('keydown', function (e) {
    //console.log(e);//key:'ArrowLeft' & 'ArrowRight'
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide(); //short circuiting
    //either version works
  });

  //event handler for dots
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      //console.log('DOT');
      //const slide = e.target.dataset.slide;
      //use destructuring:
      const { slide } = e.target.dataset;
      goToSlide(slide);
      //activate the dot for that slide
      activateDot(slide);
    }
  });
};
slider1();

//////////////////////////////////////////////////////
///////////////////////////////////////
///////////////////////

/*
//////////////////////////////////////////////////////////////////
//SELECTING, CREATING, & DELETING ELEMENTS

console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

//make sure to use selector (. or #) with these
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
console.log(allSections);

document.getElementById('section--1');

//HTML collection (live updates with changes) --> does not happen with a node list
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);
console.log(document.getElementsByClassName('btn'));

//Creating and inserting elements
// .insertAdjacentHTML
//(used to create movements in Bankist app, quick and easy way to create elements)
const message = document.createElement('div');
//creates DOM element & stores it in 'message' variable
//variable = object that represents the DOM element
//(not in the DOM yet, able to manipulate it though)
//-->must manually insert it to the page
message.classList.add('cookie-message'); //add class to the div for message
//message.textContent = 'We use cookies for improved functionality and analytics';
//insert txt
message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn btn--close--cookie">Got it!</button>'; //add txt and html

//add this element to the DOM
//header.prepend(message);
//prepend adds the element as the first child of the element selected(header)
header.append(message);
//append adds the element as the last child of the element selected(header)
//can only be in one place at a time

//want to add an element in multiple places
//copy the first element
//header.append(message.cloneNode(true)); //true=all child elements copied as well

//header.before(message); //insert before header as a sibling
//header.after(message); //insert after header as a sibling

//Delete elements
//remove message when click on button
document
  .querySelector('.btn--close--cookie')
  .addEventListener('click', function () {
    message.remove();
    //use to:
    //message.parentElement.removeChild(message);
  });

//////////////////////////////////////////////////////////////////////
//STYLES, ATTRIBUTES, & CLASSES

//Styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%';
//can not use the style property to view in the console
console.log(message.style.color); //hidden inside a class = nothing
console.log(message.style.backgroundColor); //manually set in line = can read
//use getComputedStyle function to see hidden styles
//console.log(getComputedStyle(message));//contains all properties
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

//change height directly
//(use number and parsefloat to change the string to a number, set to base 10)
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

//CSS custome properties (CSS variables)
//document.documentElement.style.setProperty('--color-primary', 'orangered');

//Attributes
//(src, class, id, alt, href, etc)
const logo = document.querySelector('.nav__logo');
console.log(logo.className); //nav__logo

//change alt text
logo.alt = 'Beautiful minimalist logo';

//not a standard property for the element = undefined even if there
console.log(logo.designer);
//Non-standard way to retrieve value
console.log(logo.getAttribute('designer'));

//create & set an attribute
logo.setAttribute('company', 'Bankist');

//absolute version and then the relative version
console.log(logo.src);
console.log(logo.getAttribute('src'));
//same with href
const link = document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute.href); //undefined (can be #)

//Data Attribute
console.log(logo.dataset.versionNumber);
//use alot with UI (user interface)

//Classes
//can add multiple classes separated by comas
logo.classList.add('c', 'j');
logo.classList.remove('c', 'j');
logo.classList.toggle('c');
logo.classList.contains('c'); //like 'includes' in arrays
//don't use this
//(it will override all existing classes & only lets one class be put on an element)
//logo.className = 'jonas';


//IMPLEMENTING SMOOTH SCROLLING
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  //console.log(s1coords); //DOMRect(properties)
  //x = 0 = don't want horizontal scroll

  //console.log(e.target.getBoundingClientRect()); //for the button clicked
  //gives properties values realative to current viewport

  //console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  //console.log(
  //  'height/width of viewport',
  //  document.documentElement.clientHeight,
  //  document.documentElement.clientWidth
  //);

  //Scrolling (first argument = x/from left, 2nd argument = y/from top)
  //window.scrollTo(
  //  s1coords.left + window.pageXOffset,
  //  s1coords.top + window.pageYOffset
  //);
  //add window X/Y offset so no matter where scrolled to the click will scroll right
  //makes it relative to the whole page not just the viewport

  //to make scroll smooth, use an object with top, left, & behavior properties
  //window.scrollTo({
  //  left: s1coords.left + window.pageXOffset,
  //  top: s1coords.top + window.pageYOffset,
  //  behavior: 'smooth',
  //});

  //new way (for most modern browsers only)
  section1.scrollIntoView({ behavior: 'smooth' });
});
//need coordinates to scroll to the first section
*/

/*
//////////////////////////////////////////////////////////////////////
//TYPE OF EVENTS & EVENT HANDLERS
//event = signal generated by a certain DOM node
//signal = something has happened (click, mouse move, key stroke, etc.)

//new-school way:
//mouse enter event
const h1 = document.querySelector('h1');

const alertH1 = function (e) {
  alert('addEventListener: Great! You are reading the heading :D');

  //h1.removeEventListener('mouseenter', alertH1);
  //now event listening only happens once
};

//event listening for, function with an (event)
h1.addEventListener('mouseenter', alertH1);
//**allows us to add multiple event listeners to the same event

//can also remove an event listener if we don't need it anymore
//need function to be in a named function in order to do this
//can remove the event listener outside the function
//for example set a timer for when the event listener will end
setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 5000);

//old-school way:
//another way to attach an event listener to an element
//on-evnet property directly on the element
//set equal to function (e) {}
//h1.onmouseenter = function (e) {
//  alert('onmouseenter: Great! You are reading the heading :D');
//}; //can only do on event
*/

//DO NOT USE
//HTML attribute way of handeling events
//in HTML document
/*
<div class="header__title">
**    <h1 onclick="alert('HTML alert')">    **
        When
        <!-- Green highlight effect -->
        <span class="highlight">banking</span>
*/

/*
/////////////////////////////////////////////////////////////////
//EVENT PROPAGATION: BUBBLING AND CAPTURING
// create random color generator with # between 0-255 --> rbg(255,255,255)
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
//console.log(randomColor(0,255));
//attach event handler to 'Features' in the navigation & the parent elements as well
//listen for event in bubbling phase
document.querySelector('.nav__link').addEventListener('click', function (e) {
  //console.log('LINK');
  this.style.backgroundColor = randomColor(); //have to change href = # in HTML to work
  console.log('LINK', e.target, e.currentTarget);
  //event target = where the click (event) happened
  //current target = element on which the event handler is attached
  console.log(e.currentTarget === this);

  //Stop event propagation
  //not usually used (can help in bug fixes)
  //e.stopPropagation();//doesn't go anyfurther (event never gets to parents elements)
});
//listen for event in bubbling phase
document.querySelector('.nav__links').addEventListener('click', function (e) {
  //console.log('LINK');
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
});
document.querySelector('.nav').addEventListener(
  'click',
  function (e) {
    //console.log('LINK');
    this.style.backgroundColor = randomColor();
    console.log('NAV', e.target, e.currentTarget);
  }
  //true //listen for event in capturing phase
);


////////////////////////////////////////////////////////////////////////
//EVENT DELEGATION: IMPLEMENTING PAGE NAVIGATION
//smooth scroll for navigation links

//without event delegation
//queryselectorall returns a node list
//use for each method to attach event handler to each elements in node list
document.querySelectorAll('.nav__link').forEach(function (el) {
  el.addEventListener('click', function (e) {
    e.preventDefault(); //stop from using href scroll = jump to section
    //console.log('LINK');
    const id = this.getAttribute('href'); //want the HTML written for href
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
}); //with too many elements this will effect performance


///////////////////////////////////////////////////////////////////////
//DOM TRAVERSING

const h1 = document.querySelector('h1');

//Going downwards: child(ren)
console.log(h1.querySelectorAll('.highlight'));
//children of the h1 element (works no matter how deep those child elements are)
//only gets class highlight of children of h1 (not of other elements)
console.log(h1.childNodes);
//direct child nodes of h1 only
console.log(h1.children);
//HTML collection (live updated)
//direct children only
h1.firstElementChild.style.color = 'white'; //first child changes to white
h1.lastElementChild.style.color = 'orangered'; //last child changes to orangered

//Going upwards: parent(s)
console.log(h1.parentNode);
//direct parent nodes of h1 only
console.log(h1.parentElement);
//direct parent element

//find parent no matter how far away
h1.closest('.header').style.background = 'var(--gradient-secondary)';
//closest parent element that has this class and apply a style to it

h1.closest('h1').style.background = 'var(--gradient-primary)';
//returns the h1 element itself

//both querySelectors and closest accept a query string
//querySelectors look for children (down the DOM)
//closest looks for parents (up the DOM)

//Going sideways: siblings
//can only access direct siblings (previous or next)
console.log(h1.previousElementSibling); //null = none before
console.log(h1.nextElementSibling); //h4

//usually don't use
console.log(h1.previousSibling);
console.log(h1.nextSibling);

//if we really need all the siblings
//Trick: move up to the parent element and then read all the children from there
console.log(h1.parentElement.children);
//all siblings including self

//create array from the HTML collection
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(0.5)';
});
//for all siblings not the h1 style transform to 50% smaller
*/

//////////////////////////////////////////////////////////////////
//LIFECYCLE DOM EVENTS

//DOM content loaded:
//event fired by the document as soon as the HTML is completly parsed
//(HTML has been downloaded & converted to the DOM tree)
//also all scripts must be downloaded and executed before this
//does not wait for images or other external content to be loaded
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built!', e);
});
//script tag in HTML is at the very end of the body after all of HTML is parsed

//wrap all code in document ready function (JQuery):
//document.ready //not needed in regualr JavaScript

//Load event:
//fired by the window as soon as the HTML is parsed and
//all the images and external resources (like CSS files) are loaded
//complete page finished
window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});

//Before unload event (DO NOT ABUSE)
//created immediately before a user is about to leave a page (click x button)
//window.addEventListener('beforeunload', function (e) {
//  e.preventDefault(); //some browsers require we do this
//  console.log(e);
//  e.returnValue = ''; //need this to get pop up to confirm desire to leave site
//});//use to prevent unwanted data loss for user

////////////////////////////////////////////////////////////////
//EFFICIENT SCRIPT LOADING: DEFER AND ASYNC
