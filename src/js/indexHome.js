document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('carouselTrack');
    
    let isDown = false;
    let startX;
    let scrollLeft;
    let isShifting = false; 
    let scrollTimeout; 

    track.addEventListener('mousedown', (e) => {
        isDown = true;
        track.style.scrollBehavior = 'auto'; 
        track.style.scrollSnapType = 'none'; 
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
    });

    track.addEventListener('mouseleave', () => {
        if (!isDown) return;
        isDown = false;
        track.style.scrollBehavior = 'smooth';
        track.style.scrollSnapType = 'x mandatory';
        handleInfiniteLoop(); 
    });

    track.addEventListener('mouseup', () => {
        isDown = false;
        track.style.scrollBehavior = 'smooth'; 
        track.style.scrollSnapType = 'x mandatory'; 
        handleInfiniteLoop();
    });

    track.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 0.5; 
        track.scrollLeft = scrollLeft - walk;
    });

    function updateActiveCard() {
        const currentCards = document.querySelectorAll('.credit-card');
        const trackCenter = track.getBoundingClientRect().left + (track.clientWidth / 2);
        
        let closestCard = null;
        let minDistance = Infinity;

        currentCards.forEach(card => {
            const cardCenter = card.getBoundingClientRect().left + (card.clientWidth / 2);
            const distance = Math.abs(trackCenter - cardCenter);

            if (distance < minDistance) {
                minDistance = distance;
                closestCard = card;
            }
        });

        currentCards.forEach(card => card.classList.remove('active'));
        if (closestCard) {
            closestCard.classList.add('active');
        }
    }

    function handleInfiniteLoop() {
        if (isShifting) return;

        const currentCards = document.querySelectorAll('.credit-card');
        if (currentCards.length === 0) return;

        const cardWidth = currentCards[0].offsetWidth;
        const gap = 30; 
        const shiftAmount = cardWidth + gap;

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            
            if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) {
                isShifting = true;
                track.style.scrollSnapType = 'none';
                track.style.scrollBehavior = 'auto'; 
                
                track.appendChild(track.firstElementChild); 
                track.scrollLeft -= shiftAmount;
                
                requestAnimationFrame(() => {
                    track.style.scrollBehavior = 'smooth';
                    track.style.scrollSnapType = 'x mandatory';
                    isShifting = false;
                    updateActiveCard();
                });
            }
            else if (track.scrollLeft <= 10) {
                isShifting = true;
                track.style.scrollSnapType = 'none';
                track.style.scrollBehavior = 'auto'; 
                
                track.prepend(track.lastElementChild); 
                track.scrollLeft += shiftAmount;
                
                requestAnimationFrame(() => {
                    track.style.scrollBehavior = 'smooth';
                    track.style.scrollSnapType = 'x mandatory';
                    isShifting = false;
                    updateActiveCard();
                });
            }
        }, 150); 
    }

    track.addEventListener('scroll', () => {
        updateActiveCard();
        if (!isDown) { 
            handleInfiniteLoop();
        }
    });

    setTimeout(() => {
        const currentCards = document.querySelectorAll('.credit-card');
        if(currentCards.length > 1) {
            currentCards[1].scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' });
            updateActiveCard();
        }
    }, 100);
});