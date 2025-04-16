// NKD Man 1.1 - The Epic Saga in 4 Acts
(function() {
    const frameImages = [
        "assets/nkdman_frame_0.png",
        "assets/nkdman_frame_1.png"
    ];
    const nkdLadyImage = "assets/nkdlady_frame.gif"; // Updated extension from .png to .gif
    // Replace separate cop images with sprite sheet
    const copSpriteSheet = "assets/cop_sprite_sheet.png";
    
    let nkdMan, nkdLady, position = -100, speed = 10, frame = 0, cops = [];
    let hasReturned = false;
    let currentAct = 1; // Keep track of which act we're in
    
    // For debugging
    function logStatus(message) {
        console.log(`[NKD Debug] ${message}`);
    }
    
    // Sprite positions for the cop animations - Completely redone
    const copSpritePositions = {
        run1: { x: 0, y: 0 },
        run2: { x: 100, y: 0 },
        run3: { x: 0, y: 100 },
        trip: { x: 100, y: 100 }
    };
    
    // Animation timing constants
    const copAnimationSpeed = 200;  // Milliseconds between cop animation frames (slower)
    const copMovementSpeed = 3;     // Pixels per frame (slower)
    
    // Click tracking variables
    let clickCount = 0;
    const requiredClicks = 5;
    let activated = false;
    
    // Flag to check if NKD Lady image is available
    let nkdLadyImageAvailable = true;

    function createImage(src, styles) {
        const img = document.createElement("img");
        img.src = src;
        // Add error handling for missing images
        img.onerror = function() {
            if (src === nkdLadyImage) {
                logStatus("NKD Lady image not found, using NKD Man instead");
                nkdLadyImageAvailable = false;
                img.src = frameImages[0]; // Use NKD Man as fallback
            }
        };
        Object.assign(img.style, styles);
        document.body.appendChild(img);
        return img;
    }

    // ACT 1: NKD Man runs across the screen
    function animateNKDMan() {
        logStatus("Act 1: NKD Man animation started");
        position += speed;
        nkdMan.style.transform = `translate(${position}px, ${Math.sin(position / 10) * 5}px)`;
        nkdMan.src = frameImages[frame = (frame + 1) % 2];

        if (position < window.innerWidth) {
            requestAnimationFrame(animateNKDMan);
        } else {
            document.body.removeChild(nkdMan);
            logStatus("Act 1 completed");
            
            // If it's Act 1, proceed to Act 2
            if (currentAct === 1) {
                setTimeout(() => {
                    currentAct = 2;
                    logStatus("Starting Act 2");
                    returnNKDMan();
                }, 2000);
            }
        }
    }

    // Part of Act 2: NKD Man returns then cops chase
    function returnNKDMan() {
        if (hasReturned) {
            return;
        }
        hasReturned = true;
        logStatus("Act 2: NKD Man returning");

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
                setTimeout(() => {
                    if (currentAct === 2) {
                        logStatus("Spawning cops for Act 2");
                        spawnCops();
                    }
                }, 500);
            }
        }
        animateReturn();
    }

    function createCopElement(position, direction) {
        // Create container for the cop
        const copContainer = document.createElement("div");
        copContainer.style.position = "fixed";
        copContainer.style.left = position.left;
        copContainer.style.bottom = position.bottom;
        copContainer.style.width = "100px";       // Container width
        copContainer.style.height = "100px";      // Container height
        copContainer.style.zIndex = "999998";
        copContainer.style.overflow = "visible";  // Let sprite overflow if needed
        
        // Create the actual sprite element inside the container
        const copSprite = document.createElement("div");
        copSprite.style.width = "100px";          // Sprite size
        copSprite.style.height = "100px";
        copSprite.style.backgroundImage = `url(${copSpriteSheet})`;
        copSprite.style.backgroundSize = "1024px 1024px"; // Actual size based on user's info
        copSprite.style.backgroundRepeat = "no-repeat";
        copSprite.style.backgroundPosition = "0 0"; // Start with first frame
        copSprite.style.transform = direction === "left" ? "" : "scaleX(-1)";
        
        // Store sprite element reference for animation
        copContainer.sprite = copSprite;
        
        // Add sprite to container
        copContainer.appendChild(copSprite);
        document.body.appendChild(copContainer);
        
        return copContainer;
    }

    // Part of Act 2: Cops chase and collide
    function spawnCops() {
        cops = [
            createCopElement({
                left: "-100px",
                bottom: `${Math.random() * window.innerHeight * 0.3 + 120}px` // Higher position
            }, "left"),
            createCopElement({
                left: `${window.innerWidth}px`,
                bottom: `${Math.random() * window.innerHeight * 0.3 + 120}px` // Higher position
            }, "right")
        ];
        
        // Start animation frames for cops
        let copFrame = 0;
        let lastFrameTime = 0;
        
        function animateCopSprites(timestamp) {
            // Only update frame if enough time has passed
            if (!lastFrameTime || timestamp - lastFrameTime > copAnimationSpeed) {
                const runFrames = [
                    { x: 0, y: 0 },           // Frame 1 - top left quadrant
                    { x: -512, y: 0 },        // Frame 2 - top right quadrant
                    { x: 0, y: -512 }         // Frame 3 - bottom left quadrant
                ];
                const currentFrame = runFrames[copFrame];
                
                cops.forEach(cop => {
                    if (!cop.tripped) {
                        cop.sprite.style.backgroundPosition = `${currentFrame.x}px ${currentFrame.y}px`;
                    }
                });
                
                copFrame = (copFrame + 1) % 3;
                lastFrameTime = timestamp;
            }
            
            if (cops[0].parentNode && !cops[0].tripped) {
                requestAnimationFrame(animateCopSprites);
            }
        }
        
        requestAnimationFrame(animateCopSprites);
        requestAnimationFrame(animateCopsAct2);
    }

    // Cop animation for Act 2
    function animateCopsAct2() {
        const leftCop = cops[0];
        const rightCop = cops[1];

        function moveCops() {
            const leftX = parseInt(leftCop.style.left) + copMovementSpeed;
            const rightX = parseInt(rightCop.style.left) - copMovementSpeed;

            leftCop.style.left = `${leftX}px`;
            rightCop.style.left = `${rightX}px`;

            if (Math.abs(leftX - rightX) < 50) {
                // Change to trip sprite (bottom right quadrant)
                leftCop.sprite.style.backgroundPosition = "-512px -512px";
                rightCop.sprite.style.backgroundPosition = "-512px -512px";
                
                // Mark as tripped to stop run animation
                leftCop.tripped = true;
                rightCop.tripped = true;
                logStatus("Cops collided in Act 2");
                
                setTimeout(() => {
                    document.body.removeChild(leftCop);
                    document.body.removeChild(rightCop);
                    logStatus("Cops removed, preparing for Act 3");
                    
                    // Move to Act 3 after cops crash in Act 2
                    setTimeout(() => {
                        currentAct = 3;
                        logStatus("Starting Act 3");
                        startAct3();
                    }, 2000);
                }, 1000);
            } else {
                requestAnimationFrame(moveCops);
            }
        }
        moveCops();
    }

    // Act 3: NKD Man returns but NKD Lady steals the show
    function startAct3() {
        logStatus("Act 3: NKD Man enters");
        // First, NKD Man comes back on screen
        nkdMan = createImage(frameImages[0], {
            position: "fixed",
            left: "-100px",
            bottom: `${Math.random() * window.innerHeight * 0.6}px`,
            width: "100px",
            zIndex: "999999"
        });

        let nkdManPosition = -100; // Local variable for this animation
        let ladyAppeared = false;
        
        function animateAct3() {
            nkdManPosition += speed;
            nkdMan.style.transform = `translate(${nkdManPosition}px, ${Math.sin(nkdManPosition / 10) * 5}px)`;
            nkdMan.src = frameImages[frame = (frame + 1) % 2];

            // When NKD Man is halfway across, NKD Lady appears
            if (nkdManPosition > window.innerWidth / 3 && !ladyAppeared) {
                ladyAppeared = true;
                logStatus("Act 3: NKD Lady appears");
                // NKD Lady enters from the right
                nkdLady = createImage(nkdLadyImage, {
                    position: "fixed",
                    left: "100%",
                    bottom: `${Math.random() * window.innerHeight * 0.6}px`,
                    width: "100px",
                    zIndex: "999999"
                });
                
                // Pass nkdManPosition to the lady animation so it can access it
                const currentManPosition = nkdManPosition; // Make a copy of the current position
                animateNKDLady(currentManPosition);
            }

            if (nkdManPosition < window.innerWidth && !ladyAppeared) {
                requestAnimationFrame(animateAct3);
            } else {
                // If NKD Man reaches the end before lady appears, remove him
                if (!ladyAppeared) {
                    logStatus("Act 3: Lady didn't appear, removing man and moving to Act 4");
                    document.body.removeChild(nkdMan);
                    // Skip to Act 4 if lady didn't appear (image missing)
                    currentAct = 4;
                    startAct4();
                }
            }
        }
        
        animateAct3();
    }

    // NKD Lady animation for Act 3
    function animateNKDLady(manXPosition) {
        let nkdLadyPosition = window.innerWidth;
        
        function moveLady() {
            nkdLadyPosition -= speed;
            nkdLady.style.transform = `translate(${-window.innerWidth + nkdLadyPosition}px, ${Math.sin(nkdLadyPosition / 8) * 6}px)`;
            
            // NKD Man notices the lady and stops in his tracks
            if (nkdLady.parentNode && nkdMan.parentNode) {
                nkdMan.style.transform = `translate(${manXPosition}px, ${Math.sin(manXPosition / 10) * 5}px) rotate(20deg)`;
            }
            
            if (nkdLadyPosition > 0) {
                requestAnimationFrame(moveLady);
            } else {
                // NKD Lady exits stage left
                logStatus("Act 3: NKD Lady exits");
                if (nkdLady.parentNode) document.body.removeChild(nkdLady);
                
                // NKD Man chases after her (Act 4 begins)
                setTimeout(() => {
                    // Remove NKD Man if he's still on screen
                    if (nkdMan.parentNode) {
                        logStatus("Act 3: NKD Man chases after Lady");
                        document.body.removeChild(nkdMan);
                    }
                    
                    currentAct = 4;
                    logStatus("Starting Act 4");
                    startAct4();
                }, 1000);
            }
        }
        
        moveLady();
    }

    // Act 4: NKD Lady Show, NKD Man chases, Cops chase them both, Love ending
    function startAct4() {
        logStatus("Act 4: NKD Lady show begins");
        // First NKD Lady does her show
        nkdLady = createImage(nkdLadyImage, {
            position: "fixed",
            left: "-100px", 
            bottom: `${Math.random() * window.innerHeight * 0.6}px`,
            width: "100px",
            zIndex: "999999"
        });
        
        let ladyPosition = -100;
        let manChasingStarted = false;
        
        function animateLadyShow() {
            ladyPosition += speed;
            nkdLady.style.transform = `translate(${ladyPosition}px, ${Math.sin(ladyPosition / 8) * 6}px)`;
            
            // When she's halfway across, NKD Man starts chasing
            if (ladyPosition > window.innerWidth / 2 && !manChasingStarted) {
                manChasingStarted = true;
                logStatus("Act 4: NKD Man chases Lady");
                nkdManChase();
            }
            
            if (ladyPosition < window.innerWidth) {
                requestAnimationFrame(animateLadyShow);
            } else {
                // NKD Lady exits stage right
                logStatus("Act 4: NKD Lady exits right");
                if (nkdLady.parentNode) document.body.removeChild(nkdLady);
                
                // If NKD Man is still chasing, let him finish
                if (!copsChasing) {
                    setTimeout(() => {
                        logStatus("Starting final chase sequence");
                        finalChase();
                    }, 1000);
                }
            }
        }
        
        // If NKD Lady image isn't available, go straight to the finale
        if (!nkdLadyImageAvailable) {
            logStatus("Act 4: Skipping Lady's show (image not available)");
            setTimeout(finalChase, 1000);
        } else {
            animateLadyShow();
        }
    }
    
    // NKD Man chases NKD Lady in Act 4
    function nkdManChase() {
        nkdMan = createImage(frameImages[0], {
            position: "fixed", 
            left: "-150px",  // Start further back
            bottom: `${Math.random() * window.innerHeight * 0.6}px`,
            width: "100px",
            zIndex: "999998"  // Behind lady
        });
        
        let manPosition = -150;
        
        function animateManChase() {
            manPosition += speed * 1.2;  // Slightly faster to catch up
            nkdMan.style.transform = `translate(${manPosition}px, ${Math.sin(manPosition / 10) * 5}px)`;
            nkdMan.src = frameImages[frame = (frame + 1) % 2];
            
            if (manPosition < window.innerWidth) {
                requestAnimationFrame(animateManChase);
            } else {
                // NKD Man exits stage right
                logStatus("Act 4: NKD Man exits right");
                if (nkdMan.parentNode) document.body.removeChild(nkdMan);
            }
        }
        
        animateManChase();
    }
    
    // Final chase with cops and love ending
    let copsChasing = false;
    function finalChase() {
        copsChasing = true;
        logStatus("Final chase: Both characters and cops");
        
        // NKD Man from left
        nkdMan = createImage(frameImages[0], {
            position: "fixed",
            left: "-100px",
            bottom: `${Math.random() * window.innerHeight * 0.4 + 100}px`,
            width: "100px",
            zIndex: "999990"
        });
        
        // NKD Lady from right (fallback to NKD Man if needed)
        nkdLady = createImage(nkdLadyImage, {
            position: "fixed",
            left: "100%",
            bottom: `${Math.random() * window.innerHeight * 0.4 + 100}px`,
            width: "100px",
            zIndex: "999990"
        });
        
        // Create heart element (hidden initially)
        const heart = document.createElement("div");
        heart.style.position = "fixed";
        heart.style.left = "50%";
        heart.style.top = "40%";
        heart.style.transform = "translate(-50%, -50%) scale(0)";
        heart.style.fontSize = "100px";
        heart.style.color = "red";
        heart.style.zIndex = "1000000";
        heart.style.transition = "transform 0.5s ease-out";
        heart.innerHTML = "❤️";
        heart.style.opacity = "0";
        document.body.appendChild(heart);
        
        // Cops chasing heroes - one from each side
        const leftCop = createCopElement({
            left: "-200px",
            bottom: nkdMan.style.bottom  // Same height as NKD Man
        }, "left");
        
        const rightCop = createCopElement({
            left: `${window.innerWidth + 100}px`,
            bottom: nkdLady.style.bottom  // Same height as NKD Lady
        }, "right");
        
        cops = [leftCop, rightCop];
        
        // Animate cops running
        let copFrame = 0;
        let lastFrameTime = 0;
        
        function animateCopSprites(timestamp) {
            // Only update frame if enough time has passed
            if (!lastFrameTime || timestamp - lastFrameTime > copAnimationSpeed) {
                const runFrames = [
                    { x: 0, y: 0 },           // Frame 1 - top left quadrant
                    { x: -512, y: 0 },        // Frame 2 - top right quadrant
                    { x: 0, y: -512 }         // Frame 3 - bottom left quadrant
                ];
                const currentFrame = runFrames[copFrame];
                
                cops.forEach(cop => {
                    if (!cop.tripped) {
                        cop.sprite.style.backgroundPosition = `${currentFrame.x}px ${currentFrame.y}px`;
                    }
                });
                
                copFrame = (copFrame + 1) % 3;
                lastFrameTime = timestamp;
            }
            
            if (cops[0].parentNode && !cops[0].tripped) {
                requestAnimationFrame(animateCopSprites);
            }
        }
        
        requestAnimationFrame(animateCopSprites);
        
        // Animate all characters
        const centerX = window.innerWidth / 2;
        let manPosition = -100;
        let ladyPosition = window.innerWidth;
        let heartShown = false;
        
        function animateFinalChase() {
            // Move NKD Man from left toward center
            if (manPosition < centerX - 50) {
                manPosition += speed;
                nkdMan.style.left = `${manPosition}px`;
                nkdMan.style.transform = `translateY(${Math.sin(manPosition / 10) * 5}px)`;
                nkdMan.src = frameImages[frame = (frame + 1) % 2];
            }
            
            // Move NKD Lady from right toward center
            if (ladyPosition > centerX + 50) {
                ladyPosition -= speed;
                nkdLady.style.left = `${ladyPosition}px`;
                nkdLady.style.transform = `translateY(${Math.sin(ladyPosition / 8) * 5}px)`;
            }
            
            // Move cops - each chasing their respective hero
            const leftCopX = parseInt(leftCop.style.left) + copMovementSpeed + 1; 
            const rightCopX = parseInt(rightCop.style.left) - copMovementSpeed - 1;
            
            leftCop.style.left = `${leftCopX}px`;
            rightCop.style.left = `${rightCopX}px`;
            
            // Check if heroes meet in the middle
            if (Math.abs(manPosition - (centerX - 50)) < 10 && 
                Math.abs(ladyPosition - (centerX + 50)) < 10 && 
                !heartShown) {
                // They meet! Show heart
                heartShown = true;
                logStatus("Final chase: Characters meet, true love!");
                heart.style.opacity = "1";
                heart.style.transform = "translate(-50%, -50%) scale(1.5)";
                
                // Look at each other
                nkdMan.style.transform = "";
                nkdLady.style.transform = "";
                
                // Schedule cop collision after heart appears
                setTimeout(() => {
                    // Cops collide
                    if (leftCop.parentNode && rightCop.parentNode && !leftCop.tripped) {
                        copCollide();
                    }
                }, 1000);
            }
            
            // Check if cops should collide (if heroes have met)
            if (heartShown && !leftCop.tripped && 
                Math.abs(leftCopX - rightCopX) < 80) {
                copCollide();
                return;
            }
            
            if (!heartShown || !leftCop.tripped) {
                requestAnimationFrame(animateFinalChase);
            } else if (heartShown && leftCop.tripped) {
                // After heart shown and cops collided, show ending
                setTimeout(loveEscape, 1500);
            }
        }
        
        function copCollide() {
            // Cops trip over each other (bottom right quadrant)
            logStatus("Final chase: Cops collide");
            leftCop.sprite.style.backgroundPosition = "-512px -512px";
            rightCop.sprite.style.backgroundPosition = "-512px -512px";
            
            leftCop.tripped = true;
            rightCop.tripped = true;
            
            // Make cops fall down animation
            leftCop.sprite.style.transform = "rotate(90deg)";
            rightCop.sprite.style.transform = "rotate(-90deg)";
            
            setTimeout(() => {
                if (leftCop.parentNode) document.body.removeChild(leftCop);
                if (rightCop.parentNode) document.body.removeChild(rightCop);
            }, 1500);
        }
        
        function loveEscape() {
            logStatus("Love escape sequence starting");
            
            // Run off together to the right
            let escapePosition = centerX;
            
            function escapeAnimation() {
                escapePosition += speed;
                
                nkdMan.style.left = `${escapePosition - 70}px`;
                nkdLady.style.left = `${escapePosition + 30}px`;
                
                // Ensure heart follows them
                heart.style.left = `${escapePosition}px`;
                
                nkdMan.src = frameImages[frame = (frame + 1) % 2];
                
                if (escapePosition < window.innerWidth + 100) {
                    requestAnimationFrame(escapeAnimation);
                } else {
                    logStatus("Animation sequence complete");
                    if (heart.parentNode) document.body.removeChild(heart);
                    cleanupAct4();
                }
            }
            
            escapeAnimation();
        }
        
        function cleanupAct4() {
            logStatus("Cleaning up animation");
            // Clean up all elements
            if (nkdMan.parentNode) document.body.removeChild(nkdMan);
            if (nkdLady.parentNode) document.body.removeChild(nkdLady);
            cops.forEach(cop => {
                if (cop.parentNode) document.body.removeChild(cop);
            });
            
            // Reset for future clicks
            hasReturned = false;
            activated = false;
            currentAct = 1;
            copsChasing = false;
            clickCount = 0; // Reset click count for next activation
            
            // Re-add click listener for next time
            document.addEventListener('click', handleClick);
            
            // Reset the click counter display
            const counter = document.getElementById('click-count');
            if (counter) counter.textContent = "0";
            
            logStatus("Animation reset, ready for next activation");
        }
        
        // Start the final animation
        animateFinalChase();
    }

    function initializeNKDMan() {
        // Reset state variables
        hasReturned = false;
        currentAct = 1;
        
        nkdMan = createImage(frameImages[0], {
            position: "fixed",
            left: "-100px",
            bottom: `${Math.random() * window.innerHeight * 0.6}px`,
            width: "100px",
            zIndex: "999999"
        });
        
        // Start the animation sequence
        animateNKDMan();
    }
    
    // Setup click event listener to track clicks
    function handleClick() {
        // Only count clicks if not already activated
        if (!activated) {
            clickCount++;
            
            // Check if we've reached the required number of clicks
            if (clickCount >= requiredClicks) {
                activated = true;
                logStatus(`Animation activated after ${clickCount} clicks`);
                // Remove the click listener to avoid triggering again
                document.removeEventListener('click', handleClick);
                // Start the animation
                initializeNKDMan();
            }
        }
    }
    
    // Add click event listener
    document.addEventListener('click', handleClick);
    
    // No automatic timeout anymore, animation will start after 5 clicks
    logStatus("NKD Man initialized, waiting for clicks");
})();
