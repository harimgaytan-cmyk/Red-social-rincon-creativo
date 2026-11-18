// Archivo: mural RS UX.js
// Funcionalidad completa para el Mural de Rincón Creativo

class RinconCreativoMural {
    constructor() {
        this.currentUser = null;
        this.posts = [];
        this.following = [];
        this.currentSection = 'muro';
        this.currentImageData = null;
        this.allUsers = [];
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.checkSession();
            this.initializeElements();
            this.bindEvents();
            this.loadUserData();
            this.loadPosts();
            this.loadFollowing();
            this.loadAllUsers();
            this.setupEmoticonsPanel();
            this.setupPhotoUpload();
            this.setupBackgroundUpload();
            this.setupRGBColors();
            this.updateUI();
        });
    }

    checkSession() {
        const session = sessionStorage.getItem('rincon_session');
        
        if (!session) {
            this.showMessage('🔒 Sesión no encontrada, redirigiendo...', 'error');
            setTimeout(() => {
                window.location.href = 'RS UX.html';
            }, 2000);
            return;
        }
        
        try {
            const sessionData = JSON.parse(session);
            this.currentUser = sessionData;
            console.log('Sesión cargada:', this.currentUser.username);
        } catch (e) {
            console.error('Error al cargar sesión', e);
            window.location.href = 'RS UX.html';
        }
    }

    initializeElements() {
        this.userNicknameHeaderEl = document.getElementById('userNicknameHeader');
        this.userUsernameHeaderEl = document.getElementById('userUsernameHeader');
        this.userFotoHeader = document.getElementById('userFotoHeader');
        this.userFotoImagen = document.getElementById('userFotoImagen');
        this.userFotoEmoji = document.getElementById('userFotoEmoji');
        
        this.perfilNombreEl = document.getElementById('perfilNombre');
        this.perfilNicknameEl = document.getElementById('perfilNickname');
        this.perfilUsernameEl = document.getElementById('perfilUsername');
        this.perfilAvatarCuadrado = document.getElementById('perfilAvatarCuadrado');
        this.perfilImagen = document.getElementById('perfilImagen');
        this.perfilAvatarEmoji = document.getElementById('perfilAvatarEmoji');
        this.cambiarFotoBtn = document.getElementById('cambiarFotoBtn');
        this.uploadFoto = document.getElementById('uploadFoto');
        
        this.perfilFondoFull = document.getElementById('perfilFondoFull');
        this.cambiarFondoBtn = document.getElementById('cambiarFondoBtn');
        this.uploadFondo = document.getElementById('uploadFondo');
        this.eliminarFondoBtn = document.getElementById('eliminarFondoBtn');
        
        this.borderColorPicker = document.getElementById('borderColorPicker');
        this.bgColorPicker = document.getElementById('bgColorPicker');
        this.neonColorPicker = document.getElementById('neonColorPicker');
        this.resetColorsBtn = document.getElementById('resetColorsBtn');
        this.temaOptions = document.querySelectorAll('.tema-option');
        
        this.borderColorPreview = document.getElementById('borderColorPreview');
        this.bgColorPreview = document.getElementById('bgColorPreview');
        this.neonColorPreview = document.getElementById('neonColorPreview');
        
        this.uploadImageBtn = document.getElementById('uploadImageBtn');
        this.postImageInput = document.getElementById('postImageInput');
        this.imagePreviewContainer = document.getElementById('imagePreviewContainer');
        this.imagePreview = document.getElementById('imagePreview');
        this.removeImageBtn = document.getElementById('removeImageBtn');
        
        this.searchInput = document.getElementById('searchInput');
        this.performSearchBtn = document.getElementById('performSearchBtn');
        this.searchResults = document.getElementById('searchResults');
        
        this.userPostsFeedEl = document.getElementById('userPostsFeed');
        this.amigosStatBtn = document.getElementById('amigosStatBtn');
        this.postsStatBtn = document.getElementById('postsStatBtn');
        
        this.joinDateEl = document.getElementById('joinDate');
        this.bioTextEl = document.getElementById('bioText');
        this.postCountEl = document.getElementById('postCount');
        this.friendsCountEl = document.getElementById('friendsCount');
        this.likesCountEl = document.getElementById('likesCount');
        this.postsFeedEl = document.getElementById('postsFeed');
        this.postContentEl = document.getElementById('postContent');
        this.publishBtn = document.getElementById('publishBtn');
        this.logoutBtn = document.getElementById('logoutBtn');
        this.editBioBtn = document.getElementById('editBioBtn');
        this.addFriendBtn = document.getElementById('addFriendBtn');
        this.estadoOnlineEl = document.getElementById('estadoOnline');
        
        this.navBtns = document.querySelectorAll('.nav-btn');
        this.sections = {
            muro: document.getElementById('muro'),
            populares: document.getElementById('populares'),
            amigos: document.getElementById('amigos'),
            buscar: document.getElementById('buscar'),
            miperfil: document.getElementById('miperfil')
        };
    }

    bindEvents() {
        if (this.publishBtn) {
            this.publishBtn.addEventListener('click', () => this.publishPost());
        }
        
        if (this.logoutBtn) {
            this.logoutBtn.addEventListener('click', () => this.logout());
        }
        
        if (this.editBioBtn) {
            this.editBioBtn.addEventListener('click', () => this.editBio());
        }
        
        this.navBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = btn.getAttribute('data-section');
                this.changeSection(section);
            });
        });
        
        if (this.addFriendBtn) {
            this.addFriendBtn.addEventListener('click', () => this.addFriend());
        }
        
        if (this.amigosStatBtn) {
            this.amigosStatBtn.addEventListener('click', () => {
                this.changeSection('amigos');
            });
        }
        
        if (this.postsStatBtn) {
            this.postsStatBtn.addEventListener('click', () => {
                const userPostsSection = document.getElementById('userPostsFeed');
                if (userPostsSection) {
                    userPostsSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
        
        if (this.postContentEl) {
            this.postContentEl.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.key === 'Enter') {
                    this.publishPost();
                }
            });
        }
        
        if (this.uploadImageBtn && this.postImageInput) {
            this.uploadImageBtn.addEventListener('click', () => {
                this.postImageInput.click();
            });
            
            this.postImageInput.addEventListener('change', (e) => {
                this.handleImageUpload(e);
            });
        }
        
        if (this.removeImageBtn) {
            this.removeImageBtn.addEventListener('click', () => {
                this.removeSelectedImage();
            });
        }
        
        if (this.performSearchBtn && this.searchInput) {
            this.performSearchBtn.addEventListener('click', () => {
                this.searchUsers();
            });
            
            this.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchUsers();
                }
            });
        }
    }

    setupBackgroundUpload() {
        if (this.cambiarFondoBtn && this.uploadFondo) {
            this.cambiarFondoBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.uploadFondo.click();
            });
            
            this.uploadFondo.addEventListener('change', (e) => {
                e.stopPropagation();
                const file = e.target.files[0];
                if (file && file.type.startsWith('image/')) {
                    if (file.size > 5 * 1024 * 1024) {
                        this.showMessage('La imagen es muy grande (máximo 5MB)', 'error');
                        return;
                    }
                    
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const imageData = event.target.result;
                        if (this.perfilFondoFull) {
                            this.perfilFondoFull.style.backgroundImage = `url('${imageData}')`;
                            this.perfilFondoFull.style.backgroundSize = 'cover';
                            this.perfilFondoFull.style.backgroundPosition = 'center';
                        }
                        localStorage.setItem(`fondoPerfil_${this.currentUser.username}`, imageData);
                        this.showMessage('🖼️ ¡Fondo de perfil actualizado!', 'success');
                    };
                    reader.readAsDataURL(file);
                } else {
                    this.showMessage('Selecciona una imagen válida (JPG, PNG, GIF)', 'error');
                }
            });
        }
        
        if (this.eliminarFondoBtn) {
            this.eliminarFondoBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.perfilFondoFull) {
                    this.perfilFondoFull.style.backgroundImage = '';
                }
                localStorage.removeItem(`fondoPerfil_${this.currentUser.username}`);
                this.showMessage('Fondo de perfil eliminado', 'info');
            });
        }
    }

    loadBackground() {
        if (!this.currentUser) return;
        const savedBackground = localStorage.getItem(`fondoPerfil_${this.currentUser.username}`);
        if (savedBackground && this.perfilFondoFull) {
            this.perfilFondoFull.style.backgroundImage = `url('${savedBackground}')`;
            this.perfilFondoFull.style.backgroundSize = 'cover';
            this.perfilFondoFull.style.backgroundPosition = 'center';
        } else if (this.perfilFondoFull) {
            this.perfilFondoFull.style.backgroundImage = '';
        }
    }

    setupRGBColors() {
        if (!this.borderColorPicker) return;
        
        const savedBorder = localStorage.getItem(`perfilBorder_${this.currentUser.username}`);
        const savedBg = localStorage.getItem(`perfilBg_${this.currentUser.username}`);
        const savedNeon = localStorage.getItem(`perfilNeon_${this.currentUser.username}`);
        
        if (savedBorder && savedBg && savedNeon) {
            this.borderColorPicker.value = savedBorder;
            this.bgColorPicker.value = savedBg;
            this.neonColorPicker.value = savedNeon;
            this.updateColorPreviews();
            this.applyRGBColors(savedBorder, savedBg, savedNeon);
        } else {
            this.updateColorPreviews();
            this.applyRGBColors('#00cc44', '#1a1a1a', '#00ff66');
        }
        
        this.borderColorPicker.addEventListener('input', (e) => {
            this.updateColorPreviews();
            this.applyRGBColors(e.target.value, this.bgColorPicker.value, this.neonColorPicker.value);
            this.saveRGBColors();
        });
        
        this.bgColorPicker.addEventListener('input', (e) => {
            this.updateColorPreviews();
            this.applyRGBColors(this.borderColorPicker.value, e.target.value, this.neonColorPicker.value);
            this.saveRGBColors();
        });
        
        this.neonColorPicker.addEventListener('input', (e) => {
            this.updateColorPreviews();
            this.applyRGBColors(this.borderColorPicker.value, this.bgColorPicker.value, e.target.value);
            this.saveRGBColors();
        });
        
        if (this.resetColorsBtn) {
            this.resetColorsBtn.addEventListener('click', () => {
                this.borderColorPicker.value = '#00cc44';
                this.bgColorPicker.value = '#1a1a1a';
                this.neonColorPicker.value = '#00ff66';
                this.updateColorPreviews();
                this.applyRGBColors('#00cc44', '#1a1a1a', '#00ff66');
                this.saveRGBColors();
                this.showMessage('🎨 Colores reiniciados!', 'success');
            });
        }
        
        this.temaOptions.forEach(option => {
            option.addEventListener('click', () => {
                const border = option.getAttribute('data-border');
                const bg = option.getAttribute('data-bg');
                const neon = option.getAttribute('data-neon');
                if (border && bg && neon) {
                    this.borderColorPicker.value = border;
                    this.bgColorPicker.value = bg;
                    this.neonColorPicker.value = neon;
                    this.updateColorPreviews();
                    this.applyRGBColors(border, bg, neon);
                    this.saveRGBColors();
                    this.showMessage(`🎨 Tema aplicado!`, 'success');
                }
            });
        });
    }

    updateColorPreviews() {
        if (this.borderColorPreview) {
            this.borderColorPreview.style.background = this.borderColorPicker.value;
        }
        if (this.bgColorPreview) {
            this.bgColorPreview.style.background = this.bgColorPicker.value;
        }
        if (this.neonColorPreview) {
            this.neonColorPreview.style.background = this.neonColorPicker.value;
        }
    }

    saveRGBColors() {
        localStorage.setItem(`perfilBorder_${this.currentUser.username}`, this.borderColorPicker.value);
        localStorage.setItem(`perfilBg_${this.currentUser.username}`, this.bgColorPicker.value);
        localStorage.setItem(`perfilNeon_${this.currentUser.username}`, this.neonColorPicker.value);
    }

    applyRGBColors(borderColor, bgColor, neonColor) {
        const perfilCard = document.getElementById('perfilCard');
        const perfilPostsCard = document.getElementById('perfilPostsCard');
        const perfilAvatar = document.querySelector('.perfil-avatar-cuadrado');
        const bioElement = document.querySelector('.bio');
        const perfilH2 = document.querySelector('.perfil-info h2');
        
        if (!perfilCard) return;
        
        const textColor = this.getTextColor(bgColor);
        const bgLight = this.lightenColor(bgColor, 20);
        
        perfilCard.style.background = bgColor;
        perfilCard.style.borderColor = borderColor;
        
        const stats = perfilCard.querySelectorAll('.stat');
        stats.forEach(stat => {
            stat.style.background = `${borderColor}33`;
            stat.style.color = textColor;
        });
        
        const nicknames = perfilCard.querySelectorAll('.perfil-nickname, .perfil-username, .join-date');
        nicknames.forEach(el => {
            el.style.color = textColor;
        });
        
        if (perfilH2) {
            perfilH2.style.color = neonColor;
            perfilH2.style.textShadow = `0 0 8px ${neonColor}`;
        }
        
        if (bioElement) {
            bioElement.style.background = bgLight;
            bioElement.style.borderLeftColor = neonColor;
            bioElement.style.color = textColor;
        }
        
        if (perfilAvatar) {
            perfilAvatar.style.borderColor = borderColor;
            perfilAvatar.style.boxShadow = `0 0 20px ${neonColor}`;
        }
        
        if (perfilPostsCard) {
            perfilPostsCard.style.background = bgColor;
            perfilPostsCard.style.borderColor = borderColor;
            
            const postsTitle = perfilPostsCard.querySelector('h3');
            if (postsTitle) {
                postsTitle.style.color = neonColor;
                postsTitle.style.textShadow = `0 0 8px ${neonColor}`;
            }
            
            const postsCards = perfilPostsCard.querySelectorAll('.post-card');
            postsCards.forEach(card => {
                card.style.borderColor = borderColor;
            });
        }
        
        const userPosts = document.querySelectorAll('#userPostsFeed .post-card');
        userPosts.forEach(post => {
            post.style.borderColor = borderColor;
            const likeBtn = post.querySelector('.like-btn');
            const commentBtn = post.querySelector('.comment-btn');
            const shareBtn = post.querySelector('.share-btn');
            if (likeBtn && !likeBtn.classList.contains('liked')) {
                likeBtn.style.borderColor = borderColor;
                likeBtn.style.color = textColor;
            }
            if (commentBtn) {
                commentBtn.style.borderColor = borderColor;
                commentBtn.style.color = textColor;
            }
            if (shareBtn) {
                shareBtn.style.borderColor = borderColor;
                shareBtn.style.color = textColor;
            }
        });
    }

    getTextColor(hexColor) {
        let r, g, b;
        if (hexColor.startsWith('#')) {
            r = parseInt(hexColor.slice(1, 3), 16);
            g = parseInt(hexColor.slice(3, 5), 16);
            b = parseInt(hexColor.slice(5, 7), 16);
        } else {
            return '#ccffcc';
        }
        
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5 ? '#003300' : '#ccffcc';
    }

    lightenColor(hexColor, percent) {
        if (!hexColor.startsWith('#')) return hexColor;
        
        let r = parseInt(hexColor.slice(1, 3), 16);
        let g = parseInt(hexColor.slice(3, 5), 16);
        let b = parseInt(hexColor.slice(5, 7), 16);
        
        r = Math.min(255, Math.floor(r + (255 - r) * percent / 100));
        g = Math.min(255, Math.floor(g + (255 - g) * percent / 100));
        b = Math.min(255, Math.floor(b + (255 - b) * percent / 100));
        
        return `rgb(${r}, ${g}, ${b})`;
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            if (file.size > 5 * 1024 * 1024) {
                this.showMessage('La imagen es muy grande (máximo 5MB)', 'error');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                this.currentImageData = e.target.result;
                if (this.imagePreview && this.imagePreviewContainer) {
                    this.imagePreview.src = this.currentImageData;
                    this.imagePreviewContainer.style.display = 'inline-block';
                }
                this.showMessage('Imagen seleccionada! :-)', 'success');
            };
            reader.readAsDataURL(file);
        } else {
            this.showMessage('Selecciona un archivo de imagen válido', 'error');
        }
    }

    removeSelectedImage() {
        this.currentImageData = null;
        if (this.imagePreviewContainer) {
            this.imagePreviewContainer.style.display = 'none';
            this.imagePreview.src = '';
        }
        if (this.postImageInput) {
            this.postImageInput.value = '';
        }
        this.showMessage('Imagen eliminada', 'info');
    }

    loadUserData() {
        if (!this.currentUser) return;
        
        const username = this.currentUser.username;
        const userData = this.currentUser.userData;
        const nickname = userData.nickname || username;
        
        if (this.userNicknameHeaderEl) {
            this.userNicknameHeaderEl.textContent = `${nickname}`;
        }
        
        if (this.userUsernameHeaderEl) {
            this.userUsernameHeaderEl.textContent = `@${username}`;
        }
        
        const savedPhoto = localStorage.getItem(`fotoPerfil_${username}`);
        if (savedPhoto && this.userFotoImagen && this.userFotoHeader) {
            this.userFotoImagen.src = savedPhoto;
            this.userFotoHeader.classList.add('has-image');
        } else if (this.userFotoHeader) {
            this.userFotoHeader.classList.remove('has-image');
            if (this.userFotoEmoji) this.userFotoEmoji.textContent = '';
        }
        
        if (savedPhoto && this.perfilImagen && this.perfilAvatarCuadrado) {
            this.perfilImagen.src = savedPhoto;
            this.perfilAvatarCuadrado.classList.add('has-image');
        } else {
            if (this.perfilAvatarCuadrado) this.perfilAvatarCuadrado.classList.remove('has-image');
            if (this.perfilAvatarEmoji) this.perfilAvatarEmoji.textContent = '';
        }
        
        if (this.perfilNombreEl) {
            this.perfilNombreEl.textContent = nickname;
        }
        
        if (this.perfilNicknameEl) {
            this.perfilNicknameEl.textContent = nickname;
        }
        
        if (this.perfilUsernameEl) {
            this.perfilUsernameEl.textContent = `@${username}`;
        }
        
        if (this.joinDateEl) {
            this.joinDateEl.textContent = userData.joinDate || '2024-01-01';
        }
        
        if (this.bioTextEl) {
            const savedBio = localStorage.getItem(`bio_${username}`);
            if (savedBio) {
                this.bioTextEl.textContent = savedBio;
            }
        }
        
        this.loadBackground();
        this.setupRGBColors();
        this.updateStats();
    }

    updateOnlineCount() {
        const onlineCount = this.following.filter(f => f.status === 'online').length;
        if (this.estadoOnlineEl) {
            this.estadoOnlineEl.innerHTML = `<span class="punto-verde"></span> (: ${onlineCount} conectados`;
        }
    }

    loadAllUsers() {
        const users = JSON.parse(localStorage.getItem('rincon_creativo_users') || '{}');
        this.allUsers = Object.entries(users).map(([username, userData]) => ({
            username: username,
            nickname: userData.nickname || username,
            email: userData.email,
            joinDate: userData.joinDate,
            avatar: userData.avatar
        }));
    }

    searchUsers() {
        if (!this.searchInput || !this.searchResults) return;
        
        const query = this.searchInput.value.trim().toLowerCase();
        
        if (!query) {
            this.searchResults.innerHTML = '<p style="text-align: center; color: #88ff88;">:-/ Escribe un nombre para buscar</p>';
            return;
        }
        
        const currentUsername = this.currentUser?.username;
        
        const results = this.allUsers.filter(user => 
            (user.nickname.toLowerCase().includes(query) || 
            user.username.toLowerCase().includes(query))
        );
        
        if (results.length === 0) {
            this.searchResults.innerHTML = '<p style="text-align: center; color: #88ff88;">:-/ No se encontraron usuarios</p>';
            return;
        }
        
        this.searchResults.innerHTML = results.map(user => {
            const userPhoto = localStorage.getItem(`fotoPerfil_${user.username}`);
            const isFollowing = this.following.some(f => f.name === user.username);
            const isCurrentUser = user.username === currentUsername;
            
            let buttonHtml = '';
            if (isCurrentUser) {
                buttonHtml = '<span class="search-result-current-user">(Eres tú)</span>';
            } else if (isFollowing) {
                buttonHtml = '<span class="search-result-add-btn added">✓ Siguiendo</span>';
            } else {
                buttonHtml = `<button class="search-result-add-btn" data-username="${user.username}">+ Seguir</button>`;
            }
            
            return `
                <div class="search-result-item" data-username="${user.username}">
                    <div class="search-result-avatar" id="searchAvatar_${user.username}">
                        ${userPhoto ? `<img class="search-result-img" src="${userPhoto}" alt="Foto">` : ''}
                    </div>
                    <div class="search-result-info">
                        <div class="search-result-name">${this.escapeHtml(user.nickname)}</div>
                        <div class="search-result-username">@${user.username}</div>
                        <div class="search-result-stats">📅 Se unió: ${user.joinDate || '2024'}</div>
                    </div>
                    ${buttonHtml}
                </div>
            `;
        }).join('');
        
        results.forEach(user => {
            const userPhoto = localStorage.getItem(`fotoPerfil_${user.username}`);
            const container = document.getElementById(`searchAvatar_${user.username}`);
            if (container && userPhoto) {
                container.classList.add('has-image');
            }
        });
        
        document.querySelectorAll('.search-result-add-btn:not(.added)').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const username = btn.getAttribute('data-username');
                this.followUser(username);
                this.searchUsers();
            });
        });
    }

    setupPhotoUpload() {
        if (this.cambiarFotoBtn && this.uploadFoto) {
            this.cambiarFotoBtn.addEventListener('click', () => {
                this.uploadFoto.click();
            });
            
            this.uploadFoto.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file && file.type.startsWith('image/')) {
                    if (file.size > 2 * 1024 * 1024) {
                        this.showMessage('La imagen es muy grande (máximo 2MB)', 'error');
                        return;
                    }
                    
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const imageData = event.target.result;
                        
                        if (this.perfilImagen && this.perfilAvatarCuadrado) {
                            this.perfilImagen.src = imageData;
                            this.perfilAvatarCuadrado.classList.add('has-image');
                        }
                        
                        if (this.userFotoImagen && this.userFotoHeader) {
                            this.userFotoImagen.src = imageData;
                            this.userFotoHeader.classList.add('has-image');
                        }
                        
                        localStorage.setItem(`fotoPerfil_${this.currentUser.username}`, imageData);
                        this.renderPosts();
                        this.renderFriends();
                        this.renderPopularPosts();
                        this.renderUserPosts();
                        this.showMessage('📷 ¡Foto de perfil actualizada!', 'success');
                    };
                    reader.readAsDataURL(file);
                } else {
                    this.showMessage('Selecciona una imagen válida (JPG, PNG, GIF)', 'error');
                }
            });
        }
    }

    loadPosts() {
        const savedPosts = localStorage.getItem('rincon_posts');
        
        if (savedPosts) {
            this.posts = JSON.parse(savedPosts);
            console.log('✅ Posts cargados con sus likes y comentarios existentes');
        } else {
            this.posts = [
                {
                    id: 1,
                    author: 'chica_glitter',
                    authorNickname: 'Chica Glitter',
                    authorUsername: '@chica_glitter',
                    authorAvatar: '',
                    content: '(: Hola a todos! Me encanta este lugar tan creativo ♥',
                    image: null,
                    date: new Date(Date.now() - 3600000).toISOString(),
                    likes: 0,
                    comments: 0,
                    likedBy: []
                },
                {
                    id: 2,
                    author: 'chavo_retro',
                    authorNickname: 'Chavo Retro',
                    authorUsername: '@chavo_retro',
                    authorAvatar: '',
                    content: '*-* Alguien para jugar juegos retro? :D',
                    image: null,
                    date: new Date(Date.now() - 7200000).toISOString(),
                    likes: 0,
                    comments: 0,
                    likedBy: []
                },
                {
                    id: 3,
                    author: 'creativo_master',
                    authorNickname: 'Creative Master',
                    authorUsername: '@creativo_master',
                    authorAvatar: '',
                    content: 'Compartan sus creaciones! :-) Me encanta ver arte original',
                    image: null,
                    date: new Date(Date.now() - 86400000).toISOString(),
                    likes: 0,
                    comments: 0,
                    likedBy: []
                }
            ];
            this.savePosts();
            console.log('✅ Nuevos posts creados (todos en 0)');
        }
        
        this.renderPosts();
    }

    savePosts() {
        localStorage.setItem('rincon_posts', JSON.stringify(this.posts));
    }

    renderPosts() {
        if (!this.postsFeedEl) return;
        
        if (this.posts.length === 0) {
            this.postsFeedEl.innerHTML = `
                <div class="info-card">
                    <p style="text-align: center; color: #88ff88;">
                        :-) No hay posts aún. ¡Sé el primero en publicar!
                    </p>
                </div>
            `;
            return;
        }
        
        const sortedPosts = [...this.posts].sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        );
        
        this.postsFeedEl.innerHTML = sortedPosts.map(post => {
            const hasLiked = post.likedBy && post.likedBy.includes(this.currentUser?.username);
            const likeButtonClass = hasLiked ? 'like-btn liked' : 'like-btn';
            const likeEmoticon = ':-)';
            
            const authorPhoto = localStorage.getItem(`fotoPerfil_${post.author}`);
            
            return `
            <div class="post-card" data-post-id="${post.id}">
                <div class="post-header">
                    <div class="post-author">
                        <div class="author-avatar-container" id="authorAvatar_${post.id}">
                            ${authorPhoto ? `<img class="author-avatar-img" src="${authorPhoto}" alt="Foto">` : ''}
                        </div>
                        <div class="author-info">
                            <div class="author-name">${post.authorNickname || post.author}</div>
                            <div class="author-username">${post.authorUsername || '@' + post.author}</div>
                        </div>
                    </div>
                    <div class="post-date">${this.formatDate(post.date)}</div>
                </div>
                <div class="post-content">${this.escapeHtml(post.content)}</div>
                ${post.image ? `
                    <div class="post-image" onclick="rinconMural.viewFullImage('${post.image}')">
                        <img src="${post.image}" alt="Imagen del post">
                    </div>
                ` : ''}
                <div class="post-footer">
                    <button class="${likeButtonClass}" data-id="${post.id}">
                        <span>${likeEmoticon}</span> ${post.likes || 0}
                    </button>
                    <button class="comment-btn" data-id="${post.id}">
                        <span>...</span> ${post.comments || 0}
                    </button>
                    <button class="share-btn" data-id="${post.id}" title="Copiar enlace (Ctrl+C)">
                        <span>[Ctrl+C]</span>
                    </button>
                </div>
            </div>
        `}).join('');
        
        sortedPosts.forEach(post => {
            const authorPhoto = localStorage.getItem(`fotoPerfil_${post.author}`);
            const container = document.getElementById(`authorAvatar_${post.id}`);
            if (container && authorPhoto) {
                container.classList.add('has-image');
            }
        });
        
        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const postId = parseInt(btn.getAttribute('data-id'));
                this.likePost(postId);
            });
        });
        
        document.querySelectorAll('.comment-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const postId = parseInt(btn.getAttribute('data-id'));
                this.showComments(postId);
            });
        });
        
        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const postId = parseInt(btn.getAttribute('data-id'));
                this.sharePost(postId);
            });
        });
    }

    renderPopularPosts() {
        const popularesListEl = document.getElementById('popularesList');
        if (!popularesListEl) return;
        
        const popularPosts = [...this.posts].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 10);
        
        if (popularPosts.length === 0) {
            popularesListEl.innerHTML = '<div class="info-card"><p style="text-align: center; color: #88ff88;">*-* No hay posts populares aún</p></div>';
            return;
        }
        
        popularesListEl.innerHTML = popularPosts.map(post => {
            const hasLiked = post.likedBy && post.likedBy.includes(this.currentUser?.username);
            const likeButtonClass = hasLiked ? 'like-btn liked' : 'like-btn';
            const likeEmoticon = ':-)';
            
            const authorPhoto = localStorage.getItem(`fotoPerfil_${post.author}`);
            
            return `
            <div class="post-card" data-post-id="${post.id}">
                <div class="post-header">
                    <div class="post-author">
                        <div class="author-avatar-container" id="popularAvatar_${post.id}">
                            ${authorPhoto ? `<img class="author-avatar-img" src="${authorPhoto}" alt="Foto">` : ''}
                        </div>
                        <div class="author-info">
                            <div class="author-name">${post.authorNickname || post.author}</div>
                            <div class="author-username">${post.authorUsername || '@' + post.author}</div>
                        </div>
                    </div>
                    <div class="post-date">${this.formatDate(post.date)}</div>
                </div>
                <div class="post-content">${this.escapeHtml(post.content)}</div>
                ${post.image ? `
                    <div class="post-image" onclick="rinconMural.viewFullImage('${post.image}')">
                        <img src="${post.image}" alt="Imagen del post">
                    </div>
                ` : ''}
                <div class="post-footer">
                    <button class="${likeButtonClass}" data-id="${post.id}">
                        <span>${likeEmoticon}</span> ${post.likes || 0}
                    </button>
                    <button class="comment-btn" data-id="${post.id}">
                        <span>...</span> ${post.comments || 0}
                    </button>
                    <button class="share-btn" data-id="${post.id}" title="Copiar enlace (Ctrl+C)">
                        <span>[Ctrl+C]</span>
                    </button>
                </div>
            </div>
        `}).join('');
        
        popularPosts.forEach(post => {
            const authorPhoto = localStorage.getItem(`fotoPerfil_${post.author}`);
            const container = document.getElementById(`popularAvatar_${post.id}`);
            if (container && authorPhoto) {
                container.classList.add('has-image');
            }
        });
        
        document.querySelectorAll('#populares .like-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const postId = parseInt(btn.getAttribute('data-id'));
                this.likePost(postId);
            });
        });
        
        document.querySelectorAll('#populares .comment-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const postId = parseInt(btn.getAttribute('data-id'));
                this.showComments(postId);
            });
        });
        
        document.querySelectorAll('#populares .share-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const postId = parseInt(btn.getAttribute('data-id'));
                this.sharePost(postId);
            });
        });
    }

    renderUserPosts() {
        if (!this.userPostsFeedEl || !this.currentUser) return;
        
        const username = this.currentUser.username;
        const userPosts = this.posts.filter(post => post.author === username).sort((a, b) => 
            new Date(b.date) - new Date(a.date)
        );
        
        if (userPosts.length === 0) {
            this.userPostsFeedEl.innerHTML = `
                <div class="info-card" style="text-align: center; padding: 2rem;">
                    <p style="color: #88ff88;">
                        :-) No has publicado nada aún. ¡Crea tu primer post!
                    </p>
                </div>
            `;
            return;
        }
        
        this.userPostsFeedEl.innerHTML = userPosts.map(post => {
            const hasLiked = post.likedBy && post.likedBy.includes(this.currentUser?.username);
            const likeButtonClass = hasLiked ? 'like-btn liked' : 'like-btn';
            const likeEmoticon = ':-)';
            const authorPhoto = localStorage.getItem(`fotoPerfil_${post.author}`);
            
            return `
            <div class="post-card" data-post-id="${post.id}" style="margin-bottom: 1rem;">
                <div class="post-header">
                    <div class="post-author">
                        <div class="author-avatar-container" id="userPostAvatar_${post.id}">
                            ${authorPhoto ? `<img class="author-avatar-img" src="${authorPhoto}" alt="Foto">` : ''}
                        </div>
                        <div class="author-info">
                            <div class="author-name">${post.authorNickname || post.author}</div>
                            <div class="author-username">${post.authorUsername || '@' + post.author}</div>
                        </div>
                    </div>
                    <div class="post-date">${this.formatDate(post.date)}</div>
                </div>
                <div class="post-content">${this.escapeHtml(post.content)}</div>
                ${post.image ? `
                    <div class="post-image" onclick="rinconMural.viewFullImage('${post.image}')">
                        <img src="${post.image}" alt="Imagen del post">
                    </div>
                ` : ''}
                <div class="post-footer">
                    <button class="${likeButtonClass}" data-id="${post.id}">
                        <span>${likeEmoticon}</span> ${post.likes || 0}
                    </button>
                    <button class="comment-btn" data-id="${post.id}">
                        <span>...</span> ${post.comments || 0}
                    </button>
                    <button class="share-btn" data-id="${post.id}" title="Copiar enlace (Ctrl+C)">
                        <span>[Ctrl+C]</span>
                    </button>
                    <button class="delete-post-btn" data-id="${post.id}">[X] Eliminar</button>
                </div>
            </div>
        `}).join('');
        
        userPosts.forEach(post => {
            const authorPhoto = localStorage.getItem(`fotoPerfil_${post.author}`);
            const container = document.getElementById(`userPostAvatar_${post.id}`);
            if (container && authorPhoto) {
                container.classList.add('has-image');
            }
        });
        
        document.querySelectorAll('#userPostsFeed .like-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const postId = parseInt(btn.getAttribute('data-id'));
                this.likePost(postId);
            });
        });
        
        document.querySelectorAll('#userPostsFeed .comment-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const postId = parseInt(btn.getAttribute('data-id'));
                this.showComments(postId);
            });
        });
        
        document.querySelectorAll('#userPostsFeed .share-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const postId = parseInt(btn.getAttribute('data-id'));
                this.sharePost(postId);
            });
        });
        
        document.querySelectorAll('.delete-post-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const postId = parseInt(btn.getAttribute('data-id'));
                this.deletePost(postId);
            });
        });
        
        if (this.borderColorPicker && this.bgColorPicker && this.neonColorPicker) {
            this.applyRGBColors(this.borderColorPicker.value, this.bgColorPicker.value, this.neonColorPicker.value);
        }
    }

    deletePost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;
        
        if (post.author !== this.currentUser?.username) {
            this.showMessage('No puedes eliminar este post', 'error');
            return;
        }
        
        if (confirm('¿Seguro que quieres eliminar este post? :-( ')) {
            localStorage.removeItem(`comments_${postId}`);
            this.posts = this.posts.filter(p => p.id !== postId);
            this.savePosts();
            this.renderPosts();
            this.renderPopularPosts();
            this.renderUserPosts();
            this.updateStats();
            this.showMessage('Post eliminado!', 'success');
        }
    }

    viewFullImage(imageUrl) {
        const modalHTML = `
            <div id="imageModal" class="image-modal-overlay">
                <div class="image-modal-content">
                    <img src="${imageUrl}" alt="Imagen completa">
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const modal = document.getElementById('imageModal');
        modal.addEventListener('click', () => {
            modal.remove();
        });
    }

    likePost(postId) {
        if (!this.currentUser) return;
        
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;
        
        const username = this.currentUser.username;
        const hasLiked = post.likedBy && post.likedBy.includes(username);
        
        if (hasLiked) {
            post.likes--;
            post.likedBy = post.likedBy.filter(u => u !== username);
            this.showMessage('(N) Quitaste tu like', 'info');
        } else {
            post.likes++;
            if (!post.likedBy) post.likedBy = [];
            post.likedBy.push(username);
            this.showMessage(':-) Te gusta este post!', 'success');
        }
        
        this.savePosts();
        this.renderPosts();
        this.renderPopularPosts();
        this.renderUserPosts();
        this.updateStats();
        this.createHappyFaceEffect();
    }

    showComments(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;
        
        const comments = JSON.parse(localStorage.getItem(`comments_${postId}`) || '[]');
        
        const modalHTML = `
            <div id="commentsModal" class="modal-overlay">
                <div class="modal-content">
                    <div class="cabecera-glow">
                        <h2 class="modal-titulo">... COMENTARIOS ...</h2>
                        <div class="subtitulo">${post.authorNickname}: ${post.content.substring(0, 50)}...</div>
                    </div>
                    
                    <div class="comments-list" style="max-height: 300px; overflow-y: auto; margin-bottom: 1rem;">
                        ${comments.length === 0 ? '<p style="text-align: center; color: #88ff88;">:-) No hay comentarios aún</p>' : 
                            comments.map((comment, index) => {
                                const isAuthor = comment.author === this.currentUser.userData.nickname || 
                                               comment.author === this.currentUser.username;
                                return `
                                    <div style="background: #1a1a1a; padding: 8px; margin-bottom: 8px; border-radius: 10px; border-left: 3px solid #00ff66; display: flex; justify-content: space-between; align-items: center;">
                                        <div style="flex: 1;">
                                            <strong style="color: #00ff66;">${comment.author}:</strong>
                                            <span style="color: #ccffcc;">${comment.content}</span>
                                            <small style="color: #66cc66; display: block;">${this.formatDate(comment.date)}</small>
                                        </div>
                                        ${isAuthor ? `<button class="delete-comment-btn" data-index="${index}" style="background: #ff3333; border: none; color: white; padding: 4px 10px; border-radius: 15px; cursor: pointer; font-family: monospace; font-size: 11px;">[X]</button>` : ''}
                                    </div>
                                `;
                            }).join('')
                        }
                    </div>
                    
                    <div class="input-grupo">
                        <textarea id="commentContent" class="post-textarea" placeholder="Escribe tu comentario... (-:" style="min-height: 80px;"></textarea>
                    </div>
                    
                    <button id="submitComment" class="btn-ingresar" style="width: 100%; margin-top: 10px;">
                        <span class="btn-text">ENVIAR COMENTARIO</span>
                    </button>
                    
                    <button class="modal-close">✖</button>
                </div>
            </div>
        `;
        
        this.addModalToBody(modalHTML);
        
        const modal = document.getElementById('commentsModal');
        const closeBtn = modal.querySelector('.modal-close');
        const submitBtn = document.getElementById('submitComment');
        const commentInput = document.getElementById('commentContent');
        
        const closeModal = () => modal.remove();
        closeBtn.onclick = closeModal;
        modal.onclick = (e) => {
            if (e.target === modal) closeModal();
        };
        
        document.querySelectorAll('.delete-comment-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = parseInt(btn.getAttribute('data-index'));
                const deletedComment = comments[index];
                
                if (deletedComment && (deletedComment.author === this.currentUser.userData.nickname || 
                    deletedComment.author === this.currentUser.username)) {
                    comments.splice(index, 1);
                    localStorage.setItem(`comments_${postId}`, JSON.stringify(comments));
                    post.comments = comments.length;
                    this.savePosts();
                    this.showMessage('🗑️ Comentario eliminado', 'info');
                    closeModal();
                    this.showComments(postId);
                    this.renderPosts();
                    this.renderUserPosts();
                }
            });
        });
        
        if (submitBtn) {
            submitBtn.onclick = () => {
                const comment = commentInput?.value.trim();
                if (!comment) {
                    this.showMessage('Escribe un comentario', 'error');
                    return;
                }
                
                const newComment = {
                    author: this.currentUser.userData.nickname || this.currentUser.username,
                    content: comment,
                    date: new Date().toISOString()
                };
                
                comments.push(newComment);
                localStorage.setItem(`comments_${postId}`, JSON.stringify(comments));
                post.comments = comments.length;
                this.savePosts();
                
                this.showMessage('♥ Comentario agregado! ♥', 'success');
                closeModal();
                this.renderPosts();
                this.renderUserPosts();
            };
        }
    }

    sharePost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;
        
        const shareText = `${post.content} - Publicado por ${post.authorNickname}`;
        
        navigator.clipboard.writeText(shareText).then(() => {
            this.showMessage('[Ctrl+C] Enlace copiado al portapapeles!', 'success');
        }).catch(() => {
            this.showMessage('No se pudo copiar el enlace', 'error');
        });
    }

    loadFollowing() {
        const savedFollowing = localStorage.getItem(`following_${this.currentUser?.username}`);
        
        if (savedFollowing) {
            this.following = JSON.parse(savedFollowing);
        } else {
            this.following = [];
            this.saveFollowing();
        }
        
        this.renderFriends();
    }

    saveFollowing() {
        localStorage.setItem(`following_${this.currentUser?.username}`, JSON.stringify(this.following));
    }

    // ==================== FUNCIÓN RENDER FRIENDS ACTUALIZADA ====================
    renderFriends() {
        const amigosListEl = document.getElementById('amigosList');
        if (!amigosListEl) return;
        
        if (this.following.length === 0) {
            amigosListEl.innerHTML = `
                <div style="text-align: center; color: #88ff88; padding: 20px;">
                    :-/ No sigues a nadie aún. ¡Busca usuarios para seguir!
                </div>
            `;
            this.updateOnlineCount();
            return;
        }
        
        amigosListEl.innerHTML = this.following.map(friend => {
            const friendPhoto = localStorage.getItem(`fotoPerfil_${friend.name}`);
            
            return `
                <div class="friend-item" data-friend="${friend.name}" onclick="rinconMural.openUserProfile('${friend.name}')">
                    <div class="friend-avatar-container" id="friendAvatar_${friend.name}">
                        ${friendPhoto ? `<img class="friend-avatar-img" src="${friendPhoto}" alt="Foto">` : ''}
                    </div>
                    <div class="friend-name">${friend.nickname || friend.name}</div>
                    <div class="friend-status">${friend.status === 'online' ? '(: online' : '(-: offline'}</div>
                </div>
            `;
        }).join('');
        
        this.following.forEach(friend => {
            const friendPhoto = localStorage.getItem(`fotoPerfil_${friend.name}`);
            const container = document.getElementById(`friendAvatar_${friend.name}`);
            if (container && friendPhoto) {
                container.classList.add('has-image');
            }
        });
        
        this.updateOnlineCount();
    }
    // ==================== FIN DE LA ACTUALIZACIÓN ====================

    // ==================== FUNCIÓN PARA ABRIR PERFIL DE USUARIO ====================
    openUserProfile(username) {
        // Redirigir a la página de perfil con el nombre de usuario como parámetro
        window.location.href = `perfil RS UX.html?user=${encodeURIComponent(username)}`;
    }
    // ==================== FIN DE LA FUNCIÓN ====================

    followUser(username) {
        if (username === this.currentUser?.username) {
            this.showMessage('No puedes seguirte a ti mismo', 'error');
            return;
        }
        
        if (this.following.some(f => f.name === username)) {
            this.showMessage('Ya sigues a este usuario', 'info');
            return;
        }
        
        const users = JSON.parse(localStorage.getItem('rincon_creativo_users') || '{}');
        const userExists = users[username];
        
        if (!userExists) {
            this.showMessage('Usuario no encontrado', 'error');
            return;
        }
        
        const newFollow = {
            id: Date.now(),
            name: username,
            nickname: userExists.nickname || username,
            avatar: userExists.avatar || '',
            status: Math.random() > 0.5 ? 'online' : 'offline',
            lastSeen: new Date().toISOString()
        };
        
        this.following.push(newFollow);
        this.saveFollowing();
        this.renderFriends();
        this.updateStats();
        this.updateOnlineCount();
        
        this.showMessage(`✨ Ahora sigues a ${username}! ✨`, 'success');
    }

    unfollowUser(username) {
        this.following = this.following.filter(f => f.name !== username);
        this.saveFollowing();
        this.renderFriends();
        this.updateStats();
        this.updateOnlineCount();
        
        this.showMessage(`👋 Dejaste de seguir a ${username}`, 'info');
    }

    addFriend() {
        const username = prompt(':-) Ingresa el nickname del usuario que quieres seguir:');
        
        if (!username) return;
        
        if (username === this.currentUser?.username) {
            this.showMessage('No puedes seguirte a ti mismo', 'error');
            return;
        }
        
        const users = JSON.parse(localStorage.getItem('rincon_creativo_users') || '{}');
        const userExists = users[username];
        
        if (!userExists) {
            this.showMessage('Usuario no encontrado :-(', 'error');
            return;
        }
        
        if (this.following.some(f => f.name === username)) {
            this.showMessage('Ya sigues a este usuario', 'info');
            return;
        }
        
        this.followUser(username);
    }

    editBio() {
        const newBio = prompt('Edita tu biografía:', this.bioTextEl?.textContent || '');
        
        if (newBio && newBio !== this.bioTextEl?.textContent) {
            this.bioTextEl.textContent = newBio;
            localStorage.setItem(`bio_${this.currentUser?.username}`, newBio);
            this.showMessage('♥ Biografía actualizada! ♥', 'success');
        }
    }

    changeSection(section) {
        this.currentSection = section;
        
        this.navBtns.forEach(btn => {
            if (btn.getAttribute('data-section') === section) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        Object.keys(this.sections).forEach(key => {
            if (this.sections[key]) {
                if (key === section) {
                    this.sections[key].classList.add('active');
                } else {
                    this.sections[key].classList.remove('active');
                }
            }
        });
        
        if (section === 'populares') {
            this.renderPopularPosts();
        } else if (section === 'amigos') {
            this.renderFriends();
            this.updateOnlineCount();
        } else if (section === 'buscar') {
            if (this.searchResults) {
                this.searchResults.innerHTML = '<p style="text-align: center; color: #88ff88;">(?) Escribe un nombre y presiona buscar</p>';
            }
            if (this.searchInput) {
                this.searchInput.value = '';
            }
        } else if (section === 'miperfil') {
            this.updateStats();
            this.renderUserPosts();
            this.loadBackground();
            this.setupRGBColors();
        }
    }

    updateStats() {
        if (!this.currentUser) return;
        
        const username = this.currentUser.username;
        
        const userPosts = this.posts.filter(p => p.author === username);
        if (this.postCountEl) this.postCountEl.textContent = userPosts.length;
        
        if (this.friendsCountEl) this.friendsCountEl.textContent = this.following.length;
        
        const totalLikes = this.posts
            .filter(p => p.author === username)
            .reduce((sum, p) => sum + (p.likes || 0), 0);
        if (this.likesCountEl) this.likesCountEl.textContent = totalLikes;
    }

    publishPost() {
        if (!this.postContentEl || !this.currentUser) return;
        
        const content = this.postContentEl.value.trim();
        
        if (!content && !this.currentImageData) {
            this.showMessage(':-/ Escribe algo o selecciona una imagen', 'error');
            return;
        }
        
        if (content.length > 500) {
            this.showMessage('El texto es demasiado largo (máximo 500 caracteres)', 'error');
            return;
        }
        
        const newPost = {
            id: Date.now(),
            author: this.currentUser.username,
            authorNickname: this.currentUser.userData.nickname || this.currentUser.username,
            authorUsername: '@' + this.currentUser.username,
            authorAvatar: '',
            content: content || '',
            image: this.currentImageData || null,
            date: new Date().toISOString(),
            likes: 0,
            comments: 0,
            likedBy: []
        };
        
        this.posts.unshift(newPost);
        this.savePosts();
        this.renderPosts();
        this.renderUserPosts();
        
        this.postContentEl.value = '';
        this.removeSelectedImage();
        
        this.updateStats();
        this.showMessage('♥ ¡Post publicado! ♥', 'success');
        this.createConfetti();
    }

    setupEmoticonsPanel() {
        const emojiBtn = document.querySelector('.emoji-btn');
        const emoticonPanel = document.querySelector('.emoticones-panel');
        
        if (emojiBtn && emoticonPanel) {
            emojiBtn.addEventListener('click', () => {
                if (emoticonPanel.style.display === 'none') {
                    emoticonPanel.style.display = 'flex';
                } else {
                    emoticonPanel.style.display = 'none';
                }
            });
            
            document.querySelectorAll('.emo-classic').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (this.postContentEl) {
                        const emoticon = btn.textContent;
                        this.postContentEl.value += emoticon + ' ';
                        this.postContentEl.focus();
                        emoticonPanel.style.display = 'none';
                    }
                });
            });
        }
    }

    updateUI() {
        this.renderPosts();
        this.renderFriends();
    }

    logout() {
        sessionStorage.removeItem('rincon_session');
        localStorage.removeItem('rincon_remembered');
        this.showMessage('(x) Cerrando sesión... Hasta luego!', 'success');
        
        setTimeout(() => {
            window.location.href = 'RS UX.html';
        }, 1500);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'ahora mismo';
        if (minutes < 60) return `hace ${minutes} min`;
        if (hours < 24) return `hace ${hours} h`;
        if (days < 7) return `hace ${days} d`;
        
        return date.toLocaleDateString('es-ES');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showMessage(message, type) {
        const oldMessage = document.querySelector('.floating-message');
        if (oldMessage) {
            oldMessage.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `floating-message ${type}`;
        messageDiv.textContent = message;
        
        messageDiv.style.position = 'fixed';
        messageDiv.style.top = '20px';
        messageDiv.style.left = '50%';
        messageDiv.style.transform = 'translateX(-50%)';
        messageDiv.style.zIndex = '10000';
        messageDiv.style.padding = '12px 24px';
        messageDiv.style.borderRadius = '30px';
        messageDiv.style.fontFamily = "'Press Start 2P', monospace";
        messageDiv.style.fontSize = '12px';
        messageDiv.style.textAlign = 'center';
        messageDiv.style.backdropFilter = 'blur(10px)';
        messageDiv.style.border = '2px solid';
        messageDiv.style.opacity = '1';
        messageDiv.style.transition = 'opacity 0.3s ease';
        
        if (type === 'success') {
            messageDiv.style.background = 'rgba(0, 255, 100, 0.9)';
            messageDiv.style.color = '#003300';
            messageDiv.style.borderColor = '#00ff00';
        } else if (type === 'error') {
            messageDiv.style.background = 'rgba(255, 50, 50, 0.9)';
            messageDiv.style.color = '#ffffff';
            messageDiv.style.borderColor = '#ff0000';
        } else {
            messageDiv.style.background = 'rgba(0, 204, 68, 0.9)';
            messageDiv.style.color = '#000000';
            messageDiv.style.borderColor = '#00ff66';
        }
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv) {
                messageDiv.style.opacity = '0';
                setTimeout(() => {
                    if (messageDiv && messageDiv.remove) {
                        messageDiv.remove();
                    }
                }, 300);
            }
        }, 5000);
    }

    createConfetti() {
        const colors = ['#00ff66', '#00cc44', '#88ff88', '#00ffaa', '#66ff66'];
        
        for (let i = 0; i < 30; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '8px';
            confetti.style.height = '8px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-10px';
            confetti.style.zIndex = '9999';
            confetti.style.pointerEvents = 'none';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            
            document.body.appendChild(confetti);
            
            const animation = confetti.animate([
                { transform: `translate(0, 0) rotate(0deg)`, opacity: 0.8 },
                { transform: `translate(${Math.random() * 200 - 100}px, ${window.innerHeight}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
            ], {
                duration: 1200 + Math.random() * 800,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });
            
            animation.onfinish = () => confetti.remove();
        }
    }

    createHappyFaceEffect() {
        const happyFace = document.createElement('div');
        happyFace.innerHTML = ':-)';
        happyFace.style.position = 'fixed';
        happyFace.style.left = '50%';
        happyFace.style.top = '50%';
        happyFace.style.fontSize = '3rem';
        happyFace.style.fontFamily = "'Courier New', monospace";
        happyFace.style.fontWeight = 'bold';
        happyFace.style.color = '#00ff66';
        happyFace.style.textShadow = '0 0 10px #00cc44';
        happyFace.style.zIndex = '10001';
        happyFace.style.pointerEvents = 'none';
        happyFace.style.opacity = '1';
        happyFace.style.transition = 'all 1s ease';
        
        document.body.appendChild(happyFace);
        
        setTimeout(() => {
            happyFace.style.transform = 'translateY(-100px)';
            happyFace.style.opacity = '0';
        }, 10);
        
        setTimeout(() => {
            happyFace.remove();
        }, 1000);
    }

    addModalToBody(modalHTML) {
        const existingModals = document.querySelectorAll('.modal-overlay');
        existingModals.forEach(modal => modal.remove());
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        if (!document.querySelector('#modalStyles')) {
            const style = document.createElement('style');
            style.id = 'modalStyles';
            style.textContent = `
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.9);
                    backdrop-filter: blur(8px);
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: fadeIn 0.3s ease;
                }
                
                .modal-content {
                    position: relative;
                    max-width: 500px;
                    width: 90%;
                    background: rgba(0, 0, 0, 0.95);
                    border: 2px solid #00cc44;
                    border-radius: 20px;
                    padding: 2rem;
                    box-shadow: 0 0 30px #00ff66;
                    animation: slideUp 0.3s ease;
                }
                
                .modal-titulo {
                    font-family: 'Press Start 2P', monospace;
                    font-size: 1rem;
                    color: #00ff66;
                    text-shadow: 0 0 10px #00cc44;
                    margin-bottom: 1rem;
                    text-align: center;
                }
                
                .subtitulo {
                    font-family: 'VT323', monospace;
                    font-size: 0.8rem;
                    color: #88ff88;
                    text-align: center;
                    margin-bottom: 1rem;
                }
                
                .modal-close {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: #333333;
                    border: 1px solid #00ff66;
                    color: #88ff88;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 18px;
                    transition: all 0.2s;
                }
                
                .modal-close:hover {
                    background: #00cc44;
                    color: #000000;
                    transform: scale(1.1);
                }
                
                .btn-ingresar {
                    background: linear-gradient(95deg, #00cc44, #00ff66);
                    border: none;
                    border-radius: 60px;
                    padding: 12px;
                    font-family: 'Press Start 2P', monospace;
                    font-size: 0.7rem;
                    color: #000000;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .btn-ingresar:hover {
                    transform: scale(1.02);
                    box-shadow: 0 0 15px #00ff66;
                }
                
                .input-grupo {
                    margin-bottom: 1rem;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideUp {
                    from { transform: translateY(50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

const rinconMural = new RinconCreativoMural();
window.rinconMural = rinconMural;