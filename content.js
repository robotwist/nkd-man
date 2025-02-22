// NKD Man 1.1 - Cops Chase and Collide!
(function() {
    const frameImages = [
        "assets/nkdman_frame_0.png",
        "assets/nkdman_frame_1.png"
    ];
    const copImage = "assets/cop_man.webp";
    const copTripImage = "assets/cop_trip.webp";
    let nkdMan, position = -100, speed = 10, frame = 0, cops = [];
    let hasReturned = false;

    function createImage(src, styles) {
        const img = document.createElement("img");
        img.src = src;
        Object.assign(img.style, styles);
        document.body.appendChild(img);
        return img;
    }

    function animateNKDMan() {
        position += speed;
        nkdMan.style.transform = `translate(${position}px, ${Math.sin(position / 10) * 5}px)`;
        nkdMan.src = frameImages[frame = (frame + 1) % 2];

        if (position < window.innerWidth) {
            requestAnimationFrame(animateNKDMan);
        } else {
            document.body.removeChild(nkdMan);
            setTimeout(returnNKDMan, 2000);
        }
    }

    function returnNKDMan() {
        if (hasReturned) {
            return;
        }
        hasReturned = true;

        nkdMan = createImage(frameImages[0], {
            position: "fixed",
            left: "100%",
            bottom: `${Math.random() * window.innerHeight * 0.6}px`,
            width: "100px",
            zIndex: "999999"
        });

        let returnPosition = window.innerWidth;
        function animateReturn() {
            returnPosition -= speed;
            nkdMan.style.transform = `translateX(${returnPosition}px)`;
            if (returnPosition > -100) {
                requestAnimationFrame(animateReturn);
            } else {
                document.body.removeChild(nkdMan);
                setTimeout(spawnCops, 500);
            }
        }
        animateReturn();
    }

    function spawnCops() {
        cops = [
            createImage(copImage, {
                position: "fixed",
                left: "-100px",
                bottom: `${Math.random() * window.innerHeight * 0.6}px`,
                width: "80px",
                zIndex: "999998"
            }),
            createImage(copImage, {
                position: "fixed",
                left: `${window.innerWidth}px`,
                bottom: `${Math.random() * window.innerHeight * 0.6}px`,
                width: "80px",
                zIndex: "999998"
            })
        ];
        requestAnimationFrame(animateCops);
    }

    function animateCops() {
        const leftCop = cops[0];
        const rightCop = cops[1];

        function moveCops() {
            const leftX = parseInt(leftCop.style.left) + 5;
            const rightX = parseInt(rightCop.style.left) - 5;

            leftCop.style.left = `${leftX}px`;
            rightCop.style.left = `${rightX}px`;

            if (Math.abs(leftX - rightX) < 50) {
                leftCop.src = copTripImage;
                rightCop.src = copTripImage;
                setTimeout(() => {
                    document.body.removeChild(leftCop);
                    document.body.removeChild(rightCop);
                    setTimeout(escapeNKDMan, 2000); // Escape after cops crash
                }, 1000);
            } else {
                requestAnimationFrame(moveCops);
            }
        }
        moveCops();
    }

    function escapeNKDMan() {
        nkdMan = createImage(frameImages[0], {
            position: "fixed",
            left: "-100px",
            bottom: `${Math.random() * window.innerHeight * 0.6}px`,
            width: "100px",
            zIndex: "999999"
        });

        position = -100;
        function animateEscape() {
            position += speed;
            nkdMan.style.transform = `translate(${position}px, ${Math.sin(position / 10) * 5}px)`;
            nkdMan.src = frameImages[frame = (frame + 1) % 2];

            if (position < window.innerWidth) {
                requestAnimationFrame(animateEscape);
            } else {
                document.body.removeChild(nkdMan);
            }
        }
        animateEscape();
    }

    nkdMan = createImage(frameImages[0], {
        position: "fixed",
        left: "-100px",
        bottom: `${Math.random() * window.innerHeight * 0.6}px`,
        width: "100px",
        zIndex: "999999"
    });

    setTimeout(animateNKDMan, 2000);
})();
