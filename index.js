(function() {
    const wheel = document.querySelector('.wheel')
    const startButton = document.querySelector('.button')
    let deg = 0

    startButton.addEventListener('click', () => {
        startButton.style.pointerEvents = 'none'
        deg = Math.floor(3000 + Math.random() * 3000)
        wheel.style.transition = 'all 4s ease-out'
        wheel.style.transform = `rotate(${deg}deg)`
    })

    wheel.addEventListener('transitionend', () => {
        startButton.style.pointerEvents = 'auto'
        wheel.style.transition = 'none'
        const actualDeg = deg %  360
        wheel.style.transform = `rotate(${actualDeg}deg)`
    })
})()
