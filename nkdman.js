// NK D Man - The Ultimate Pixel Streaker (Simplified Version)
(function() {
    // Create the sprite element
    let nkdMan = document.createElement("img");
    nkdMan.src = "https://robotwist.github.io/nkd-man/assets/nkdman_frame_0.png";
    nkdMan.style.position = "fixed";
    nkdMan.style.left = "-100px";
    nkdMan.style.bottom = Math.random() * window.innerHeight * 0.6 + "px";
    nkdMan.style.width = "100px";
    nkdMan.style.zIndex = "999999";
    document.body.appendChild(nkdMan);

    let position = -100;
    let speed = 150;
    let frame = 0;
    let frameImages = [
        "https://robotwist.github.io/nkd-man/assets/nkdman_frame_0.png",
        "https://robotwist.github.io/nkd-man/assets/nkdman_frame_1.png"
    ];

    function animate() {
        position += speed;
        nkdMan.style.transform = `translate(${position}px, ${Math.sin(position / 15) * 5}px)`;

        // Animate frame switching at 4FPS
        frame = (frame + 1) % 2;
        nkdMan.src = frameImages[frame];

        if (position < window.innerWidth) {
            setTimeout(() => requestAnimationFrame(animate), 250); // Smooth frame sync
        } else {
            document.body.removeChild(nkdMan);
            setTimeout(leaveScreenCompletely, 1000); // Delay before final return
        }
    }

    function leaveScreenCompletely() {
        let nkdManExit = document.createElement("img");
        nkdManExit.src = frameImages[0];
        nkdManExit.style.position = "fixed";
        nkdManExit.style.left = "100%"; // Start fully off-screen
        nkdManExit.style.bottom = Math.random() * window.innerHeight * 0.6 + "px";
        nkdManExit.style.width = "100px";
        nkdManExit.style.zIndex = "999999";
        document.body.appendChild(nkdManExit);

        let exitPosition = window.innerWidth;
        let exitSpeed = 50;

        function animateExit() {
            exitPosition += exitSpeed;
            nkdManExit.style.transform = `translateX(${exitPosition}px)`;

            if (exitPosition < window.innerWidth * 2) {
                requestAnimationFrame(animateExit);
            } else {
                document.body.removeChild(nkdManExit);
                setTimeout(returnForFinalSalute, 2000); // Pause before final salute
            }
        }

        animateExit();
    }

    function returnForFinalSalute() {
        let nkdManFinal = document.createElement("img");
        nkdManFinal.src = frameImages[0];
        nkdManFinal.style.position = "fixed";
        nkdManFinal.style.left = "-100px";
        nkdManFinal.style.bottom = Math.random() * window.innerHeight * 0.6 + "px";
        nkdManFinal.style.width = "100px";
        nkdManFinal.style.zIndex = "999999";
        document.body.appendChild(nkdManFinal);

        let finalPosition = -100;
        let finalSpeed = 50;

        function animateFinal() {
            finalPosition += finalSpeed;
            nkdManFinal.style.transform = `translateX(${finalPosition}px)`;

            if (finalPosition < window.innerWidth - 150) {  // Stops before the screen edge
                requestAnimationFrame(animateFinal);
            } else {
                // Perform the final 1-2 headbang salute before disappearing
                setTimeout(() => { nkdManFinal.src = frameImages[0]; }, 500);
                setTimeout(() => { nkdManFinal.src = frameImages[1]; }, 1000);
                setTimeout(() => { nkdManFinal.src = frameImages[0]; }, 1500);
                setTimeout(() => document.body.removeChild(nkdManFinal), 2500);
            }
        }

        animateFinal();
    }

    // Delay start for surprise factor
    setTimeout(animate, Math.random() * 5000 + 2000);
})();
