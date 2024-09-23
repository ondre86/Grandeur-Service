function $(element) {
    return document.querySelectorAll(element)
}

addEventListener('DOMContentLoaded', ()=>{
    intro = gsap.timeline()
    .from(".hero-content-wrap", {
        y:50,
        opacity: 0,
        duration: .75,
        delay: .25,
        ease: "power1.inOut"
    })
})