// ========== ESPERAR A QUE FIREBASE CARGUE ==========
document.addEventListener('DOMContentLoaded', async function() {
  
  if (typeof firebase === 'undefined') {
    console.error('Firebase no está cargado.');
    return;
  }
  
  if (typeof db === 'undefined' || typeof auth === 'undefined') {
    console.error('Firebase no está completamente inicializado.');
    return;
  }
  
  console.log('✅ Firebase listo');
  
  // ========== ELEMENTOS DEL DOM ==========
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const darkModeToggle = document.getElementById('darkModeToggleNav');
  const actionsDiv = document.querySelector('.actions');
  
  // ========== GESTIÓN DE USUARIO (Firebase Auth) ==========
  let usuarioActual = null;
  
  // Función para actualizar navbar según autenticación
  function actualizarNavbarPorAuth(user) {

    // En la página de publicaciones, ocultar botones que no queremos
    if (window.location.pathname.includes('publicaciones.html')) {
      const surveyBtn = document.getElementById('surveyBtn');
      const contactBtn = document.getElementById('contactBtnHeader');
      if (surveyBtn) surveyBtn.style.display = 'none';
      if (contactBtn) contactBtn.style.display = 'none';
    }
    
    if (!actionsDiv) return;
    
    // Eliminar botones de auth previos si existen
    const existingAuthBtns = document.querySelector('.auth-buttons');
    if (existingAuthBtns) existingAuthBtns.remove();
    
    const existingProfile = document.querySelector('.user-profile-container');
    if (existingProfile) existingProfile.remove();
    
    if (user) {
      // Usuario logueado - mostrar perfil
      const profileHtml = `
        <div class="user-profile-container" style="display: flex; align-items: center; gap: 12px;">
          <div class="user-profile-btn" id="userProfileBtn" style="display: flex; align-items: center; gap: 8px; background: var(--primary-light); padding: 0.3rem 1rem; border-radius: 40px; cursor: pointer;">
            <i class="fas fa-user-circle"></i>
            <span id="userProfileName" style="font-weight: 500;">${escapeHtml(user.displayName || user.email?.split('@')[0] || 'Usuario')}</span>
          </div>
          <button id="logoutBtn" class="btn btn-outline" style="font-size: 0.8rem;">Cerrar sesión</button>
        </div>
      `;
      actionsDiv.insertAdjacentHTML('beforeend', profileHtml);
      
      document.getElementById('logoutBtn').addEventListener('click', async () => {
        await auth.signOut();
        location.reload();
      });
      
      // MODIFICADO: Ahora abre el modal de editar perfil en lugar de un alert
      document.getElementById('userProfileBtn').addEventListener('click', () => {
        mostrarModalEditarPerfil(user);
      });
      
    } else {
      // Usuario no logueado - mostrar botones registro/login
      const authHtml = `
        <div class="auth-buttons" style="display: flex; gap: 8px;">
          <button id="loginBtnNav" class="btn btn-outline">Iniciar sesión</button>
          <button id="registerBtnNav" class="btn btn-primary">Registrarse</button>
        </div>
      `;
      actionsDiv.insertAdjacentHTML('beforeend', authHtml);
      
      document.getElementById('loginBtnNav').addEventListener('click', () => mostrarModalLogin());
      document.getElementById('registerBtnNav').addEventListener('click', () => mostrarModalRegistro());
    }
  }
  
  // ========== MODALES PROFESIONALES (con estilos consistentes) ==========
  function mostrarModalLogin() {
    const modal = document.createElement('div');
    modal.className = 'modal auth-modal';
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.8); display: flex; align-items: center;
      justify-content: center; z-index: 2000;
    `;
    modal.innerHTML = `
      <div class="modal-container">
        <h2><i class="fas fa-sign-in-alt"></i> Bienvenido</h2>
        <input type="email" id="loginEmail" placeholder="Correo electrónico">
        <input type="password" id="loginPassword" placeholder="Contraseña">
        <button id="btnLogin" class="btn btn-primary">Iniciar sesión</button>
        <p id="loginError" class="error-msg"></p>
        <button id="closeAuthModal" class="close-btn">Cancelar</button>
      </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('btnLogin').addEventListener('click', async () => {
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      try {
        await auth.signInWithEmailAndPassword(email, password);
        modal.remove();
        location.reload();
      } catch (error) {
        document.getElementById('loginError').textContent = '❌ ' + error.message;
      }
    });
    
    document.getElementById('closeAuthModal').addEventListener('click', () => modal.remove());
  }
  
  function mostrarModalRegistro() {
    const modal = document.createElement('div');
    modal.className = 'modal auth-modal';
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.8); display: flex; align-items: center;
      justify-content: center; z-index: 2000;
    `;
    modal.innerHTML = `
      <div class="modal-container">
        <h2><i class="fas fa-user-plus"></i> Crear cuenta</h2>
        <input type="text" id="regNombre" placeholder="Nombre">
        <input type="text" id="regApellido" placeholder="Apellido">
        <input type="email" id="regEmail" placeholder="Correo electrónico">
        <input type="password" id="regPassword" placeholder="Contraseña">
        <button id="btnRegister" class="btn btn-primary">Registrarse</button>
        <p id="registerError" class="error-msg"></p>
        <button id="closeAuthModal" class="close-btn">Cancelar</button>
      </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('btnRegister').addEventListener('click', async () => {
      const nombre = document.getElementById('regNombre').value;
      const apellido = document.getElementById('regApellido').value;
      const email = document.getElementById('regEmail').value;
      const password = document.getElementById('regPassword').value;
      
      if (!nombre || !apellido || !email || !password) {
        document.getElementById('registerError').textContent = '❌ Todos los campos son obligatorios';
        return;
      }
      
      try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        await userCredential.user.updateProfile({ displayName: `${nombre} ${apellido}` });
        await db.collection('usuarios').doc(userCredential.user.uid).set({
          nombre, apellido, email,
          fechaRegistro: firebase.firestore.FieldValue.serverTimestamp()
        });
        modal.remove();
        location.reload();
      } catch (error) {
        document.getElementById('registerError').textContent = '❌ ' + error.message;
      }
    });
    
    document.getElementById('closeAuthModal').addEventListener('click', () => modal.remove());
  }
  
  // ========== NUEVA FUNCIÓN: MODAL EDITAR PERFIL ==========
  function mostrarModalEditarPerfil(user) {
    // Obtener nombre y apellido actuales
    let nombreActual = '';
    let apellidoActual = '';
    if (user.displayName) {
      const partes = user.displayName.split(' ');
      nombreActual = partes[0] || '';
      apellidoActual = partes.slice(1).join(' ') || '';
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal auth-modal';
    modal.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.8); display: flex; align-items: center;
      justify-content: center; z-index: 2000;
    `;
    modal.innerHTML = `
      <div class="modal-container">
        <h2><i class="fas fa-user-edit"></i> Editar perfil</h2>
        <p style="margin-bottom: 1rem; font-size: 0.85rem; color: var(--text-muted-light);">
          <i class="fas fa-envelope"></i> ${escapeHtml(user.email)}
        </p>
        <input type="text" id="editNombre" placeholder="Nombre" value="${escapeHtml(nombreActual)}">
        <input type="text" id="editApellido" placeholder="Apellido" value="${escapeHtml(apellidoActual)}">
        <button id="btnGuardarPerfil" class="btn btn-primary">Guardar cambios</button>
        <p id="editPerfilError" class="error-msg"></p>
        <button id="closeEditModal" class="close-btn">Cancelar</button>
      </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('btnGuardarPerfil').addEventListener('click', async () => {
      const nuevoNombre = document.getElementById('editNombre').value.trim();
      const nuevoApellido = document.getElementById('editApellido').value.trim();
      
      if (!nuevoNombre || !nuevoApellido) {
        document.getElementById('editPerfilError').textContent = '❌ Nombre y apellido son obligatorios';
        return;
      }
      
      const nuevoDisplayName = `${nuevoNombre} ${nuevoApellido}`;
      
      try {
        // Actualizar en Firebase Auth
        await user.updateProfile({ displayName: nuevoDisplayName });
        
        // Actualizar en Firestore colección 'usuarios'
        await db.collection('usuarios').doc(user.uid).update({
          nombre: nuevoNombre,
          apellido: nuevoApellido,
          displayName: nuevoDisplayName
        });
        
        modal.remove();
        
        // Recargar la página para actualizar el navbar
        location.reload();
        
      } catch (error) {
        document.getElementById('editPerfilError').textContent = '❌ Error: ' + error.message;
      }
    });
    
    document.getElementById('closeEditModal').addEventListener('click', () => modal.remove());
  }
  
  // ========== FUNCIÓN AUXILIAR PARA ESCAPAR HTML ==========
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
      if (m === '&') return '&amp;';
      if (m === '<') return '&lt;';
      if (m === '>') return '&gt;';
      return m;
    });
  }
  
  // ========== MENÚ HAMBURGUESA ==========
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }
  
  // ========== MODO OSCURO ==========
  if (darkModeToggle) {
    const icon = darkModeToggle.querySelector('i');
    if (localStorage.getItem('darkMode') === 'enabled') {
      document.body.classList.add('dark-mode');
      if (icon) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      }
    }
    
    darkModeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const currentIcon = darkModeToggle.querySelector('i');
      if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
        currentIcon.classList.remove('fa-moon');
        currentIcon.classList.add('fa-sun');
      } else {
        localStorage.setItem('darkMode', 'disabled');
        currentIcon.classList.remove('fa-sun');
        currentIcon.classList.add('fa-moon');
      }
    });
  }
  
  // Agregar "Volver al inicio" en el navbar si estamos en publicaciones
  if (window.location.pathname.includes('publicaciones.html')) {
    const nav = document.getElementById('nav-menu');
    if (nav && !document.querySelector('.back-home-btn')) {
      const backBtn = document.createElement('a');
      backBtn.href = 'index.html';
      backBtn.innerHTML = '<i class="fas fa-home"></i> Volver al inicio';
      backBtn.className = 'back-home-btn';
      backBtn.style.cssText = 'background: var(--primary-light); border-radius: 40px; padding: 0.3rem 1rem;';
      nav.appendChild(backBtn);
    }
  }
  
  // ========== NAVEGACIÓN SUAVE ==========
  if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
    document.querySelectorAll('nav a[href*="#"], .hero-buttons .btn, #heroVideo, #contactBtnHeader').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href && href.includes('#') && !href.includes('publicaciones')) {
          e.preventDefault();
          const hash = href.split('#')[1];
          const targetElement = document.getElementById(hash);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (navMenu.classList.contains('active')) navMenu.classList.remove('active');
          }
        }
      });
    });
  }
  
  const heroCta = document.getElementById('heroCta');
  if(heroCta) heroCta.addEventListener('click', () => document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' }));
  
  const heroVideo = document.getElementById('heroVideo');
  if(heroVideo) heroVideo.addEventListener('click', () => document.getElementById('servicios').scrollIntoView({ behavior: 'smooth' }));
  
  const contactBtnHeader = document.getElementById('contactBtnHeader');
  if(contactBtnHeader) contactBtnHeader.addEventListener('click', () => document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' }));
  
// ========== FORMULARIO DE CONTACTO CON EMAILJS ==========
const contactForm = document.getElementById('contactForm');
const feedbackDiv = document.getElementById('form-feedback');

if(contactForm){
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const service = document.getElementById('serviceSelect').value;
        const message = document.getElementById('message').value.trim();
        
        if(!name || !email) {
            feedbackDiv.innerHTML = '<span style="color:#c2410c;">❌ Completa nombre y correo.</span>';
            return;
        }
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Enviando...';
        submitBtn.disabled = true;
        
        try {
            // 1. Guardar en Firebase (tu código existente)
            await db.collection('contactos').add({
                nombre: name, 
                email: email, 
                telefono: phone, 
                servicio: service, 
                mensaje: message,
                fecha: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // 2. Enviar email con EmailJS
            const templateParams = {
                from_name: name,
                from_email: email,
                phone: phone,
                service: service,
                message: message,
                to_email: 'alejocrak321zuniga@gmail.com' // Email del dentista
            };
            
            await emailjs.send(
                'service_s8261oe',      // Reemplaza con tu Service ID
                'template_ke12e27',     // Reemplaza con tu Template ID  
                templateParams
            );
            
            feedbackDiv.innerHTML = '<span style="color:#1f7faa;">✅ ¡Mensaje enviado! Te contactaremos pronto.</span>';
            contactForm.reset();
            setTimeout(() => feedbackDiv.innerHTML = '', 4000);
            
        } catch (error) {
            console.error(error);
            feedbackDiv.innerHTML = '<span style="color:#c2410c;">❌ Error al enviar. Intenta nuevamente.</span>';
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}
  
  // ========== MODAL ENCUESTA ==========
  const surveyBtn = document.getElementById('surveyBtn');
  const surveyModal = document.getElementById('surveyModal');
  const closeModal = document.getElementById('closeModal');
  const surveyFeedbackSpan = document.getElementById('surveyFeedback');
  
  function openModal() { if(surveyModal) surveyModal.style.display = 'flex'; }
  function closeModalFunc() { if(surveyModal) surveyModal.style.display = 'none'; if(surveyFeedbackSpan) surveyFeedbackSpan.innerText = ''; }
  
  if(surveyBtn) surveyBtn.addEventListener('click', () => {
    if (!usuarioActual) {
      alert('🔐 Debes iniciar sesión para participar en la encuesta.');
      mostrarModalLogin();
      return;
    }
    openModal();
  });
  
  if(closeModal) closeModal.addEventListener('click', closeModalFunc);
  window.addEventListener('click', (e) => { if(e.target === surveyModal) closeModalFunc(); });
  
  async function guardarEncuesta(valoracion) {
    if (!usuarioActual) return;
    try {
      await db.collection('encuestas').add({
        valoracion: valoracion, fecha: firebase.firestore.FieldValue.serverTimestamp(),
        userId: usuarioActual.uid, userEmail: usuarioActual.email, userName: usuarioActual.displayName
      });
    } catch (error) { console.error(error); }
  }
  
  if(document.querySelectorAll('.survey-opt').length) {
    document.querySelectorAll('.survey-opt').forEach(opt => {
      opt.addEventListener('click', async (e) => {
        if (!usuarioActual) { alert('Inicia sesión primero'); closeModalFunc(); return; }
        const selected = e.target.innerText;
        surveyFeedbackSpan.innerText = `¡Gracias ${usuarioActual.displayName}! 🦷`;
        await guardarEncuesta(selected);
        setTimeout(() => closeModalFunc(), 1500);
      });
    });
  }
  
  // ========== PUBLICACIONES ==========
  if (window.location.pathname.includes('publicaciones.html')) {
    
    console.log('📄 Página de publicaciones');
    
    let paginaActual = 1;
    const PUBLICACIONES_POR_PAGINA = 3;
    let totalPaginas = 1;
    let todasLasPublicaciones = [];
    
    // Estado de comentarios paginados
    let comentariosCache = {};
    
    async function usuarioYaDioLike(postId) {
      if (!usuarioActual) return false;
      const likeQuery = await db.collection('likes')
        .where('userId', '==', usuarioActual.uid)
        .where('postId', '==', postId)
        .get();
      return !likeQuery.empty;
    }
    
    async function darLike(postId, elementoBoton) {
      if (!usuarioActual) {
        alert('🔐 Inicia sesión para dar like');
        mostrarModalLogin();
        return;
      }
      
      const yaLiked = await usuarioYaDioLike(postId);
      
      // Animación del corazón
      const icono = elementoBoton.querySelector('i');
      icono.style.transform = 'scale(1.3)';
      setTimeout(() => { icono.style.transform = 'scale(1)'; }, 200);
      
      if (yaLiked) {
        // Solo animación, no envía like nuevamente
        console.log('Ya diste like antes');
        return;
      }
      
      try {
        await db.collection('likes').add({
          userId: usuarioActual.uid, userName: usuarioActual.displayName, userEmail: usuarioActual.email,
          postId: postId, fecha: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        const postRef = db.collection('publicaciones').doc(postId);
        const postDoc = await postRef.get();
        const likesActuales = postDoc.data().likes || 0;
        await postRef.update({ likes: likesActuales + 1 });
        
        icono.className = 'fas fa-heart';
        elementoBoton.style.color = '#e74c3c';
        const likeCountSpan = elementoBoton.querySelector('.like-count');
        if (likeCountSpan) likeCountSpan.textContent = likesActuales + 1;
        
      } catch (error) { console.error(error); }
    }
    
    async function actualizarContadorComentarios(postId) {
      try {
        const comentariosSnapshot = await db.collection('comentarios').where('postId', '==', postId).get();
        const nuevoContador = comentariosSnapshot.size;
        await db.collection('publicaciones').doc(postId).update({ comentariosCount: nuevoContador });
        const commentsCountSpan = document.querySelector(`.facebook-post[data-post-id="${postId}"] .comments-count`);
        if (commentsCountSpan) commentsCountSpan.textContent = nuevoContador;
        return nuevoContador;
      } catch (error) { return 0; }
    }
    
    async function agregarComentario(postId, texto) {
      if (!texto.trim()) return;
      if (!usuarioActual) {
        alert('🔐 Inicia sesión para comentar');
        mostrarModalLogin();
        return;
      }
      
      try {
        await db.collection('comentarios').add({
          postId: postId, texto: texto.trim(), fecha: firebase.firestore.FieldValue.serverTimestamp(),
          userId: usuarioActual.uid, nombreUsuario: usuarioActual.displayName, emailUsuario: usuarioActual.email
        });
        
        // Resetear caché de comentarios para este post
        delete comentariosCache[postId];
        await cargarComentarios(postId, 1);
        await actualizarContadorComentarios(postId);
        
      } catch (error) { alert('Error al enviar comentario.'); }
    }
    
    async function manejarMasComentarios(e) {
      const btn = e.target;
      const postId = btn.dataset.postId;
      const pagina = parseInt(btn.dataset.pagina);
      await cargarComentarios(postId, pagina, true);
      btn.remove();
    }
    
    function renderizarPost(post, postId) {
      let fechaTexto = 'Fecha no disponible';
      if (post.fechaCreacion) {
        if (post.fechaCreacion.toDate) fechaTexto = post.fechaCreacion.toDate().toLocaleDateString('es-ES');
        else if (post.fechaCreacion.toLocaleDateString) fechaTexto = post.fechaCreacion.toLocaleDateString('es-ES');
      }
      
      return `
        <div class="facebook-post" data-post-id="${postId}">
          <div class="post-header">
            <div class="post-avatar"><i class="fas fa-tooth"></i></div>
            <div class="post-author-info">
              <h4>DentalCare Clínica Dental</h4>
              <span><i class="far fa-calendar-alt"></i> ${fechaTexto}</span>
            </div>
          </div>
          ${post.imagen ? `<img class="post-image" src="${post.imagen}" alt="${post.titulo}" loading="lazy">` : ''}
          <div class="post-content">
            <h3 class="post-title">${escapeHtml(post.titulo)}</h3>
            <p class="post-description">${escapeHtml(post.descripcion)}</p>
          </div>
          <div class="post-stats">
            <span class="like-btn" data-post-id="${postId}">
              <i class="far fa-heart"></i> <span class="like-count">${post.likes || 0}</span> Me gusta
            </span>
            <span class="comments-toggle" data-post-id="${postId}">
              <i class="far fa-comment"></i> <span class="comments-count">${post.comentariosCount || 0}</span> Comentarios
            </span>
          </div>
          <div class="comments-section" id="comments-${postId}" style="display:none;">
            <div class="comments-list" id="comments-list-${postId}"></div>
            <div class="add-comment">
              <input type="text" class="comment-input" placeholder="Escribe un comentario...">
              <button class="btn-comment-submit" data-post-id="${postId}">Enviar</button>
            </div>
          </div>
        </div>
      `;
    }
    
    async function cargarComentarios(postId, pagina = 1, append = false) {
      const container = document.getElementById(`comments-list-${postId}`);
      if (!container) return;
      
      if (!append) container.innerHTML = '<div style="text-align:center; padding:1rem;">Cargando...</div>';
      
      try {
        const snapshot = await db.collection('comentarios')
          .where('postId', '==', postId)
          .orderBy('fecha', 'desc')
          .limit(5)
          .get();
        
        if (snapshot.empty && !append) {
          container.innerHTML = '<div style="text-align:center; color: var(--text-muted-light); padding:1rem;">No hay comentarios. ¡Sé el primero!</div>';
          return;
        }
        
        let html = '';
        snapshot.forEach(doc => {
          const data = doc.data();
          const fecha = data.fecha?.toDate?.() ? data.fecha.toDate().toLocaleString('es-ES') : 'Fecha reciente';
          html += `
            <div class="comment-item">
              <div class="comment-author"><i class="fas fa-user-circle"></i> ${escapeHtml(data.nombreUsuario || 'Usuario')}</div>
              <div class="comment-text">${escapeHtml(data.texto)}</div>
              <div class="comment-date">${fecha}</div>
            </div>
          `;
        });
        
        if (append) {
          container.insertAdjacentHTML('beforeend', html);
        } else {
          container.innerHTML = html;
        }
        
        if (snapshot.size === 5) {
          const loadMoreBtn = document.createElement('button');
          loadMoreBtn.textContent = 'Mostrar más comentarios ↓';
          loadMoreBtn.className = 'btn-more-comments';
          loadMoreBtn.dataset.postId = postId;
          loadMoreBtn.dataset.pagina = pagina + 1;
          loadMoreBtn.style.cssText = 'margin-top:0.8rem; background:none; border:1px solid var(--primary); border-radius:2rem; padding:0.4rem 1rem; cursor:pointer; width:100%;';
          loadMoreBtn.onclick = () => cargarComentarios(postId, pagina + 1, true);
          container.appendChild(loadMoreBtn);
        }
      } catch (error) {
        console.error(error);
        container.innerHTML = '<div style="color:red; text-align:center;">Error al cargar comentarios</div>';
      }
    }
    
    async function cargarPublicaciones() {
      const feed = document.getElementById('facebookFeed');
      if (!feed) return;
      
      feed.innerHTML = '<div class="loading-pubs"><i class="fas fa-spinner fa-pulse"></i> Cargando publicaciones...</div>';
      
      try {
        const publicacionesSnapshot = await db.collection('publicaciones').orderBy('fechaCreacion', 'desc').get();
        todasLasPublicaciones = [];
        publicacionesSnapshot.forEach(doc => { todasLasPublicaciones.push({ id: doc.id, ...doc.data() }); });
        
        if (todasLasPublicaciones.length === 0) {
          feed.innerHTML = '<div class="loading-pubs">📭 No hay publicaciones disponibles.</div>';
          return;
        }
        
        totalPaginas = Math.ceil(todasLasPublicaciones.length / PUBLICACIONES_POR_PAGINA);
        cargarPagina(1);
        setupPagination();
        
      } catch (error) { feed.innerHTML = '<div class="loading-pubs">❌ Error al cargar publicaciones.</div>'; }
    }
    
    async function cargarPagina(pagina) {
      const feed = document.getElementById('facebookFeed');
      const inicio = (pagina - 1) * PUBLICACIONES_POR_PAGINA;
      const fin = inicio + PUBLICACIONES_POR_PAGINA;
      const publicacionesPagina = todasLasPublicaciones.slice(inicio, fin);
      
      feed.innerHTML = publicacionesPagina.map(post => renderizarPost(post, post.id)).join('');
      
      for (const post of publicacionesPagina) {
        if (usuarioActual && await usuarioYaDioLike(post.id)) {
          const likeSpan = document.querySelector(`.facebook-post[data-post-id="${post.id}"] .like-btn`);
          if (likeSpan) {
            likeSpan.querySelector('i').className = 'fas fa-heart';
            likeSpan.style.color = '#e74c3c';
          }
        }
      }
      
      document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          darLike(btn.dataset.postId, btn);
        });
      });
      
      document.querySelectorAll('.comments-toggle').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          e.stopPropagation();
          const postId = btn.dataset.postId;
          const section = document.getElementById(`comments-${postId}`);
          if (section) {
            const isVisible = section.style.display === 'block';
            section.style.display = isVisible ? 'none' : 'block';
            if (!isVisible) await cargarComentarios(postId, 1);
          }
        });
      });
      
      document.querySelectorAll('.btn-comment-submit').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const postId = btn.dataset.postId;
          const input = document.querySelector(`#comments-${postId} .comment-input`);
          if (input && input.value.trim()) {
            await agregarComentario(postId, input.value);
            input.value = '';
          } else alert('Escribe un comentario.');
        });
      });
      
      document.getElementById('pageInfo').textContent = `Página ${pagina} de ${totalPaginas}`;
      document.getElementById('prevPageBtn').disabled = (pagina === 1);
      document.getElementById('nextPageBtn').disabled = (pagina === totalPaginas);
      paginaActual = pagina;
    }
    
    function setupPagination() {
      document.getElementById('prevPageBtn').addEventListener('click', () => {
        if (paginaActual > 1) cargarPagina(paginaActual - 1);
      });
      document.getElementById('nextPageBtn').addEventListener('click', () => {
        if (paginaActual < totalPaginas) cargarPagina(paginaActual + 1);
      });
    }
    
    // Escuchar cambios en autenticación
    auth.onAuthStateChanged(async (user) => {
      usuarioActual = user;
      actualizarNavbarPorAuth(user);
      if (window.location.pathname.includes('publicaciones.html') && todasLasPublicaciones.length > 0) {
        await cargarPagina(paginaActual);
      }
    });
    
    cargarPublicaciones();
  }
  
  // Cerrar menú al hacer click fuera
  document.addEventListener('click', function(event) {
    if (navMenu && navMenu.classList && navMenu.classList.contains('active')) {
      const isClickInsideNav = navMenu.contains(event.target);
      const isToggle = menuToggle && menuToggle.contains(event.target);
      if (!isClickInsideNav && !isToggle) navMenu.classList.remove('active');
    }
  });
  
});