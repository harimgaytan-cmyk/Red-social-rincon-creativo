// Archivo: login.js
// Funcionalidad completa para el login de Rincón Creativo

class RinconCreativoLogin {
    constructor() {
        this.init();
    }

    init() {
        // Esperar a que el DOM esté completamente cargado
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeElements();
            this.bindEvents();
            this.checkAutoLogin();
            this.addGlitchEffects();
        });
    }

    initializeElements() {
        // Obtener elementos del DOM
        this.usernameInput = document.getElementById('username');
        this.passwordInput = document.getElementById('password');
        this.loginButton = document.querySelector('.btn-ingresar');
        this.rememberCheckbox = document.querySelector('.checkbox-vintage input');
        this.signupLink = document.querySelector('.signup-fake');
        this.forgotLink = document.querySelector('.forgot-link');
        
        // Sistema de usuarios (simulado - en producción usarías una API)
        this.loadUserDatabase();
    }

    loadUserDatabase() {
        // Base de datos de usuarios simulada
        // En un entorno real, esto vendría de un backend
        const storedUsers = localStorage.getItem('rincon_creativo_users');
        
        if (storedUsers) {
            this.users = JSON.parse(storedUsers);
        } else {
            // Usuarios de ejemplo
            this.users = {
                'chica_glitter': {
                    password: 'glitter123',
                    email: 'chica@glitter.com',
                    nickname: 'Chica Glitter',
                    joinDate: '2024-01-15',
                    avatar: '✨',
                    posts: 42
                },
                'chavo_retro': {
                    password: 'retro2000',
                    email: 'chavo@retro.com',
                    nickname: 'Chavo Retro',
                    joinDate: '2024-02-20',
                    avatar: '🎮',
                    posts: 28
                },
                'creativo_master': {
                    password: 'creative123',
                    email: 'master@creativo.com',
                    nickname: 'Creative Master',
                    joinDate: '2024-03-10',
                    avatar: '🎨',
                    posts: 156
                }
            };
            
            // Guardar usuarios por defecto
            localStorage.setItem('rincon_creativo_users', JSON.stringify(this.users));
        }
    }

    bindEvents() {
        // Evento de click en botón de login
        if (this.loginButton) {
            this.loginButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Evento Enter en los inputs
        if (this.usernameInput) {
            this.usernameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleLogin();
            });
        }
        
        if (this.passwordInput) {
            this.passwordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.handleLogin();
            });
        }

        // Evento para "Crear cuenta"
        if (this.signupLink) {
            this.signupLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSignupModal();
            });
        }

        // Evento para "Olvidé mi contraseña"
        if (this.forgotLink) {
            this.forgotLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showForgotPasswordModal();
            });
        }
    }

    handleLogin() {
        const username = this.usernameInput ? this.usernameInput.value.trim() : '';
        const password = this.passwordInput ? this.passwordInput.value : '';
        
        // Validar campos vacíos
        if (!username || !password) {
            this.showMessage('⚠️ ¡Completa todos los campos!', 'error');
            this.addShakeEffect();
            return;
        }
        
        // Validar formato de email o username
        const isValidEmail = this.validateEmail(username);
        let userIdentifier = username;
        let foundUser = null;
        
        // Buscar usuario por username o email
        if (isValidEmail) {
            foundUser = this.findUserByEmail(username);
            if (foundUser) userIdentifier = foundUser.username;
        } else {
            foundUser = this.users[username];
        }
        
        // Verificar credenciales
        if (foundUser && foundUser.password === password) {
            this.loginSuccess(userIdentifier, foundUser);
        } else {
            this.showMessage('❌ Usuario o contraseña incorrectos', 'error');
            this.addShakeEffect();
            this.clearPasswordField();
        }
    }
    
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    findUserByEmail(email) {
        for (let [username, userData] of Object.entries(this.users)) {
            if (userData.email === email) {
                return { username, ...userData };
            }
        }
        return null;
    }
    
    loginSuccess(username, userData) {
        // Mostrar mensaje de éxito
        this.showMessage(`✨ ¡Bienvenid@ ${userData.nickname || username}! ✨`, 'success');
        
        // Guardar sesión
        const sessionData = {
            username: username,
            userData: userData,
            loginTime: new Date().toISOString(),
            sessionId: this.generateSessionId()
        };
        
        // Guardar en sessionStorage (sesión actual)
        sessionStorage.setItem('rincon_session', JSON.stringify(sessionData));
        
        // Guardar en localStorage si "recordarme" está activado
        if (this.rememberCheckbox && this.rememberCheckbox.checked) {
            localStorage.setItem('rincon_remembered', JSON.stringify({
                username: username,
                userData: userData
            }));
        } else {
            localStorage.removeItem('rincon_remembered');
        }
        
        // Registrar último login
        this.updateLastLogin(username);
        
        // Efecto visual de éxito
        this.addSuccessEffect();
        
        // Redirigir después de 1.5 segundos
        setTimeout(() => {
            this.redirectToMural();
        }, 1500);
    }
    
    checkAutoLogin() {
        // Verificar si hay sesión guardada
        const remembered = localStorage.getItem('rincon_remembered');
        
        if (remembered) {
            try {
                const userData = JSON.parse(remembered);
                if (this.usernameInput && userData.username) {
                    this.usernameInput.value = userData.username;
                    this.showMessage('🔓 Sesión guardada encontrada', 'info');
                    
                    // Auto-completar visualmente
                    if (this.rememberCheckbox) {
                        this.rememberCheckbox.checked = true;
                    }
                }
            } catch (e) {
                console.error('Error al cargar sesión guardada', e);
            }
        }
        
        // Verificar si ya hay una sesión activa
        const currentSession = sessionStorage.getItem('rincon_session');
        if (currentSession) {
            // Si hay sesión activa, redirigir directamente
            this.showMessage('🔄 Sesión activa detectada, redirigiendo...', 'info');
            setTimeout(() => {
                this.redirectToMural();
            }, 1000);
        }
    }
    
    redirectToMural() {
        // Redirigir al mural principal
        // Aquí puedes cambiar la URL según tu estructura
        window.location.href = 'mural RS UX.html';
    }
    
    showSignupModal() {
        // Crear modal para registro de nuevos usuarios
        const modalHTML = `
            <div id="signupModal" class="modal-overlay">
                <div class="modal-content metro-card">
                    <div class="cabecera-glow">
                        <h2 class="modal-titulo">✨ CREAR CUENTA ✨</h2>
                        <div class="subtitulo">Únete a la comunidad creativa</div>
                    </div>
                    
                    <form id="signupForm">
                        <div class="input-grupo">
                            <label>👤 NICKNAME</label>
                            <input type="text" id="newNickname" placeholder="Ej: artista_glitter" required>
                        </div>
                        
                        <div class="input-grupo">
                            <label>📧 EMAIL</label>
                            <input type="email" id="newEmail" placeholder="tu@email.com" required>
                        </div>
                        
                        <div class="input-grupo">
                            <label>🔒 CONTRASEÑA</label>
                            <input type="password" id="newPassword" placeholder="mínimo 6 caracteres" required>
                        </div>
                        
                        <div class="input-grupo">
                            <label>🔐 CONFIRMAR CONTRASEÑA</label>
                            <input type="password" id="confirmPassword" placeholder="repite tu contraseña" required>
                        </div>
                        
                        <button type="submit" class="btn-ingresar">
                            <span class="btn-text">REGISTRARME</span>
                            <span class="btn-glitch">🎨</span>
                        </button>
                        
                        <div class="registro-area">
                            <p>¿Ya tienes cuenta? <a href="#" id="closeToLogin">Inicia sesión →</a></p>
                        </div>
                    </form>
                    
                    <button class="modal-close">✖</button>
                </div>
            </div>
        `;
        
        // Agregar modal al body
        this.addModalToBody(modalHTML);
        
        // Configurar eventos del modal
        const modal = document.getElementById('signupModal');
        const form = document.getElementById('signupForm');
        const closeBtn = modal.querySelector('.modal-close');
        const loginLink = document.getElementById('closeToLogin');
        
        // Cerrar modal
        const closeModal = () => modal.remove();
        closeBtn.onclick = closeModal;
        if (loginLink) loginLink.onclick = closeModal;
        
        // Click fuera del modal para cerrar
        modal.onclick = (e) => {
            if (e.target === modal) closeModal();
        };
        
        // Manejar registro
        form.onsubmit = (e) => {
            e.preventDefault();
            this.handleRegistration();
            closeModal();
        };
    }
    
    handleRegistration() {
        const nickname = document.getElementById('newNickname')?.value.trim();
        const email = document.getElementById('newEmail')?.value.trim();
        const password = document.getElementById('newPassword')?.value;
        const confirmPassword = document.getElementById('confirmPassword')?.value;
        
        // Validaciones
        if (!nickname || !email || !password) {
            this.showMessage('⚠️ Todos los campos son obligatorios', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showMessage('❌ Las contraseñas no coinciden', 'error');
            return;
        }
        
        if (password.length < 6) {
            this.showMessage('❌ La contraseña debe tener al menos 6 caracteres', 'error');
            return;
        }
        
        if (!this.validateEmail(email)) {
            this.showMessage('❌ Email inválido', 'error');
            return;
        }
        
        // Verificar si el usuario ya existe
        if (this.users[nickname]) {
            this.showMessage('❌ El nickname ya está en uso', 'error');
            return;
        }
        
        for (let user of Object.values(this.users)) {
            if (user.email === email) {
                this.showMessage('❌ El email ya está registrado', 'error');
                return;
            }
        }
        
        // Crear nuevo usuario
        const newUser = {
            password: password,
            email: email,
            nickname: nickname,
            joinDate: new Date().toISOString().split('T')[0],
            avatar: '🌟',
            posts: 0
        };
        
        this.users[nickname] = newUser;
        localStorage.setItem('rincon_creativo_users', JSON.stringify(this.users));
        
        this.showMessage(`🎉 ¡Bienvenid@ ${nickname}! Ahora inicia sesión 🎉`, 'success');
        
        // Auto-completar el campo de login
        if (this.usernameInput) {
            this.usernameInput.value = nickname;
        }
    }
    
    showForgotPasswordModal() {
        const modalHTML = `
            <div id="forgotModal" class="modal-overlay">
                <div class="modal-content metro-card">
                    <div class="cabecera-glow">
                        <h2 class="modal-titulo">🔐 RECUPERAR CONTRASEÑA</h2>
                        <div class="subtitulo">Te enviaremos instrucciones</div>
                    </div>
                    
                    <form id="forgotForm">
                        <div class="input-grupo">
                            <label>📧 EMAIL REGISTRADO</label>
                            <input type="email" id="recoveryEmail" placeholder="tu@email.com" required>
                        </div>
                        
                        <button type="submit" class="btn-ingresar">
                            <span class="btn-text">ENVIAR INSTRUCCIONES</span>
                            <span class="btn-glitch">📧</span>
                        </button>
                    </form>
                    
                    <button class="modal-close">✖</button>
                </div>
            </div>
        `;
        
        this.addModalToBody(modalHTML);
        
        const modal = document.getElementById('forgotModal');
        const form = document.getElementById('forgotForm');
        const closeBtn = modal.querySelector('.modal-close');
        
        const closeModal = () => modal.remove();
        closeBtn.onclick = closeModal;
        modal.onclick = (e) => {
            if (e.target === modal) closeModal();
        };
        
        form.onsubmit = (e) => {
            e.preventDefault();
            const email = document.getElementById('recoveryEmail')?.value;
            
            // Buscar usuario por email
            let foundUser = null;
            for (let [username, userData] of Object.entries(this.users)) {
                if (userData.email === email) {
                    foundUser = { username, ...userData };
                    break;
                }
            }
            
            if (foundUser) {
                // Simular envío de email
                this.showMessage(`📧 Se enviaron instrucciones a ${email}`, 'success');
                setTimeout(() => {
                    this.showMessage(`💡 Tu contraseña es: ${foundUser.password} (cámbiala después)`, 'info');
                }, 1500);
            } else {
                this.showMessage('❌ Email no encontrado', 'error');
            }
            
            setTimeout(() => closeModal(), 2000);
        };
    }
    
    updateLastLogin(username) {
        // Actualizar último login del usuario
        const lastLogins = JSON.parse(localStorage.getItem('rincon_last_logins') || '{}');
        lastLogins[username] = new Date().toISOString();
        localStorage.setItem('rincon_last_logins', JSON.stringify(lastLogins));
    }
    
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    showMessage(message, type) {
        // Crear o actualizar mensaje flotante
        let messageDiv = document.querySelector('.floating-message');
        
        if (!messageDiv) {
            messageDiv = document.createElement('div');
            messageDiv.className = 'floating-message';
            document.body.appendChild(messageDiv);
        }
        
        messageDiv.textContent = message;
        messageDiv.className = `floating-message ${type}`;
        messageDiv.style.display = 'block';
        
        // Estilos del mensaje
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
        messageDiv.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
        
        // Colores según tipo
        if (type === 'success') {
            messageDiv.style.background = 'rgba(0, 255, 100, 0.9)';
            messageDiv.style.color = '#003300';
            messageDiv.style.borderColor = '#00ff00';
        } else if (type === 'error') {
            messageDiv.style.background = 'rgba(255, 50, 50, 0.9)';
            messageDiv.style.color = '#ffffff';
            messageDiv.style.borderColor = '#ff0000';
        } else {
            messageDiv.style.background = 'rgba(255, 68, 204, 0.9)';
            messageDiv.style.color = '#ffffcc';
            messageDiv.style.borderColor = '#ff44cc';
        }
        
        // Auto-ocultar después de 3 segundos
        setTimeout(() => {
            if (messageDiv) {
                messageDiv.style.opacity = '0';
                setTimeout(() => {
                    if (messageDiv) messageDiv.style.display = 'none';
                }, 300);
            }
        }, 3000);
    }
    
    addShakeEffect() {
        const container = document.querySelector('.metro-card');
        if (container) {
            container.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                container.style.animation = '';
            }, 500);
        }
        
        // Agregar keyframes si no existen
        if (!document.querySelector('#shakeKeyframes')) {
            const style = document.createElement('style');
            style.id = 'shakeKeyframes';
            style.textContent = `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-10px); }
                    75% { transform: translateX(10px); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    addSuccessEffect() {
        const button = this.loginButton;
        if (button) {
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 200);
        }
        
        // Confetti effect
        this.createConfetti();
    }
    
    createConfetti() {
        const colors = ['#ff44cc', '#ffff00', '#00ffcc', '#ff6600', '#ff0066'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-10px';
            confetti.style.zIndex = '9999';
            confetti.style.pointerEvents = 'none';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.opacity = '0.8';
            
            document.body.appendChild(confetti);
            
            const animation = confetti.animate([
                { transform: `translate(0, 0) rotate(0deg)`, opacity: 0.8 },
                { transform: `translate(${Math.random() * 200 - 100}px, ${window.innerHeight}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
            ], {
                duration: 1500 + Math.random() * 1000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });
            
            animation.onfinish = () => confetti.remove();
        }
    }
    
    clearPasswordField() {
        if (this.passwordInput) {
            this.passwordInput.value = '';
            this.passwordInput.focus();
        }
    }
    
    addGlitchEffects() {
        // Efecto glitch aleatorio en el título
        const title = document.querySelector('.metro-titulo');
        if (title) {
            setInterval(() => {
                if (Math.random() < 0.05) { // 5% de probabilidad
                    title.style.transform = 'skew(2deg, 1deg)';
                    setTimeout(() => {
                        title.style.transform = '';
                    }, 100);
                }
            }, 3000);
        }
    }
    
    addModalToBody(modalHTML) {
        // Remover modales existentes
        const existingModals = document.querySelectorAll('.modal-overlay');
        existingModals.forEach(modal => modal.remove());
        
        // Agregar nuevo modal
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Agregar estilos CSS para el modal
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
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(8px);
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: fadeIn 0.3s ease;
                }
                
                .modal-content {
                    position: relative;
                    max-width: 450px;
                    width: 90%;
                    background: rgba(0, 0, 0, 0.9);
                    border: 2px solid #ff44cc;
                    border-radius: 20px;
                    padding: 2rem;
                    box-shadow: 0 0 30px #ff44cc;
                    animation: slideUp 0.3s ease;
                }
                
                .modal-titulo {
                    font-family: 'Press Start 2P', monospace;
                    font-size: 1rem;
                    color: #ff66ff;
                    text-shadow: 0 0 10px #ff44cc;
                    margin-bottom: 1rem;
                }
                
                .modal-close {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: #ff44cc;
                    border: none;
                    color: white;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 18px;
                    transition: all 0.2s;
                }
                
                .modal-close:hover {
                    background: #ff0066;
                    transform: scale(1.1);
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideUp {
                    from { transform: translateY(50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                .floating-message {
                    animation: slideDown 0.3s ease;
                }
                
                @keyframes slideDown {
                    from { transform: translate(-50%, -100px); opacity: 0; }
                    to { transform: translate(-50%, 0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Inicializar el sistema de login
const rinconLogin = new RinconCreativoLogin();

// Exportar para uso global (opcional)
window.rinconLogin = rinconLogin;