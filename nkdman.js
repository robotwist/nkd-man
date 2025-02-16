// NK D Man - The Ultimate Viral Streaker with Tiny Cop Chasers
(function() {
    // Create the sprite element
    let nkdMan = document.createElement("img");
    nkdMan.src = "https://robotwist.github.io/nkd-man/assets/nkdman_frame_0.png";
    nkdMan.style.position = "fixed";
    nkdMan.style.left = "-100px";
    nkdMan.style.bottom = Math.random() * window.innerHeight * 0.6 + "px";
    nkdMan.style.width = "50px";
    nkdMan.style.zIndex = "999999";
    document.body.appendChild(nkdMan);

    let position = -100;
    let speed = 12;
    let frame = 0;
    let frameImages = [
        "https://robotwist.github.io/nkd-man/assets/nkdman_frame_0.png",
        "https://robotwist.github.io/nkd-man/assets/nkdman_frame_1.png"
    ];

    function animate() {
        position += speed;
        let randomWiggle = Math.sin(position / 10) * 10;
        let bounceEffect = Math.abs(Math.sin(position / 15) * 5);
        nkdMan.style.transform = `translate(${position}px, ${randomWiggle + bounceEffect}px)`;
        
        // Animate frame switching at 4FPS
        setTimeout(() => {
            frame = (frame + 1) % 2;
            nkdMan.src = frameImages[frame];
        }, 250);
        
        if (position < window.innerWidth) {
            requestAnimationFrame(animate);
        } else {
            document.body.removeChild(nkdMan);
            setTimeout(spawnCopChasers, 1000); // Delay cops appearing
            setTimeout(returnForEncore, Math.random() * 5000 + 5000); // Delayed encore
        }
    }

    function spawnCopChasers() {
        let copCount = Math.floor(Math.random() * 3) + 1; // 1 to 3 cops
        for (let i = 0; i < copCount; i++) {
            let cop = document.createElement("img");
            cop.src = "https://robotwist.github.io/nkd-man/assets/cop_man.webp";
            cop.style.position = "fixed";
            cop.style.left = "-80px";
            cop.style.bottom = Math.random() * window.innerHeight * 0.6 + "px";
            cop.style.width = "40px";
            cop.style.zIndex = "999999";
            document.body.appendChild(cop);
            
            let copPosition = -80;
            let copSpeed = 9;
            let tripAt = Math.random() * window.innerWidth * 0.5 + window.innerWidth * 0.2;
            function animateCop() {
                copPosition += copSpeed;
                cop.style.transform = `translateX(${copPosition}px)`;
                
                if (copPosition < tripAt) {
                    requestAnimationFrame(animateCop);
                } else {
                    cop.src = "https://robotwist.github.io/nkd-man/assets/cop_trip.webp"; // Tripping frame
                    setTimeout(() => document.body.removeChild(cop), 1000);
                }
            }
            animateCop();
        }
    }

    function returnForEncore() {
        let nkdManEncore = document.createElement("img");
        nkdManEncore.src = frameImages[0];
        nkdManEncore.style.position = "fixed";
        nkdManEncore.style.right = "-100px";
        nkdManEncore.style.bottom = Math.random() * window.innerHeight * 0.6 + "px";
        nkdManEncore.style.width = "50px";
        nkdManEncore.style.zIndex = "999999";
        document.body.appendChild(nkdManEncore);
        
        let encorePosition = -100;
        let encoreSpeed = 10;
        function animateEncore() {
            encorePosition += encoreSpeed;
            nkdManEncore.style.transform = `translateX(-${encorePosition}px)`;
            
            // Animate frame switching at 4FPS
            setTimeout(() => {
                frame = (frame + 1) % 2;
                nkdManEncore.src = frameImages[frame];
            }, 250);
            
            if (encorePosition < window.innerWidth) {
                requestAnimationFrame(animateEncore);
            } else {
                setTimeout(() => {
                    nkdManEncore.src = "https://robotwist.github.io/nkd-man/assets/nkdman_rockon.png";
                }, 500);
                setTimeout(() => {
                    document.body.removeChild(nkdManEncore);
                }, 2000); // Longer peek-and-wave effect
            }
        }
        
        animateEncore();
    }
    
    // Delay start for surprise factor
    setTimeout(animate, Math.random() * 5000 + 2000);
})();
