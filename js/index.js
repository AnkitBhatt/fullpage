function indexLoad(){
  var $header_top = $('.header-top');
  var $nav = $('nav');

  $header_top.find('a').on('click', function() {
    $(this).parent().toggleClass('open-menu');
  });

  $('#fullpage section').each((index, element) => {
    if (index === 0) {
      $(element).css("background-position-y", "top");
      $(element).attr('data-position-y', "top");
    } else {
      var height = '-' + Number(window.innerHeight) * index + 'px';
      $(element).css('background-position-y', height);
      $(element).attr('data-position-y', height);
    }
  });

  $('#fullpage').fullpage({
    sectionsColor: ['transparent', 'transparent', 'transparent', 'transparent', 'transparent'],
    sectionSelector: '.vertical-scrolling',
    navigation: true,
    slidesNavigation: true,
    controlArrows: false,
    anchors: ['firstSection', 'secondSection', 'thirdSection', 'fourthSection', 'fifthSection'],
    menu: '#menu',
    scrollingSpeed: 2000,

    afterLoad: function (anchorLink, index) {
      $header_top.css('background', 'rgba(0, 0, 0, 75)');
      $nav.css('background', 'rgba(0, 0, 0, 75)');
      if (index == 5) {
        $('#fp-nav').hide();
      }
    },

    onLeave: function (index, nextIndex, direction) {
      if (index == 5) {
        $('#fp-nav').show();
      }
    }
  });

  $('#fp-nav ul li:gt(4)').remove();
}

function pageTransitionForIn(elementId){
  var tl = gsap.timeline();

  var sectionId = '#' + elementId;
  tl.to(sectionId, {duration: .5, scale: 1.3});
  tl.to(sectionId, {duration: 1, x:-500, stagger: .6, opacity: 0});
  
}

function pageTransitionForOut(){
  var tl = gsap.timeline();

  tl.to('.section-inner-background', {duration: 1, scale: 0.9});
  tl.to('.section-inner-background', {duration: 1, x:-500, stagger: .6, opacity: 0});
  tl.to('.section-inner-background h1', {duration: 1, x:-500, stagger: .6, opacity: 0});
  tl.to('.section-inner-background h2', {duration: 1, x:-500, stagger: .6, opacity: 0});
}

function contentAnimationForIn(translate_Y){
  var tl = gsap.timeline();
  var twelvePointFive = (window.innerWidth/8);
  $('.section-inner-background').css('background-position-y',translate_Y);
  
  tl.from('.section-inner-background', {duration: 3, x:-50, stagger: .6, opacity: 0});
  tl.from('.section-inner-background h1',{duration: 0.5, y:-50, x:0, stagger: .6, opacity: 0});
  tl.to('.section-inner-background h1',{duration: 0.5, x: window.innerWidth < 600 ? '25vw' : 100, stagger: .6, opacity: 1});
  tl.to('.section-inner-background h2',{duration: 0.5, x: window.innerWidth < 600 ? '25vw' : 100, stagger: .6, opacity: 1});
}

function contentAnimationForOut(elementId){
  var tl = gsap.timeline();
  
  var sectionId = '#' + elementId;
  var elem = $(sectionId);
  if(elem) {
    $('html').scrollTop(elem.offset().top);
    $('html').scrollLeft(elem.offset().left);
  }
  tl.from('#fullpage', {duration: 3, x:-500, stagger: .6, opacity: 0});
  tl.from('.vertical-scrolling a.section-page-link', {duration: .5, stagger: .6, opacity: 0});
}

function delay(n){
  n = n || 2000;
  return new Promise(done => {
    setTimeout(() => {
      done();
    }, n);
  });
}

$(document).ready(function(){
  
  $('.section-page-link').click(function () {
    var i = $(this).closest('section').attr('id');
    var translate_Y = $(this).closest('section').attr('data-position-y');
    
    barba.init({
      transitions:[{
        sync: true,
        to:{
          namespace:[
            'first',
            'second',
            'third',
            'fourth',
            'fifth'
          ]
        },
        async leave(data){
          const done = this.async();
          pageTransitionForIn(i);
          await delay(1500);
          done();
        },
        async enter(data){
          contentAnimationForIn(translate_Y);
        },
        async once(data){
          contentAnimationForIn();
        }
      },
      {
        sync: true,
        to:{
          namespace:[
            'home'
          ]
        },
        async leave(data){
          const done = this.async();
          pageTransitionForOut();
          await delay(1500);
          done();
        },
        async enter(data){
          indexLoad();
          contentAnimationForOut(i);  
        },
        async once(data){
          contentAnimationForOut();
        }
      }]
    });
  });
});

function subPages(){
  e.preventDefault();
  var thisHref = $(this).attr('href');
  $('#fullpage').find("a[href='"+thisHref+"']").trigger("click");
}