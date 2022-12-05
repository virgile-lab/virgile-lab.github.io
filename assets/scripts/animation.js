

gsap.from(
    ".box-right  .random-linear-gradient",
    {
        onStart: function () {
            console.log("start")
        },
        duration: 2.5,
        y: "-100vh",
        display: "none",
        opacity: 0,
        stagger: .02,
        ease: "elastic.out(.1, 0.3)",
    }
)


gsap.from(
    ".box-left  .random-linear-gradient",
    {
        duration: 2.5,
        y: "-100vh",
        display: "none",
        opacity: 0,
        stagger: .02,
        ease: "elastic.out(.1, 0.3)",
    }
)

