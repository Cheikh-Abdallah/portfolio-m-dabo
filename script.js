document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Animation d'apparition au défilement (Scroll Reveal)
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100; // Déclenche l'animation 100px avant que l'élément soit visible

        revealElements.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Déclenche au chargement initial

    // 2. Effet de lumière (Spotlight) qui suit la souris sur les cartes
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        const glow = card.querySelector('.card-glow');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            // Calcule la position de la souris par rapport à la carte
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Déplace la lumière
            glow.style.left = `${x}px`;
            glow.style.top = `${y}px`;
        });

        // Cacher la lumière quand la souris quitte la carte
        card.addEventListener('mouseleave', () => {
            glow.style.opacity = '0';
        });
        
        // Réafficher quand la souris entre
        card.addEventListener('mouseenter', () => {
            glow.style.opacity = '1';
        });
    });
});

// --- PWA : Enregistrement du Service Worker ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('Service Worker enregistré avec succès ! Portée : ', registration.scope);
            })
            .catch((error) => {
                console.error('Échec de l\'enregistrement du Service Worker : ', error);
            });
    });
}