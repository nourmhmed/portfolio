/* ===================================================================
 * Luther 1.0.0 - Main JS
 *
 * ------------------------------------------------------------------- */

const GITHUB_USERNAME = "nourmhmed"; // Replace with your GitHub username
const GITHUB_REPO = "portfolio"; // Replace with your repository name
const FILE_PATH = "visitors.csv"; // Path inside the repo
const TOKEN = "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"; // ⚠️ DO NOT expose this in production!

async function logVisitor() {
    const userAgent = navigator.userAgent;
    const deviceType = /Mobi|Android|iPhone|iPad/i.test(userAgent) ? "Mobile" : "PC";

    let ip = "Unknown";
    try {
        const res = await fetch("https://api64.ipify.org?format=json");
        const data = await res.json();
        ip = data.ip;
    } catch (error) {
        console.error("Failed to fetch IP:", error);
    }

    const timestamp = new Date().toISOString();
    const newEntry = `${ip}, ${deviceType}, ${timestamp}\n`;

    const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${FILE_PATH}`;
    
    const headers = {
        "Authorization": `token ${TOKEN}`,
        "Accept": "application/vnd.github.v3+json",
    };

    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            if (response.status === 404) {
                // File does not exist, create a new one
                await createNewCSV(newEntry);
                return;
            } else {
                console.error("Error fetching file:", await response.json());
                return;
            }
        }

        const fileData = await response.json();
        const sha = fileData.sha;

        // Decode existing CSV content
        const existingContent = atob(fileData.content.replace(/\n/g, ""));
        const updatedContent = existingContent + newEntry;

        // Encode and commit new content
        const commitData = {
            message: "Append visitor log",
            content: btoa(updatedContent),
            sha: sha,
        };

        const updateResponse = await fetch(url, {
            method: "PUT",
            headers,
            body: JSON.stringify(commitData),
        });

        if (updateResponse.ok) {
            console.log("Visitor logged successfully:", { ip, deviceType, timestamp });
        } else {
            console.error("Failed to update file:", await updateResponse.json());
        }

    } catch (error) {
        console.error("Error accessing GitHub API:", error);
    }
}

// Function to create a new CSV file if it doesn't exist
async function createNewCSV(firstEntry) {
    const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${FILE_PATH}`;
    
    const headers = {
        "Authorization": `token ${TOKEN}`,
        "Accept": "application/vnd.github.v3+json",
    };

    const content = "IP, Device Type, Timestamp\n" + firstEntry;
    
    const commitData = {
        message: "Create visitor log file",
        content: btoa(content),
    };

    try {
        const createResponse = await fetch(url, {
            method: "PUT",
            headers,
            body: JSON.stringify(commitData),
        });

        if (createResponse.ok) {
            console.log("Created new CSV file and logged visitor:", firstEntry);
        } else {
            console.error("Failed to create file:", await createResponse.json());
        }
    } catch (error) {
        console.error("Error creating new file:", error);
    }
}

// Run on page load
window.onload = logVisitor;

(function(html) {

    "use strict";

    html.className = html.className.replace(/\bno-js\b/g, '') + ' js ';

    /* Visitor Tracking
    * -------------------------------------------------- */
    const ssVisitorTracking = function() {
        if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
            console.log("Visitor tracking disabled in development");
            return;
        }

        const visitorData = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            screenWidth: screen.width,
            screenHeight: screen.height,
            language: navigator.language,
            referrer: document.referrer || 'direct',
            pageUrl: window.location.href,
            pageTitle: document.title
        };

        fetch('/track-visitor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(visitorData)
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .catch(error => console.error('Visitor tracking error:', error));
    };

    /* Animations
    * -------------------------------------------------- */
    const tl = anime.timeline({
        easing: 'easeInOutCubic',
        duration: 800,
        autoplay: false
    })
    .add({
        targets: '#loader',
        opacity: 0,
        duration: 1000,
        begin: function(anim) {
            window.scrollTo(0, 0);
        }
    })
    .add({
        targets: '#preloader',
        opacity: 0,
        complete: function(anim) {
            document.querySelector("#preloader").style.visibility = "hidden";
            document.querySelector("#preloader").style.display = "none";
        }
    })
    .add({
        targets: '.s-header',
        translateY: [-100, 0],
        opacity: [0, 1]
    }, '-=200')
    .add({
        targets: ['.s-intro .text-pretitle', '.s-intro .text-huge-title'],
        translateX: [100, 0],
        opacity: [0, 1],
        delay: anime.stagger(400)
    })
    .add({
        targets: '.circles span',
        keyframes: [
            {opacity: [0, .3]},
            {opacity: [.3, .1], delay: anime.stagger(100, {direction: 'reverse'})}
        ],
        delay: anime.stagger(100, {direction: 'reverse'})
    })
    .add({
        targets: '.intro-social li',
        translateX: [-50, 0],
        opacity: [0, 1],
        delay: anime.stagger(100, {direction: 'reverse'})
    })
    .add({
        targets: '.intro-scrolldown',
        translateY: [100, 0],
        opacity: [0, 1]
    }, '-=800');

    /* Preloader
    * -------------------------------------------------- */
    const ssPreloader = function() {
        const preloader = document.querySelector('#preloader');
        if (!preloader) return;
        
        window.addEventListener('load', function() {
            document.querySelector('html').classList.remove('ss-preload');
            document.querySelector('html').classList.add('ss-loaded');

            document.querySelectorAll('.ss-animated').forEach(function(item){
                item.classList.remove('ss-animated');
            });

            tl.play();
            ssVisitorTracking();
        });
    };

    /* Mobile Menu
    * ---------------------------------------------------- */ 
    const ssMobileMenu = function() {
        const toggleButton = document.querySelector('.mobile-menu-toggle');
        const mainNavWrap = document.querySelector('.main-nav-wrap');
        const siteBody = document.querySelector("body");

        if (!(toggleButton && mainNavWrap)) return;

        toggleButton.addEventListener('click', function(event) {
            event.preventDefault();
            toggleButton.classList.toggle('is-clicked');
            siteBody.classList.toggle('menu-is-open');
        });

        mainNavWrap.querySelectorAll('.main-nav a').forEach(function(link) {
            link.addEventListener("click", function(event) {
                if (window.matchMedia('(max-width: 800px)').matches) {
                    toggleButton.classList.toggle('is-clicked');
                    siteBody.classList.toggle('menu-is-open');
                }
            });
        });

        window.addEventListener('resize', function() {
            if (window.matchMedia('(min-width: 801px)').matches) {
                if (siteBody.classList.contains('menu-is-open')) siteBody.classList.remove('menu-is-open');
                if (toggleButton.classList.contains("is-clicked")) toggleButton.classList.remove("is-clicked");
            }
        });
    };

    /* ScrollSpy
    * ------------------------------------------------------ */
    const ssScrollSpy = function() {
        const sections = document.querySelectorAll(".target-section");

        window.addEventListener("scroll", navHighlight);

        function navHighlight() {
            let scrollY = window.pageYOffset;
        
            sections.forEach(function(current) {
                const sectionHeight = current.offsetHeight;
                const sectionTop = current.offsetTop - 50;
                const sectionId = current.getAttribute("id");
            
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    document.querySelector(".main-nav a[href*=" + sectionId + "]").parentNode.classList.add("current");
                } else {
                    document.querySelector(".main-nav a[href*=" + sectionId + "]").parentNode.classList.remove("current");
                }
            });
        }
    };

    /* View Animate
    * ------------------------------------------------------ */
    const ssViewAnimate = function() {
        const blocks = document.querySelectorAll("[data-animate-block]");

        window.addEventListener("scroll", viewportAnimation);

        function viewportAnimation() {
            let scrollY = window.pageYOffset;

            blocks.forEach(function(current) {
                const viewportHeight = window.innerHeight;
                const triggerTop = (current.offsetTop + (viewportHeight * .2)) - viewportHeight;
                const blockHeight = current.offsetHeight;
                const blockSpace = triggerTop + blockHeight;
                const inView = scrollY > triggerTop && scrollY <= blockSpace;
                const isAnimated = current.classList.contains("ss-animated");

                if (inView && (!isAnimated)) {
                    anime({
                        targets: current.querySelectorAll("[data-animate-el]"),
                        opacity: [0, 1],
                        translateY: [100, 0],
                        delay: anime.stagger(400, {start: 200}),
                        duration: 800,
                        easing: 'easeInOutCubic',
                        begin: function(anim) {
                            current.classList.add("ss-animated");
                        }
                    });
                }
            });
        }
    };

    /* Swiper
    * ------------------------------------------------------ */ 
    const ssSwiper = function() {
        const mySwiper = new Swiper('.swiper-container', {
            slidesPerView: 1,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                401: {
                    slidesPerView: 1,
                    spaceBetween: 20
                },
                801: {
                    slidesPerView: 2,
                    spaceBetween: 32
                },
                1201: {
                    slidesPerView: 2,
                    spaceBetween: 80
                }
            }
         });
    };

    /* Lightbox
    * ------------------------------------------------------ */
    const ssLightbox = function() {
        const folioLinks = document.querySelectorAll('.folio-list__item-link');
        const modals = [];

        folioLinks.forEach(function(link) {
            let modalbox = link.getAttribute('href');
            let instance = basicLightbox.create(
                document.querySelector(modalbox),
                {
                    onShow: function(instance) {
                        document.addEventListener("keydown", function(event) {
                            event = event || window.event;
                            if (event.keyCode === 27) {
                                instance.close();
                            }
                        });
                    }
                }
            )
            modals.push(instance);
        });

        folioLinks.forEach(function(link, index) {
            link.addEventListener("click", function(event) {
                event.preventDefault();
                modals[index].show();
            });
        });
    };

    /* Alert boxes
    * ------------------------------------------------------ */
    const ssAlertBoxes = function() {
        const boxes = document.querySelectorAll('.alert-box');
  
        boxes.forEach(function(box){
            box.addEventListener('click', function(event) {
                if (event.target.matches(".alert-box__close")) {
                    event.stopPropagation();
                    event.target.parentElement.classList.add("hideit");

                    setTimeout(function(){
                        box.style.display = "none";
                    }, 500)
                }    
            });
        })
    };

    /* Smoothscroll
    * ------------------------------------------------------ */
    const ssMoveTo = function(){
        const easeFunctions = {
            easeInQuad: function (t, b, c, d) {
                t /= d;
                return c * t * t + b;
            },
            easeOutQuad: function (t, b, c, d) {
                t /= d;
                return -c * t* (t - 2) + b;
            },
            easeInOutQuad: function (t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t + b;
                t--;
                return -c/2 * (t*(t-2) - 1) + b;
            },
            easeInOutCubic: function (t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t*t + b;
                t -= 2;
                return c/2*(t*t*t + 2) + b;
            }
        }

        const triggers = document.querySelectorAll('.smoothscroll');
        
        const moveTo = new MoveTo({
            tolerance: 0,
            duration: 1200,
            easing: 'easeInOutCubic',
            container: window
        }, easeFunctions);

        triggers.forEach(function(trigger) {
            moveTo.registerTrigger(trigger);
        });
    };

    /* Initialize
    * ------------------------------------------------------ */
    (function ssInit() {
        ssPreloader();
        ssMobileMenu();
        ssScrollSpy();
        ssViewAnimate();
        ssSwiper();
        ssLightbox();
        ssAlertBoxes();
        ssMoveTo();
    })();

})(document.documentElement);
