// Settings page functionality - GLOBAL PROFILE SYNC


// Default password - CHANGE THIS!
const DEFAULT_PASSWORD = 'sweetc79';


// Check if password is set in localStorage, otherwise use default
function getPassword() {
    const savedPassword = localStorage.getItem('adminPassword');
    return savedPassword || DEFAULT_PASSWORD;
}


// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('Settings page loaded!');
    
    const loginScreen = document.getElementById('login-screen');
    const settingsScreen = document.getElementById('settings-screen');
    const passwordInput = document.getElementById('password-input');
    const loginBtn = document.getElementById('login-btn');
    const loginError = document.getElementById('login-error');
    const saveBtn = document.getElementById('save-btn');
    const saveMessage = document.getElementById('save-message');


    console.log('Elements found:', {
        loginScreen: !!loginScreen,
        settingsScreen: !!settingsScreen,
        passwordInput: !!passwordInput,
        loginBtn: !!loginBtn,
        loginError: !!loginError
    });


    // Check if already logged in (session)
    if (sessionStorage.getItem('settingsAuthenticated') === 'true') {
        console.log('Already authenticated, showing settings');
        showSettings();
    }


    function showSettings() {
        console.log('showSettings called!');
        if (loginScreen) {
            loginScreen.style.display = 'none';
        }
        if (settingsScreen) {
            settingsScreen.style.display = 'block';
            loadSettings();
        }
    }


    function handleLogin() {
        console.log('handleLogin called!'); // Debug
        
        if (!passwordInput) {
            console.error('Password input not found!');
            return;
        }
        
        const enteredPassword = passwordInput.value.trim();
        const correctPassword = getPassword();


        console.log('Attempting login...', 'Entered:', enteredPassword, 'Expected:', correctPassword); // Debug


        // Add loading state
        if (loginBtn) {
            loginBtn.disabled = true;
            loginBtn.textContent = 'Checking...';
        }


        if (!enteredPassword) {
            if (loginError) {
                loginError.textContent = 'Please enter a password.';
                loginError.style.color = 'var(--error-color)';
            }
            if (loginBtn) {
                loginBtn.disabled = false;
                loginBtn.textContent = 'Access Settings';
            }
            return;
        }


        // Small delay for visual feedback
        setTimeout(() => {
            if (enteredPassword === correctPassword) {
                console.log('Password correct!');
                sessionStorage.setItem('settingsAuthenticated', 'true');
                showSettings();
            } else {
                console.log('Password incorrect!');
                if (loginError) {
                    loginError.textContent = 'Incorrect password. Please try again.';
                    loginError.style.color = 'var(--error-color)';
                }
                if (passwordInput) {
                    passwordInput.value = '';
                    passwordInput.focus();
                }
                if (loginBtn) {
                    loginBtn.disabled = false;
                    loginBtn.textContent = 'Access Settings';
                }
            }
        }, 100);
    }


    // Login functionality - set up event listeners
    const loginForm = document.getElementById('login-form');
    
    console.log('Setting up event listeners...');
    
    if (loginForm) {
        console.log('Found login form');
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted');
            handleLogin();
        });
    } else {
        console.error('Login form not found!');
    }
    
    if (loginBtn) {
        console.log('Found login button');
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Button clicked!');
            handleLogin();
        });
    } else {
        console.error('Login button not found!');
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                console.log('Enter key pressed');
                handleLogin();
            }
        });
        
        // Focus on load
        passwordInput.focus();
    }


    // Load settings from profile.json (global) + localStorage (local overrides)
    async function loadSettings() {
        let profileData = {};
        
        // First load from profile.json (global default)
        try {
            const response = await fetch('profile.json');
            profileData = await response.json();
            console.log('Loaded profile.json:', profileData);
        } catch (err) {
            console.warn('Could not load profile.json, using localStorage fallback:', err);
        }
        
        // Then override with localStorage if it exists (local edits)
        const localData = localStorage.getItem('profileData');
        if (localData) {
            try {
                const parsedLocal = JSON.parse(localData);
                profileData = { ...profileData, ...parsedLocal };
                console.log('Merged with localStorage:', profileData);
            } catch (err) {
                console.error('Failed to parse localStorage profileData:', err);
            }
        }

        // Load avatar
        document.getElementById('avatar-url').value = profileData.avatar || '';
        
        // Load info
        document.getElementById('username').value = profileData.name || 'Your Name';
        document.getElementById('bio').value = profileData.bio || '';
        document.getElementById('location').value = profileData.location || '📍 Location';
        
        // Load audio
        document.getElementById('audio-url').value = profileData.audioUrl || '';
        
        // Load theme
        const accentColor = profileData.accentColor || '#6366f1';
        document.getElementById('accent-color').value = accentColor;
        document.getElementById('accent-color-text').value = accentColor;


        // Load links
        loadLinks(profileData.links || []);
        
        // Load projects
        loadProjects(profileData.projects || []);
    }


    // Load links into UI
    function loadLinks(links) {
        const container = document.getElementById('links-container');
        container.innerHTML = '';


        if (links.length === 0) {
            // Add default links
            addLinkItem('GitHub', 'https://github.com/', '');
            addLinkItem('Discord', '#', '');
            addLinkItem('Roblox', '#', '');
        } else {
            links.forEach(link => {
                addLinkItem(link.label, link.url, link.imageUrl || '', true);
            });
        }
    }


    // Load projects into UI
    function loadProjects(projects) {
        const container = document.getElementById('projects-container');
        container.innerHTML = '';


        if (projects.length === 0) {
            // Add default projects
            addProjectItem('Project One', 'Brief description of your project here.', '🚀', '#');
            addProjectItem('Project Two', 'Brief description of your project here.', '💡', '#');
            addProjectItem('Project Three', 'Brief description of your project here.', '🎨', '#');
        } else {
            projects.forEach(project => {
                addProjectItem(project.title, project.description, project.icon, project.url, true);
            });
        }
    }


    // Add link item to UI
    function addLinkItem(label = '', url = '#', imageUrl = '', skipValidation = false) {
        const container = document.getElementById('links-container');
        const linkItem = document.createElement('div');
        linkItem.className = 'link-item';
        
        const imageInput = document.createElement('input');
        imageInput.type = 'text';
        imageInput.className = 'input-field link-image-input';
        imageInput.placeholder = 'Image URL';
        imageInput.value = imageUrl;
        imageInput.style.flex = '0 0 200px';


        const labelInput = document.createElement('input');
        labelInput.type = 'text';
        labelInput.className = 'input-field link-label-input';
        labelInput.placeholder = 'Label';
        labelInput.value = label;


        const urlInput = document.createElement('input');
        urlInput.type = 'text';
        urlInput.className = 'input-field link-url-input';
        urlInput.placeholder = 'URL';
        urlInput.value = url;


        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.onclick = () => linkItem.remove();


        linkItem.appendChild(imageInput);
        linkItem.appendChild(labelInput);
        linkItem.appendChild(urlInput);
        linkItem.appendChild(deleteBtn);


        // Add validation
        if (!skipValidation) {
            urlInput.addEventListener('blur', validateUrl);
        }


        container.appendChild(linkItem);
    }


    // Add project item to UI
    function addProjectItem(title = '', description = '', icon = '🚀', url = '#', skipValidation = false) {
        const container = document.getElementById('projects-container');
        const projectItem = document.createElement('div');
        projectItem.className = 'project-item';
        
        const iconInput = document.createElement('input');
        iconInput.type = 'text';
        iconInput.className = 'input-field';
        iconInput.placeholder = 'Icon';
        iconInput.value = icon;
        iconInput.style.flex = '0 0 80px';


        const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.className = 'input-field project-label-input';
        titleInput.placeholder = 'Title';
        titleInput.value = title;


        const descInput = document.createElement('input');
        descInput.type = 'text';
        descInput.className = 'input-field project-desc-input';
        descInput.placeholder = 'Description';
        descInput.value = description;


        const urlInput = document.createElement('input');
        urlInput.type = 'text';
        urlInput.className = 'input-field';
        urlInput.placeholder = 'Project URL';
        urlInput.value = url;
        urlInput.style.flex = '0 0 200px';


        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.onclick = () => projectItem.remove();


        projectItem.appendChild(iconInput);
        projectItem.appendChild(titleInput);
        projectItem.appendChild(descInput);
        projectItem.appendChild(urlInput);
        projectItem.appendChild(deleteBtn);


        if (!skipValidation) {
            urlInput.addEventListener('blur', validateUrl);
        }


        container.appendChild(projectItem);
    }


    // Validate URL (allow empty values)
    function validateUrl(e) {
        const input = e.target;
        const url = input.value.trim();
        const parent = input.parentElement;


        // Remove existing error
        const existingError = parent.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }


        // Only validate URLs that start with http:// or https://
        // Allow everything else (empty, '#', partial URLs, etc.)
        if (url && url !== '#' && (url.startsWith('http://') || url.startsWith('https://'))) {
            try {
                new URL(url);
            } catch {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.innerHTML = '<span class="error-icon">⚠️</span> Please enter a valid URL.';
                parent.appendChild(errorDiv);
                return false;
            }
        }


        // Empty, '#', or non-HTTP URLs are all valid (optional fields)
        return true;
    }


    // Setup settings screen event listeners (only when needed)
    function setupSettingsListeners() {
        // Add link button
        const addLinkBtn = document.getElementById('add-link-btn');
        if (addLinkBtn) {
            addLinkBtn.addEventListener('click', () => {
                addLinkItem();
            });
        }


        // Add project button
        const addProjectBtn = document.getElementById('add-project-btn');
        if (addProjectBtn) {
            addProjectBtn.addEventListener('click', () => {
                addProjectItem();
            });
        }


        // Color picker sync
        const colorInput = document.getElementById('accent-color');
        const colorTextInput = document.getElementById('accent-color-text');


        if (colorInput && colorTextInput) {
            colorInput.addEventListener('input', (e) => {
                colorTextInput.value = e.target.value;
            });


            colorTextInput.addEventListener('input', (e) => {
                const value = e.target.value;
                if (/^#[0-9A-F]{6}$/i.test(value)) {
                    colorInput.value = value;
                }
            });
        }


        // Save functionality - UPDATED TO USE profile.json FORMAT
        if (saveBtn) {
            saveBtn.addEventListener('click', function() {
                // Collect all data in profile.json format
                const profileData = {
                    name: document.getElementById('username').value.trim(),
                    bio: document.getElementById('bio').value.trim(),
                    location: document.getElementById('location').value.trim(),
                    avatar: document.getElementById('avatar-url').value.trim(),
                    audioUrl: document.getElementById('audio-url').value.trim(),
                    accentColor: document.getElementById('accent-color').value,
                    links: [],
                    projects: []
                };


                // Collect links (allow empty fields - only add if at least label exists)
                const linkItems = document.querySelectorAll('.link-item');
                linkItems.forEach(item => {
                    const imageUrl = item.querySelector('.link-image-input').value.trim();
                    const label = item.querySelector('.link-label-input').value.trim();
                    const url = item.querySelector('.link-url-input').value.trim();
                    if (label) {
                        // Allow empty URL (will show as '#' on profile)
                        profileData.links.push({ label, url: url || '#', imageUrl: imageUrl || '' });
                    }
                });


                // Collect projects (allow empty fields)
                const projectItems = document.querySelectorAll('.project-item');
                projectItems.forEach(item => {
                    const icon = item.querySelector('input').value.trim();
                    const title = item.querySelector('.project-label-input').value.trim();
                    const description = item.querySelector('.project-desc-input').value.trim();
                    const url = item.querySelectorAll('input')[3].value.trim();
                    // Add project if title exists, or if it's not completely empty
                    if (title || icon || description || url) {
                        profileData.projects.push({ 
                            icon: icon || '🚀', 
                            title: title || 'Untitled Project', 
                            description: description || '', 
                            url: url || '#' 
                        });
                    }
                });


                // Validate URLs (only validate if it looks like a URL)
                let hasErrors = false;
                document.querySelectorAll('.link-item, .project-item').forEach(item => {
                    const urlInputs = item.querySelectorAll('input[type="text"]');
                    urlInputs.forEach(input => {
                        const value = input.value.trim();
                        // Only validate URLs that start with http:// or https://
                        // Allow everything else (empty, '#', partial URLs, etc.)
                        if (value && value !== '#' && (value.startsWith('http://') || value.startsWith('https://'))) {
                            try {
                                new URL(value);
                            } catch {
                                hasErrors = true;
                            }
                        }
                    });
                });


                if (hasErrors) {
                    if (saveMessage) {
                        saveMessage.textContent = 'Please fix URL errors before saving.';
                        saveMessage.className = 'save-message error';
                    }
                    return;
                }


                // Save to localStorage (for local editing)
                localStorage.setItem('profileData', JSON.stringify(profileData));
                
                console.log('Saved profile data:', profileData); // Debug

                // Display instructions for updating profile.json
                if (saveMessage) {
                    saveMessage.innerHTML = '✓ Settings saved locally! <br><strong>To sync globally:</strong> Copy the JSON below to your <code>profile.json</code> file in your GitHub repo, then commit & push.<br><br><code style="background: #222; padding: 10px; display: block; margin-top: 10px; border-radius: 5px; overflow-x: auto; white-space: pre-wrap; word-break: break-all;">' + 
                        JSON.stringify(profileData, null, 2).replace(/</g, '&lt;').replace(/>/g, '&gt;') + 
                        '</code>';
                    saveMessage.className = 'save-message success';
                    
                    // Copy to clipboard button
                    const copyBtn = document.createElement('button');
                    copyBtn.textContent = 'Copy JSON';
                    copyBtn.style.marginTop = '10px';
                    copyBtn.style.padding = '8px 16px';
                    copyBtn.style.backgroundColor = 'var(--accent)';
                    copyBtn.style.color = 'white';
                    copyBtn.style.border = 'none';
                    copyBtn.style.borderRadius = '5px';
                    copyBtn.style.cursor = 'pointer';
                    copyBtn.onclick = () => {
                        navigator.clipboard.writeText(JSON.stringify(profileData, null, 2));
                        copyBtn.textContent = 'Copied!';
                        setTimeout(() => {
                            copyBtn.textContent = 'Copy JSON';
                        }, 2000);
                    };
                    saveMessage.appendChild(copyBtn);
                }
            });
        }
    }


    // Update showSettings to setup listeners
    const originalShowSettings = showSettings;
    showSettings = function() {
        originalShowSettings();
        setupSettingsListeners();
    };


    // Setup listeners if already authenticated
    if (sessionStorage.getItem('settingsAuthenticated') === 'true') {
        // Delay to ensure DOM is ready
        setTimeout(() => {
            setupSettingsListeners();
        }, 100);
    }
});