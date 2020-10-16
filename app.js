let controller;
let slideScene;
let pageScene;
let detailScene;
function slideAnimation() {
  controller = new ScrollMagic.Controller();
  //Selecting Some Things
  const slides = document.querySelectorAll(".slide");
  slides.forEach((slide, index, slides) => {
    let revealImg = slide.querySelector(".reveal-img");
    let revealText = slide.querySelector(".reveal-text");
    let Img = slide.querySelector(".hero-img img");
    let navBar = document.querySelector(".nav-bar");
    let gsapTL = gsap.timeline({
      defaults: { duration: 1, ease: "power2.inOut" },
    });
    let navTL = gsap.timeline({
      defaults: { duration: 0.7, ease: "power2.inOut" },
    });
    gsapTL.fromTo(revealImg, { x: "0%" }, { x: "100%" });
    gsapTL.fromTo(revealText, { x: "0%" }, { x: "100%" }, "-=0.75");
    gsapTL.fromTo(Img, { scale: "2" }, { scale: "1" }, "-=1");
    navTL.fromTo(navBar, 0.7, { y: "-100%" }, { y: "0%" }, "+=0.7");
    //Scrolling
    slideScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0.2,
      reverse: false,
    })
      .addTo(controller)
      .setTween(gsapTL)
      .addIndicators({
        colorStart: "white",
        colorTrigger: "white",
        name: "Slide",
        indent: -300,
      });
    //!Magic Goes Here...Watch Out!!
    const newPageTL = gsap.timeline();
    let nextSlide = slides[index + 1];
    console.log(nextSlide);
    newPageTL.fromTo(nextSlide, { y: "0%" }, { y: "50%" });
    newPageTL.fromTo(
      slide,
      { scale: 1, opacity: 1 },
      { scale: 0.5, opacity: 0 }
    );
    newPageTL.fromTo(nextSlide, { y: "50%" }, { y: "0%" }, "-=0.5");
    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%",
      triggerHook: 0.13,
    })
      .addIndicators({
        name: "page",
        colorStart: "white",
        colorTrigger: "white",
        colorEnd: "white",
        indent: -300,
      })
      .addTo(controller)
      .setTween(newPageTL)
      .setPin(slide, { pushFollowers: false });
  });
}
window.addEventListener("mousemove", cursorAnimation);
window.addEventListener("mouseover", cursorActive);

const cursor = document.querySelector(".cursor");
function cursorAnimation(e) {
  cursor.style.left = e.pageX + "px";
  cursor.style.top = e.pageY + "px";
}
function cursorActive(e) {
  if (e.target.id === "heroLogo" || e.target.classList.contains("burger")) {
    cursor.classList.add("active-logo");
  } else {
    cursor.classList.remove("active-logo");
  }
  if (e.target.classList.contains("explore")) {
    cursor.classList.add("active-exp");
    cursor.querySelector("span").innerText = "Tap";
    cursor.querySelector("span").classList.add("active");
    gsap.to(".title-swipe", 1.2, { y: "0%" });
  } else {
    cursor.classList.remove("active-exp");
    cursor.querySelector("span").innerText = "";
    cursor.querySelector("span").classList.remove("active");
    gsap.to(".title-swipe", 1.2, { y: "100%" });
  }
}
const burger = document.querySelector(".burger");
burger.addEventListener("click", activeNavBar);
function activeNavBar(e) {
  if (!e.target.classList.contains("ActiveNav")) {
    e.target.classList.add("ActiveNav");
    gsap.to(".nav-links", 1.3, { clipPath: "circle(2500px at 100% -10%)" });
    gsap.to(".line1", 0.7, { rotate: "45deg", background: "black", y: 5 });
    gsap.to(".line2", 0.7, { rotate: "-45deg", background: "black", y: -5 });
    gsap.to("#heroLogo", 0.7, { color: "black" });
    gsap.to(".cursor", 0.7, {
      border: " 2px solid black",
    });
    document.body.classList.add("hide");
  } else {
    e.target.classList.remove("ActiveNav");
    gsap.to(".nav-links", 1.3, { clipPath: "circle(50px at 100% -10%)" });
    gsap.to(".line1", 0.7, { rotate: "0", background: "white", y: 0 });
    gsap.to(".line2", 0.7, { rotate: "0", background: "white", y: 0 });
    gsap.to("#heroLogo", 0.7, { color: "white" });
    gsap.to(".cursor", 0.7, {
      border: " 2px solid white",
    });
    document.body.classList.remove("hide");
  }
}
function detailsAnimation() {
  controller = new ScrollMagic.Controller();
  const detailSlides = document.querySelectorAll(".fashionBlaBlaBla");
  console.log(detailSlides);
  detailSlides.forEach((fashion, index, slides) => {
    let tm = gsap.timeline({ defaults: { duration: 1 } });
    let nextSlide = slides[index + 1];
    let nextImg = nextSlide.querySelector(".fashion-img");
    tm.fromTo(nextSlide, { y: "0%" }, { y: "50%" });
    tm.fromTo(nextSlide, { y: "50%" }, { y: "0%" });
    tm.fromTo(fashion, { opacity: 1 }, { opacity: 0 }, "-=1");
    tm.fromTo(nextImg, { x: "50%" }, { x: "0%" }, "+1.5");
    detailScene = new ScrollMagic.Scene({
      triggerElement: fashion,
      triggerHook: 0.13,
      duration: "100%",
    })
      .setPin(fashion, { pushFollowers: false })
      .addTo(controller)
      .addIndicators({
        colorStart: "white",
        colorTrigger: "white",
        colorEnd: "white",
        name: "Fashion",
        indent: -300,
      })
      .setTween(tm);
  });
}
//!Barba
const heroLogo = document.querySelector("#heroLogo");
barba.init({
  views: [
    {
      namespace: "Home",
      beforeEnter() {
        slideAnimation();
        heroLogo.href = "./index.html";
      },
      beforeLeave() {
        controller.destroy();
        slideScene.destroy();
        pageScene.destroy();
      },
    },
    {
      namespace: "Fashion",
      beforeLeave() {
        controller.destroy();
        detailScene.destroy();
      },
      beforeEnter() {
        let tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        heroLogo.href = "../index.html";
        tl.to("main", { position: "absolute" });
        tl.to("main", { position: "unset" }, "+=0.5");
        detailsAnimation();
      },
    },
  ],
  transitions: [
    {
      leave({ current, next }) {
        let done = this.async();
        let tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        tl.fromTo(current.container, 1, { opacity: 1 }, { opacity: 0 });
        tl.fromTo(
          ".swipe",
          0.75,
          { x: "-100%", y: "0%" },
          { x: "0%", y: "0%", onComplete: done },
          "-=0.5"
        );
      },
      enter({ current, next }) {
        let done = this.async();
        let tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        tl.fromTo(
          ".swipe",
          0.75,
          { y: "0%" },
          { y: "100%", stagger: 0.25, onComplete: done }
        );
        window.scrollTo(0, 0);
        tl.fromTo(next.container, 1, { opacity: 0 }, { opacity: 1 }, "-=0.3");
        tl.fromTo(".nav-bar", 1, { y: "-100%" }, { y: "0%" }, "-=1.3");
      },
    },
  ],
});
