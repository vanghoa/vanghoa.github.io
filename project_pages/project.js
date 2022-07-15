document.addEventListener("DOMContentLoaded", function() {
    var lazyloadImages;    
  
    if ("IntersectionObserver" in window) {
      lazyloadImages = document.querySelectorAll(".lazy");
      var imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var image = entry.target;
            image.src = image.dataset.src;
            image.classList.remove("lazy");
            imageObserver.unobserve(image);
          }
        });
      });
  
      lazyloadImages.forEach(function(image) {
        imageObserver.observe(image);
      });

    } else {  
      var lazyloadThrottleTimeout;
      lazyloadImages = document.querySelectorAll(".lazy");
      
      function lazyload () {
        if(lazyloadThrottleTimeout) {
          clearTimeout(lazyloadThrottleTimeout);
        }    
  
        lazyloadThrottleTimeout = setTimeout(function() {
          var scrollTop = window.pageYOffset;
          lazyloadImages.forEach(function(img) {
              if(img.offsetTop < (window.innerHeight + scrollTop)) {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
              }
          });
          if(lazyloadImages.length == 0) { 
            document.removeEventListener("scroll", lazyload);
            window.removeEventListener("resize", lazyload);
            window.removeEventListener("orientationChange", lazyload);
          }
        }, 20);
      }
  
      document.addEventListener("scroll", lazyload);
      window.addEventListener("resize", lazyload);
      window.addEventListener("orientationChange", lazyload);
    }
})

// binding method
const $create = document.createElement.bind(document);

// page index
const index_pg = +window.location.pathname.split('/')[2] - 1;
const item_soon = {
                    "name" : "Coming",
                    "date" : "soon",
                    "field" : [
                        {
                            "name" : "Intentionally",
                            "class" : ""
                        },
                        {
                            "name" : "left",
                            "class" : ""
                        },
                        {
                            "name" : "blank",
                            "class" : ""
                        }
                    ],
                    "description" : "",
                    "soon" : true
                  };

// nav fetch //
fetch('../../item.json')
                .then(res => res.json())
                .then(data => {
                  if (index_pg > data.length - 1) {
                    field_date(item_soon);
                  } else {
                    item_field_gen(data);
                  }
                })
                .catch(err => console.error(err));

function item_field_gen(data) {
  let h1 = field_date(data[index_pg]);
//  
  let index_pg_ = {}; let item_= {};
  index_pg_.bf = ((index_pg - 1) < 0) ? data.length - 1 : (index_pg - 1);
  item_.bf = data[index_pg_.bf];
  index_pg_.af = ((index_pg + 1) > (data.length - 1)) ? 0 : (index_pg + 1);
  item_.af = data[index_pg_.af];

  let nav = $create('nav');
  h1.parentNode.insertBefore(nav, h1);

  if (window.top !== window.self) {
    let a_ct = $create('a');
    a_ct.textContent = 'Open this project in a separate window';
    a_ct.href = window.location.pathname;
    a_ct.target = '_blank';
    nav.append(a_ct);
    return;
  }

  document.head.innerHTML += `<!-- favicon --> 
                              <link rel="apple-touch-icon" sizes="180x180" href="../../favicon/apple-touch-icon.png">
                              <link rel="icon" type="image/png" sizes="32x32" href="../../favicon/favicon-32x32.png">
                              <link rel="icon" type="image/png" sizes="16x16" href="../../favicon/favicon-16x16.png">
                              <link rel="manifest" href="../../favicon/site.webmanifest">
                              <link rel="mask-icon" href="../../favicon/safari-pinned-tab.svg" color="#5bbad5">
                              <meta name="msapplication-TileColor" content="#da532c">
                              <meta name="theme-color" content="#ffffff">
                              <meta name="format-detection" content="telephone=no">
                              <!-- --> `;

  nav.append(prev_next_prj('bf'), prev_next_prj('af'));

  function prev_next_prj(psfix) {
    let a = $create('a');
    a.textContent = psfix == 'bf' ? '<-- Previous project' : 'Next project -->';
    a.href = `/project_pages/${index_pg_[psfix] + 1}/project.html`;
    let span = $create('span');
    span.textContent = item_[psfix].name;
    a.append($create('br'), span);
    return a;
  }
}

function field_date(item) {
  let divtxt = $create('p'); divtxt.className = 'field_p';
                for (let index in item.field) {
                  let span = $create('span');
                  span.className = `field ${item.field[index].class}`;//-- json props
                  span.textContent = item.field[index].name;//-- json props
                  divtxt.append(span,' ');
                }
  
  let span = $create('span');
      span.textContent = item.date;

  let h1 = document.querySelector('h1');
      h1.append($create('br'), span);
      h1.parentNode.insertBefore(divtxt, h1.nextSibling);
  
  return h1;
}