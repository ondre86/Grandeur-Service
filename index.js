function $(element) {
    return document.querySelectorAll(element)
}

addEventListener('DOMContentLoaded', ()=>{
    if (window.location.pathname == '/'){
        intro = gsap.timeline()
        .from(".hero-content-wrap", {
            y:50,
            opacity: 0,
            duration: .75,
            ease: "power1.inOut"
        })
    }

})