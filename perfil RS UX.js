// Archivo: perfil RS UX.js
// Página para ver perfiles de otros usuarios (modo espectador)

class PerfilUsuario {
    constructor() {
        this.currentUser = null;
        this.viewingUser = null;
        this.posts = [];
        this.following = [];
        this.allUsers = [];
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.checkSession();
            this.getViewingUser();
            this.initializeElements();
            this.bindEvents();
            this.loadUserData();
            this.loadPosts();
            this.loadFollowing();
            this.loadAllUsers();
            this.loadUserProfile();
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

    getViewingUser() {
        const urlParams = new URLSearchParams(window.location.search);
        const username = urlParams.get('user');
        
        if (!username) {
            this.showMessage('Usuario no especificado', 'error');
            setTimeout(() => {
                window.location.href = 'mural RS UX.html';
            }, 2000);
            return;
        }
        
        this.viewingUser = username;
        console.log('Viendo perfil de:', this.viewingUser);
    }

    initializeElements() {
        this.userNicknameHeaderEl = document.getElementById('userNicknameHeader');
        this.userUsernameHeaderEl = document.getElementById('userUsernameHeader');
        this.userFotoHeader = document.getElementById('userFotoHeader');
        this.userFotoImagen = document.getElementById('userFotoImagen');
        this.userFotoEmoji = document.getElementById('userFotoEmoji');
        
        this.perfilUsuarioCard = document.getElementById('perfilUsuarioCard');
        this.perfilUsuarioPostsCard = document.getElementById('perfilUsuarioPostsCard');
        this.perfilUsuarioAvatar = document.getElementById('perfilUsuarioAvatar');
        this.perfilUsuarioImagen = document.getElementById('perfilUsuarioImagen');
        this.perfilUsuarioAvatarEmoji = document.getElementById('perfilUsuarioAvatarEmoji');
        this.perfilFondoUsuario = document.getElementById('perfilFondoUsuario');
        
        this.perfilUsuarioNombre = document.getElementById('perfilUsuarioNombre');
        this.perfilUsuarioNickname = document.getElementById('perfilUsuarioNickname');
        this.perfilUsuarioUsername = document.getElementById('perfilUsuarioUsername');
        this.perfilUsuarioJoinDate = document.getElementById('perfilUsuarioJoinDate');
        this.perfilUsuarioBio = document.getElementById('perfilUsuarioBio');
        this.perfilUsuarioPostCount = document.getElementById('perfilUsuarioPostCount');
        this.perfilUsuarioFollowersCount = document.getElementById('perfilUsuarioFollowersCount');
        this.perfilUsuarioLikesCount = document.getElementById('perfilUsuarioLikesCount');
        
        this.usuarioPostsFeed = document.getElementById('usuarioPostsFeed');
        this.perfilUsuarioActions = document.getElementById('perfilUsuarioActions');
        
        this.volverBtn = document.getElementById('volverBtn');
        this.estadoOnlineEl = document.getElementById('estadoOnline');
        this.logoutBtn = document.getElementById('logoutBtn');
        
        this.btnMuro = document.getElementById('btnMuro');
        this.btnPopulares = document.getElementById('btnPopulares');
        this.btnAmigos = document.getElementById('btnAmigos');
        this.btnBuscar = document.getElementById('btnBuscar');
        this.btnMiPerfil = document.getElementById('btnMiPerfil');
    }

    bindEvents() {
        if (this.logoutBtn) {
            this.logoutBtn.addEventListener('click', () => this.logout());
        }
        
        if (this.volverBtn) {
            this.volverBtn.addEventListener('click', () => {
                window.location.href = 'mural RS UX.html';
            });
        }
        
        if (this.btnMuro) {
            this.btnMuro.addEventListener('click', () => {
                window.location.href = 'mural RS UX.html';
            });
        }
        
        if (this.btnMiPerfil) {
            this.btnMiPerfil.addEventListener('click', () => {
                window.location.href = 'mural RS UX.html';
            });
        }
        
        if (this.btnPopulares) {
            this.btnPopulares.addEventListener('click', () => {
                window.location.href = 'mural RS UX.html';
            });
        }
        
        if (this.btnAmigos) {
            this.btnAmigos.addEventListener('click', () => {
                window.location.href = 'mural RS UX.html';
            });
        }
        
        if (this.btnBuscar) {
            this.btnBuscar.addEventListener('click', () => {
                window.location.href = 'mural RS UX.html';
            });
        }
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

    loadPosts() {
        const savedPosts = localStorage.getItem('rincon_posts');
        
        if (savedPosts) {
            this.posts = JSON.parse(savedPosts);
        } else {
            this.posts = [];
        }
    }

    loadFollowing() {
        const savedFollowing = localStorage.getItem(`following_${this.currentUser?.username}`);
        
        if (savedFollowing) {
            this.following = JSON.parse(savedFollowing);
        } else {
            this.following = [];
        }
    }

    getFollowersCount(username) {
        let count = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('following_')) {
                const following = JSON.parse(localStorage.getItem(key) || '[]');
                if (following.some(f => f.name === username)) {
                    count++;
                }
            }
        }
        return count;
    }

    getTextColor(hexColor) {
        let r, g, b;
        if (hexColor && hexColor.startsWith('#')) {
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
        if (!hexColor || !hexColor.startsWith('#')) return hexColor || '#1a1a1a';
        
        let r = parseInt(hexColor.slice(1, 3), 16);
        let g = parseInt(hexColor.slice(3, 5), 16);
        let b = parseInt(hexColor.slice(5, 7), 16);
        
        r = Math.min(255, Math.floor(r + (255 - r) * percent / 100));
        g = Math.min(255, Math.floor(g + (255 - g) * percent / 100));
        b = Math.min(255, Math.floor(b + (255 - b) * percent / 100));
        
        return `rgb(${r}, ${g}, ${b})`;
    }

    loadUserProfile() {
        const userData = this.allUsers.find(u => u.username === this.viewingUser);
        if (!userData) {
            this.showMessage('Usuario no encontrado', 'error');
            setTimeout(() => {
                window.location.href = 'mural RS UX.html';
            }, 2000);
            return;
        }
        
        const userPosts = this.posts.filter(p => p.author === this.viewingUser).sort((a, b) => new Date(b.date) - new Date(a.date));
        const userPhoto = localStorage.getItem(`fotoPerfil_${this.viewingUser}`);
        const userBackground = localStorage.getItem(`fondoPerfil_${this.viewingUser}`);
        const userBorderColor = localStorage.getItem(`perfilBorder_${this.viewingUser}`) || '#00cc44';
        const userBgColor = localStorage.getItem(`perfilBg_${this.viewingUser}`) || '#1a1a1a';
        const userNeonColor = localStorage.getItem(`perfilNeon_${this.viewingUser}`) || '#00ff66';
        const userBio = localStorage.getItem(`bio_${this.viewingUser}`) || 'Creativo apasionado por el arte retro';
        const isFollowing = this.following.some(f => f.name === this.viewingUser);
        const userJoinDate = userData.joinDate || '2024-01-01';
        const totalLikes = userPosts.reduce((sum, p) => sum + (p.likes || 0), 0);
        const followersCount = this.getFollowersCount(this.viewingUser);
        const textColor = this.getTextColor(userBgColor);
        
        console.log('Colores del usuario:', { userBorderColor, userBgColor, userNeonColor, userBackground });
        
        // === APLICAR FONDO DE PANTALLA ===
        if (this.perfilFondoUsuario) {
            if (userBackground && userBackground !== 'null' && userBackground !== '') {
                this.perfilFondoUsuario.style.backgroundImage = `url('${userBackground}')`;
                this.perfilFondoUsuario.style.backgroundSize = 'cover';
                this.perfilFondoUsuario.style.backgroundPosition = 'center';
                this.perfilFondoUsuario.style.backgroundRepeat = 'no-repeat';
                this.perfilFondoUsuario.style.opacity = '1';
                this.perfilFondoUsuario.style.position = 'fixed';
                this.perfilFondoUsuario.style.top = '0';
                this.perfilFondoUsuario.style.left = '0';
                this.perfilFondoUsuario.style.width = '100%';
                this.perfilFondoUsuario.style.height = '100%';
                this.perfilFondoUsuario.style.zIndex = '-1';
                console.log('Fondo aplicado correctamente');
            } else {
                this.perfilFondoUsuario.style.backgroundImage = 'none';
                this.perfilFondoUsuario.style.backgroundColor = '#0a0a0a';
            }
        }
        
        // === APLICAR COLORES A LA TARJETA DE PERFIL ===
        if (this.perfilUsuarioCard) {
            this.perfilUsuarioCard.style.background = userBgColor;
            this.perfilUsuarioCard.style.backgroundColor = userBgColor;
            this.perfilUsuarioCard.style.border = `2px solid ${userBorderColor}`;
            this.perfilUsuarioCard.style.borderColor = userBorderColor;
        }
        
        // === APLICAR COLORES A LA TARJETA DE POSTS ===
        if (this.perfilUsuarioPostsCard) {
            this.perfilUsuarioPostsCard.style.background = userBgColor;
            this.perfilUsuarioPostsCard.style.backgroundColor = userBgColor;
            this.perfilUsuarioPostsCard.style.border = `2px solid ${userBorderColor}`;
            this.perfilUsuarioPostsCard.style.borderColor = userBorderColor;
            
            const h3 = this.perfilUsuarioPostsCard.querySelector('h3');
            if (h3) {
                h3.style.color = userNeonColor;
                h3.style.textShadow = `0 0 8px ${userNeonColor}`;
            }
        }
        
        // === APLICAR COLORES AL AVATAR ===
        if (this.perfilUsuarioAvatar) {
            this.perfilUsuarioAvatar.style.border = `3px solid ${userBorderColor}`;
            this.perfilUsuarioAvatar.style.borderColor = userBorderColor;
            this.perfilUsuarioAvatar.style.boxShadow = `0 0 20px ${userNeonColor}`;
        }
        
        // === APLICAR COLORES A LOS ESTADÍSTICAS ===
        const stats = document.querySelectorAll('.stat');
        stats.forEach(stat => {
            stat.style.background = `${userBorderColor}33`;
            stat.style.backgroundColor = `${userBorderColor}33`;
            stat.style.color = textColor;
        });
        
        // === APLICAR COLORES A LA BIOGRAFÍA ===
        if (this.perfilUsuarioBio) {
            this.perfilUsuarioBio.textContent = userBio;
            this.perfilUsuarioBio.style.background = this.lightenColor(userBgColor, 20);
            this.perfilUsuarioBio.style.backgroundColor = this.lightenColor(userBgColor, 20);
            this.perfilUsuarioBio.style.borderLeft = `4px solid ${userNeonColor}`;
            this.perfilUsuarioBio.style.borderLeftColor = userNeonColor;
            this.perfilUsuarioBio.style.color = textColor;
        }
        
        // === APLICAR COLORES AL NOMBRE PRINCIPAL ===
        if (this.perfilUsuarioNombre) {
            this.perfilUsuarioNombre.textContent = userData.nickname;
            this.perfilUsuarioNombre.style.color = userNeonColor;
            this.perfilUsuarioNombre.style.textShadow = `0 0 8px ${userNeonColor}`;
        }
        
        // === APLICAR COLORES AL NICKNAME Y USERNAME ===
        if (this.perfilUsuarioNickname) {
            this.perfilUsuarioNickname.textContent = userData.nickname;
            this.perfilUsuarioNickname.style.color = textColor;
        }
        
        if (this.perfilUsuarioUsername) {
            this.perfilUsuarioUsername.textContent = `@${this.viewingUser}`;
            this.perfilUsuarioUsername.style.color = textColor;
        }
        
        // === FECHA DE UNIÓN ===
        if (this.perfilUsuarioJoinDate) {
            this.perfilUsuarioJoinDate.textContent = userJoinDate;
            this.perfilUsuarioJoinDate.style.color = textColor;
        }
        
        // === CONTADORES ===
        if (this.perfilUsuarioPostCount) this.perfilUsuarioPostCount.textContent = userPosts.length;
        if (this.perfilUsuarioFollowersCount) this.perfilUsuarioFollowersCount.textContent = followersCount;
        if (this.perfilUsuarioLikesCount) this.perfilUsuarioLikesCount.textContent = totalLikes;
        
        // === AVATAR DEL PERFIL ===
        if (userPhoto && this.perfilUsuarioImagen) {
            this.perfilUsuarioImagen.src = userPhoto;
            this.perfilUsuarioAvatar.classList.add('has-image');
        } else if (this.perfilUsuarioAvatarEmoji) {
            this.perfilUsuarioAvatarEmoji.textContent = userData.avatar || ':-)';
            this.perfilUsuarioAvatar.classList.remove('has-image');
        }
        
        // === BOTÓN DE SEGUIR/DEJAR DE SEGUIR ===
        if (this.viewingUser !== this.currentUser?.username) {
            let buttonHtml = '';
            if (isFollowing) {
                buttonHtml = `<button class="unfollow-user-btn" id="actionBtn" style="background: #ff3333; color: white; border: 1px solid #ff6666; font-family: 'Courier New', monospace; font-size: 0.8rem; font-weight: bold; padding: 8px 20px; border-radius: 20px; cursor: pointer; transition: all 0.2s;">✖ DEJAR DE SEGUIR</button>`;
            } else {
                buttonHtml = `<button class="follow-user-btn" id="actionBtn" style="background: linear-gradient(95deg, #00cc44, #00ff66); color: #000000; border: none; font-family: 'Courier New', monospace; font-size: 0.8rem; font-weight: bold; padding: 8px 20px; border-radius: 20px; cursor: pointer; transition: all 0.2s;">+ SEGUIR</button>`;
            }
            this.perfilUsuarioActions.innerHTML = buttonHtml;
            
            const actionBtn = document.getElementById('actionBtn');
            if (actionBtn) {
                actionBtn.addEventListener('click', () => {
                    if (isFollowing) {
                        this.unfollowUser();
                    } else {
                        this.followUser();
                    }
                });
            }
        } else {
            this.perfilUsuarioActions.innerHTML = `<span class="stat" style="background: ${userBorderColor}33; color: ${textColor}; padding: 8px 20px; border-radius: 20px;">✨ Este es tu perfil ✨</span>`;
        }
        
        // === RENDERIZAR POSTS ===
        this.renderUserPosts(userPosts, userBorderColor, userNeonColor, textColor, userBgColor);
    }

    // ==================== FUNCIÓN CORREGIDA PARA MOSTRAR FOTOS DE PERFIL EN POSTS ====================
    renderUserPosts(userPosts, borderColor, neonColor, textColor, bgColor) {
        if (!this.usuarioPostsFeed) return;
        
        if (userPosts.length === 0) {
            this.usuarioPostsFeed.innerHTML = `
                <div class="info-card" style="text-align: center; padding: 2rem; background: ${bgColor}; border-color: ${borderColor};">
                    <p style="color: ${textColor};">
                        :-) No hay publicaciones aún
                    </p>
                </div>
            `;
            return;
        }
        
        this.usuarioPostsFeed.innerHTML = userPosts.map(post => {
            const hasLiked = post.likedBy && post.likedBy.includes(this.currentUser?.username);
            const likeButtonClass = hasLiked ? 'like-btn liked' : 'like-btn';
            const likeEmoticon = ':-)';
            
            // OBTENER FOTO DE PERFIL DEL AUTOR DEL POST
            const authorPhoto = localStorage.getItem(`fotoPerfil_${post.author}`);
            
            // Crear el HTML del avatar con la foto si existe
            let avatarHtml = '';
            if (authorPhoto && authorPhoto !== 'null' && authorPhoto !== '') {
                avatarHtml = `<img class="author-avatar-img" src="${authorPhoto}" alt="Foto" style="width: 100%; height: 100%; object-fit: cover; display: block;">`;
            } else {
                avatarHtml = `<div class="author-avatar-emoji" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">${post.authorAvatar || ':-)'}</div>`;
            }
            
            return `
            <div class="post-card" data-post-id="${post.id}" style="border: 2px solid ${borderColor}; border-radius: 20px; background: ${bgColor}; padding: 1.2rem; margin-bottom: 1rem; transition: all 0.2s;">
                <div class="post-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid ${borderColor};">
                    <div class="post-author" style="display: flex; align-items: center; gap: 0.8rem;">
                        <div class="author-avatar-container" style="width: 40px; height: 40px; background: #0a0a0a; border: 2px solid ${borderColor}; border-radius: 10px; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                            ${avatarHtml}
                        </div>
                        <div class="author-info">
                            <div class="author-name" style="font-family: 'Press Start 2P', monospace; font-size: 0.7rem; color: ${neonColor};">${post.authorNickname || post.author}</div>
                            <div class="author-username" style="font-size: 0.6rem; color: ${textColor}; font-family: 'Courier New', monospace;">${post.authorUsername || '@' + post.author}</div>
                        </div>
                    </div>
                    <div class="post-date" style="font-size: 0.7rem; color: ${textColor}; font-family: 'Courier New', monospace;">${this.formatDate(post.date)}</div>
                </div>
                <div class="post-content" style="font-size: 1.2rem; color: ${textColor}; margin-bottom: 1rem; line-height: 1.4;">${this.escapeHtml(post.content)}</div>
                ${post.image ? `
                    <div class="post-image" onclick="perfilUsuario.viewFullImage('${post.image}')" style="margin-top: 10px; max-width: 100%; border-radius: 15px; border: 2px solid ${borderColor}; background: #1a1a1a; cursor: pointer;">
                        <img src="${post.image}" alt="Imagen del post" style="max-width: 100%; max-height: 300px; border-radius: 13px; display: block; margin: 0 auto;">
                    </div>
                ` : ''}
                <div class="post-footer" style="display: flex; gap: 1rem; margin-top: 0.5rem;">
                    <button class="${likeButtonClass}" data-id="${post.id}" style="background: rgba(0, 0, 0, 0.5); border: 1px solid ${borderColor}; color: ${textColor}; font-family: 'Courier New', monospace; font-size: 0.9rem; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 5px; padding: 4px 12px; border-radius: 20px; transition: all 0.2s;">
                        <span>${likeEmoticon}</span> ${post.likes || 0}
                    </button>
                    <button class="comment-btn" data-id="${post.id}" style="background: rgba(0, 0, 0, 0.5); border: 1px solid ${borderColor}; color: ${textColor}; font-family: 'Courier New', monospace; font-size: 0.9rem; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 5px; padding: 4px 12px; border-radius: 20px; transition: all 0.2s;">
                        <span>...</span> ${post.comments || 0}
                    </button>
                    <button class="share-btn" data-id="${post.id}" title="Copiar enlace (Ctrl+C)" style="background: rgba(0, 0, 0, 0.5); border: 1px solid ${borderColor}; color: ${textColor}; font-family: 'Courier New', monospace; font-size: 0.9rem; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 5px; padding: 4px 12px; border-radius: 20px; transition: all 0.2s;">
                        <span>[Ctrl+C]</span>
                    </button>
                </div>
            </div>
        `}).join('');
        
        // === AGREGAR EVENT LISTENERS ===
        this.usuarioPostsFeed.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const postId = parseInt(btn.getAttribute('data-id'));
                this.likePost(postId);
            });
        });
        
        this.usuarioPostsFeed.querySelectorAll('.comment-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const postId = parseInt(btn.getAttribute('data-id'));
                this.showComments(postId);
            });
        });
        
        this.usuarioPostsFeed.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const postId = parseInt(btn.getAttribute('data-id'));
                this.sharePost(postId);
            });
        });
    }
    // ==================== FIN DE LA FUNCIÓN CORREGIDA ====================

    followUser() {
        if (this.viewingUser === this.currentUser?.username) {
            this.showMessage('No puedes seguirte a ti mismo', 'error');
            return;
        }
        
        if (this.following.some(f => f.name === this.viewingUser)) {
            this.showMessage('Ya sigues a este usuario', 'info');
            return;
        }
        
        const users = JSON.parse(localStorage.getItem('rincon_creativo_users') || '{}');
        const userExists = users[this.viewingUser];
        
        if (!userExists) {
            this.showMessage('Usuario no encontrado', 'error');
            return;
        }
        
        const newFollow = {
            id: Date.now(),
            name: this.viewingUser,
            nickname: userExists.nickname || this.viewingUser,
            avatar: userExists.avatar || '',
            status: Math.random() > 0.5 ? 'online' : 'offline',
            lastSeen: new Date().toISOString()
        };
        
        this.following.push(newFollow);
        this.saveFollowing();
        
        this.loadUserProfile();
        
        this.showMessage(`✨ Ahora sigues a ${this.viewingUser}! ✨`, 'success');
    }

    unfollowUser() {
        this.following = this.following.filter(f => f.name !== this.viewingUser);
        this.saveFollowing();
        
        this.loadUserProfile();
        
        this.showMessage(`👋 Dejaste de seguir a ${this.viewingUser}`, 'info');
    }

    saveFollowing() {
        localStorage.setItem(`following_${this.currentUser?.username}`, JSON.stringify(this.following));
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
        this.loadUserProfile();
    }

    savePosts() {
        localStorage.setItem('rincon_posts', JSON.stringify(this.posts));
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
                    this.loadUserProfile();
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
                this.loadUserProfile();
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

    updateUI() {
        this.updateOnlineCount();
    }

    updateOnlineCount() {
        const onlineCount = this.following.filter(f => f.status === 'online').length;
        if (this.estadoOnlineEl) {
            this.estadoOnlineEl.innerHTML = `<span class="punto-verde"></span> (: ${onlineCount} conectados`;
        }
    }

    logout() {
        sessionStorage.removeItem('rincon_session');
        localStorage.removeItem('rincon_remembered');
        this.showMessage('(x) Cerrando sesión... Hasta luego!', 'success');
        
        setTimeout(() => {
            window.location.href = 'RS UX.html';
        }, 1500);
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

const perfilUsuario = new PerfilUsuario();
window.perfilUsuario = perfilUsuario;