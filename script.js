// Enhanced smooth animations and interactions - GLOBAL PROFILE LOADER FIX



document.addEventListener('DOMContentLoaded', function() {
    // GLOBAL profile loader - fetches from profile.json for all users
    loadProfileData();



    // Load profile data function
    async function loadProfileData() {
        let profileData = {};
        try {
            const response = await fetch('profile.json');
            profileData = await response.json();
            console.log('Profile loaded from profile.json:', profileData);
        } catch (err) {
            console.error("Failed to fetch profile.json, falling back to localStorage:", err);
            profileData = JSON.parse(localStorage.getItem('profileData') || '{}');
        }



        // Load avatar
        const avatarImg = document.getElementById('avatar-img');
        const avatarFallback = document.querySelector('.avatar-fallback');
        if (profileData.avatar) {
            avatarImg.src = profileData.avatar;
            avatarImg.style.display = 'block';
            if (avatarFallback) avatarFallback.style.display = 'none';
            avatarImg.onerror = () => {
                avatarImg.style.display = 'none';
                if (avatarFallback) avatarFallback.style.display = 'block';
            };
        } else {
            avatarImg.style.display = 'none';
            if (avatarFallback) {
                avatarFallback.style.display = 'block';
            }
        }



        // Load profile info (always update if data exists, even if empty)
        const nameEl = document.getElementById('profile-name');
        const bioEl = document.getElementById('profile-bio');
        const locationEl = document.getElementById('profile-location');


        if (nameEl) {
            // Check if name exists in profile.json
            nameEl.textContent = profileData.name || 'Your Name';
        }
        if (bioEl) {
            bioEl.textContent = profileData.bio || 'Your bio or tagline goes here. Keep it short and impactful.';
        }
        if (locationEl) {
            locationEl.textContent = profileData.location || 'Location';
        }



        // Load audio
        const audioPlayer = document.getElementById('audio-player');
        const backgroundAudio = document.getElementById('background-audio');
        if (profileData.audioUrl && profileData.audioUrl.trim()) {
            const audioUrl = profileData.audioUrl.trim();


            // Check if it's a YouTube URL
            const youtubeMatch = audioUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);


            if (youtubeMatch) {
                // It's a YouTube link - use YouTube iframe API
                const videoId = youtubeMatch[1];
                loadYouTubeAudio(videoId, true); // true = autoplay
                audioPlayer.style.display = 'flex';
            } else {
                // Regular audio file
                backgroundAudio.src = audioUrl;
                audioPlayer.style.display = 'flex';
                // Set volume from localStorage or default to 50%
                const savedVolume = localStorage.getItem('audioVolume');
                if (savedVolume) {
                    backgroundAudio.volume = savedVolume / 100;
                    document.getElementById('volume-slider').value = savedVolume;
                }
            }
        }



        // Apply accent color
        if (profileData.accentColor) {
            document.documentElement.style.setProperty('--accent', profileData.accentColor);
            document.documentElement.style.setProperty('--accent-hover', adjustBrightness(profileData.accentColor, 20));
            document.documentElement.style.setProperty('--accent-secondary', adjustBrightness(profileData.accentColor, -10));
            document.documentElement.style.setProperty('--accent-glow', profileData.accentColor + '40');
        }



        // Display global icons from profile.json
        if (profileData.icons && Array.isArray(profileData.icons) && profileData.icons.length > 0) {
            const container = document.getElementById('links-container');
            const iconsRow = document.createElement('div');
            iconsRow.style.display = 'flex';
            iconsRow.style.gap = '15px';
            iconsRow.style.justifyContent = 'center';
            iconsRow.style.marginBottom = '20px';
            iconsRow.style.flexWrap = 'wrap';
            
            profileData.icons.forEach((iconUrl) => {
                const iconLink = document.createElement('a');
                iconLink.href = '#';
                iconLink.className = 'icon-box';
                iconLink.style.width = '50px';
                iconLink.style.height = '50px';
                iconLink.style.borderRadius = '10px';
                iconLink.style.overflow = 'hidden';
                iconLink.style.display = 'flex';
                iconLink.style.alignItems = 'center';
                iconLink.style.justifyContent = 'center';
                iconLink.style.backgroundColor = 'rgba(255,255,255,0.1)';
                iconLink.style.transition = 'all 0.3s ease';
                
                const img = document.createElement('img');
                img.src = iconUrl;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                img.alt = 'Icon';
                
                iconLink.appendChild(img);
                iconsRow.appendChild(iconLink);
            });
            
            container.insertBefore(iconsRow, container.firstChild);
        }



        // Load links
        const linksContainer = document.getElementById('links-container');
        // Only clear if we haven't already added icons
        const existingIcons = linksContainer.querySelector('div[style*="gap: 15px"]');
        if (!existingIcons) {
            linksContainer.innerHTML = '';
        }


        if (profileData.links && profileData.links.length > 0) {
            profileData.links.forEach(link => {
                const linkCard = createLinkCard(link.label, link.url, link.imageUrl);
                linksContainer.appendChild(linkCard);
            });
        } else {
            // Default links
            const defaultLinks = [
                { label: 'GitHub', url: 'https://github.com/', icon: '🐙' },
                { label: 'Portfolio', url: '#', icon: '🌐' },
                { label: 'Email', url: 'mailto:', icon: '📧' }
            ];
            defaultLinks.forEach(link => {
                const linkCard = createLinkCard(link.label, link.url, null, link.icon);
                linksContainer.appendChild(linkCard);
            });
        }



        // Reinitialize animations for dynamically loaded content
        initAnimations();
    }



    // Helper function to adjust color brightness
    function adjustBrightness(hex, percent) {
        const num = parseInt(hex.replace("#", ""), 16);
        const r = Math.min(255, Math.max(0, (num >> 16) + percent));
        const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + percent));
        const b = Math.min(255, Math.max(0, (num & 0x0000FF) + percent));
        return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
    }



    // Create link card element
    function createLinkCard(label, url, imageUrl = null, fallbackIcon = null) {
        const linkCard = document.createElement('a');
        linkCard.href = url === '#' ? '#' : url;
        linkCard.className = 'link-card';
        linkCard.target = url !== '#' ? '_blank' : '_self';
        linkCard.title = label; // Use label as tooltip


        let cardContent = '';


        // Use image if provided, otherwise use emoji icon
        if (imageUrl && imageUrl.trim()) {
            cardContent = `<img src="${imageUrl}" alt="${label}" class="link-card-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />`;


            // Get fallback icon for error case
            if (!fallbackIcon) {
                const iconMap = {
                    'GitHub': '🐙',
                    'Discord': '💬',
                    'Roblox': '🎮',
                    'Portfolio': '🌐',
                    'Email': '📧',
                    'Twitter': '🐦',
                    'LinkedIn': '💼',
                    'Instagram': '📸'
                };
                fallbackIcon = iconMap[label] || '🔗';
            }


            cardContent += `<span class="link-card-fallback" style="display: none;">${fallbackIcon}</span>`;
        } else {
            // No image, use emoji fallback
            if (!fallbackIcon) {
                const iconMap = {
                    'GitHub': '🐙',
                    'Discord': '💬',
                    'Roblox': '🎮',
                    'Portfolio': '🌐',
                    'Email': '📧',
                    'Twitter': '🐦',
                    'LinkedIn': '💼',
                    'Instagram': '📸'
                };
                fallbackIcon = iconMap[label] || '🔗';
            }
            cardContent = `<span class="link-card-fallback">${fallbackIcon}</span>`;
        }



        linkCard.innerHTML = cardContent;



        return linkCard;
    }



    // Create project card element
    function createProjectCard(title, description, icon, url) {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';


        projectCard.innerHTML = `
            <div class="project-glow"></div>
            <div class="project-icon">${icon || '🚀'}</div>
            <h3 class="project-title">${title}</h3>
            <p class="project-description">${description}</p>
            <a href="${url || '#'}" class="project-link" target="_blank">
                <span>View Project</span>
                <span class="project-arrow">→</span>
            </a>
        `;



        return projectCard;
    }



    // Initialize animations for dynamically loaded content
    function initAnimations() {
        // Enhanced click ripple effect with glow
        const linkCards = document.querySelectorAll('.link-card');


        linkCards.forEach(card => {
            card.addEventListener('click', function(e) {
                // Create ripple effect
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height) * 1.5;
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;


                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');


                this.appendChild(ripple);


                setTimeout(() => {
                    ripple.remove();
                }, 800);
            });
        });



        // Mouse move parallax effect for avatar
        const avatar = document.querySelector('.avatar:not(.avatar-fallback)') || document.getElementById('avatar-img') || document.querySelector('.avatar');
        const avatarContainer = document.querySelector('.avatar-container');


        if (avatarContainer && avatar) {
            avatarContainer.addEventListener('mousemove', (e) => {
                const rect = avatarContainer.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const moveX = (x - centerX) / 15;
                const moveY = (y - centerY) / 15;


                avatar.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
            });


            avatarContainer.addEventListener('mouseleave', () => {
                avatar.style.transform = 'translate(0, 0) scale(1)';
            });
        }



        // Enhanced scroll animations
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -80px 0px'
        };



        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0) scale(1)';
                    }, index * 100);
                }
            });
        }, observerOptions);



        // Observe project cards with stagger
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px) scale(0.95)';
            card.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(card);
        });



        // Smooth page load animation
        window.addEventListener('load', () => {
            document.body.style.opacity = '1';
        });



        // Add floating animation to project icons
        projectCards.forEach((card, index) => {
            const icon = card.querySelector('.project-icon');
            if (icon) {
                setInterval(() => {
                    icon.style.transform = `translateY(${Math.sin(Date.now() / 1000 + index) * 3}px)`;
                }, 50);
            }
        });
    }



    // Call initAnimations
    initAnimations();
});



// Enhanced CSS for ripple and glow effects
const style = document.createElement('style');
style.textContent = `
    .link-card {
        position: relative;
        overflow: hidden;
    }


    .ripple {
        position: absolute;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(99, 102, 241, 0.4), rgba(139, 92, 246, 0.2));
        transform: scale(0);
        animation: ripple-animation 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
        filter: blur(10px);
    }


    @keyframes ripple-animation {
        0% {
            transform: scale(0);
            opacity: 0.8;
        }
        50% {
            opacity: 0.4;
        }
        100% {
            transform: scale(4);
            opacity: 0;
        }
    }



    .project-icon {
        transition: transform 0.3s ease !important;
    }

    .icon-box {
        position: relative;
        overflow: hidden;
    }

    .icon-box:hover {
        transform: scale(1.1);
        background-color: rgba(255,255,255,0.2) !important;
    }
`;
document.head.appendChild(style);



// Smooth scrolling enhancement
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});



// YouTube API
let youtubePlayer = null;
let isYouTube = false;
let pendingVideoId = null;



function onYouTubeIframeAPIReady() {
    // YouTube API is ready - create player if we have a pending video
    if (pendingVideoId) {
        const autoplay = window.pendingAutoplay || false;
        createYouTubePlayer(pendingVideoId, autoplay);
    }
}



function createYouTubePlayer(videoId, autoplay = false) {
    const container = document.getElementById('youtube-player-container');
    if (!container) return;


    container.style.display = 'block';


    try {
        youtubePlayer = new YT.Player('youtube-player-container', {
            height: '0',
            width: '0',
            videoId: videoId,
            playerVars: {
                'autoplay': autoplay ? 1 : 0,
                'controls': 0,
                'disablekb': 1,
                'fs': 0,
                'iv_load_policy': 3,
                'modestbranding': 1,
                'playsinline': 1,
                'rel': 0,
                'showinfo': 0,
                'loop': 1,
                'playlist': videoId
            },
            events: {
                'onReady': function(event) {
                    onPlayerReady(event);
                    if (autoplay) {
                        // Try to play after a short delay (browsers may block)
                        setTimeout(() => {
                            try {
                                event.target.playVideo();
                            } catch (e) {
                                console.log('YouTube autoplay blocked by browser. User interaction required.');
                            }
                        }, 500);
                    }
                },
                'onStateChange': onPlayerStateChange
            }
        });
    } catch (e) {
        console.error('Error creating YouTube player:', e);
    }
}



function loadYouTubeAudio(videoId, autoplay = false) {
    isYouTube = true;


    if (typeof YT !== 'undefined' && YT.Player) {
        // API is ready, create player
        createYouTubePlayer(videoId, autoplay);


        // Set initial volume after player is ready
        setTimeout(() => {
            if (youtubePlayer) {
                const savedVolume = localStorage.getItem('audioVolume');
                const volume = savedVolume ? parseInt(savedVolume) : 50;
                youtubePlayer.setVolume(volume);
                const volumeSlider = document.getElementById('volume-slider');
                if (volumeSlider) volumeSlider.value = volume;
            }
        }, 2000);
    } else {
        // API not ready yet, store video ID and wait
        pendingVideoId = videoId;
        window.pendingAutoplay = autoplay;
    }
}



function onPlayerReady(event) {
    // Player is ready - set initial volume
    const savedVolume = localStorage.getItem('audioVolume');
    if (savedVolume) {
        youtubePlayer.setVolume(parseInt(savedVolume));
        const volumeSlider = document.getElementById('volume-slider');
        if (volumeSlider) volumeSlider.value = savedVolume;
    }
}



function onPlayerStateChange(event) {
    const playIcon = document.getElementById('audio-play-icon');
    const pauseIcon = document.getElementById('audio-pause-icon');


    if (!playIcon || !pauseIcon) return;


    if (event.data === YT.PlayerState.PLAYING) {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'inline';
    } else {
        playIcon.style.display = 'inline';
        pauseIcon.style.display = 'none';
    }
}



// Make sure YouTube API callback is set
window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;



// Audio player controls
document.addEventListener('DOMContentLoaded', function() {
    const audioToggle = document.getElementById('audio-toggle');
    const backgroundAudio = document.getElementById('background-audio');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeDown = document.getElementById('volume-down');
    const volumeUp = document.getElementById('volume-up');
    const playIcon = document.getElementById('audio-play-icon');
    const pauseIcon = document.getElementById('audio-pause-icon');


    // ===== AUTOPLAY WITH MUTED TRICK =====
    if (backgroundAudio && !isYouTube) {
        // Muted autoplay (browsers allow this)
        backgroundAudio.muted = true;
        backgroundAudio.play().then(() => {
            // Playback started, now unmute
            backgroundAudio.muted = false;
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'inline';
            console.log('Audio autoplay successful!');
        }).catch(e => {
            console.log('Autoplay failed, waiting for user interaction:', e);
            backgroundAudio.muted = false;
        });
    }


    // YouTube autoplay unmute
    if (isYouTube && youtubePlayer) {
        setTimeout(() => {
            try {
                youtubePlayer.unMute();
                console.log('YouTube unmuted');
            } catch (e) {
                console.log('YouTube unmute failed:', e);
            }
        }, 1000);
    }


    // Toggle play/pause
    if (audioToggle) {
        audioToggle.addEventListener('click', function() {
            if (isYouTube && youtubePlayer) {
                // YouTube player
                if (youtubePlayer.getPlayerState() === YT.PlayerState.PLAYING) {
                    youtubePlayer.pauseVideo();
                } else {
                    youtubePlayer.playVideo();
                }
            } else if (backgroundAudio) {
                // Regular audio file
                if (backgroundAudio.paused) {
                    backgroundAudio.play().catch(e => {
                        console.error('Error playing audio:', e);
                    });
                    playIcon.style.display = 'none';
                    pauseIcon.style.display = 'inline';
                } else {
                    backgroundAudio.pause();
                    playIcon.style.display = 'inline';
                    pauseIcon.style.display = 'none';
                }
            }
        });



        // Update icon for regular audio
        if (backgroundAudio && !isYouTube) {
            backgroundAudio.addEventListener('play', function() {
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'inline';
            });



            backgroundAudio.addEventListener('pause', function() {
                playIcon.style.display = 'inline';
                pauseIcon.style.display = 'none';
            });
        }
    }



    // Volume slider
    if (volumeSlider) {
        volumeSlider.addEventListener('input', function() {
            const volume = parseInt(this.value);


            if (isYouTube && youtubePlayer) {
                youtubePlayer.setVolume(volume);
            } else if (backgroundAudio) {
                backgroundAudio.volume = volume / 100;
            }


            localStorage.setItem('audioVolume', this.value);
        });
    }



    // Volume buttons
    if (volumeDown && volumeSlider) {
        volumeDown.addEventListener('click', function() {
            let currentVolume = parseInt(volumeSlider.value);
            let newVolume = Math.max(0, currentVolume - 10);
            volumeSlider.value = newVolume;


            if (isYouTube && youtubePlayer) {
                youtubePlayer.setVolume(newVolume);
            } else if (backgroundAudio) {
                backgroundAudio.volume = newVolume / 100;
            }


            localStorage.setItem('audioVolume', newVolume);
        });
    }



    if (volumeUp && volumeSlider) {
        volumeUp.addEventListener('click', function() {
            let currentVolume = parseInt(volumeSlider.value);
            let newVolume = Math.min(100, currentVolume + 10);
            volumeSlider.value = newVolume;


            if (isYouTube && youtubePlayer) {
                youtubePlayer.setVolume(newVolume);
            } else if (backgroundAudio) {
                backgroundAudio.volume = newVolume / 100;
            }


            localStorage.setItem('audioVolume', newVolume);
        });
    }
});