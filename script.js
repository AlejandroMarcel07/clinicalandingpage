// ========== MENÚ HAMBURGUESA ==========
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });
}

// ========== MODO OSCURO / CLARO ==========
const darkModeToggle = document.getElementById('darkModeToggleNav');
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
if(heroCta) {
  heroCta.addEventListener('click', () => {
    document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });
  });
}

const heroVideo = document.getElementById('heroVideo');
if(heroVideo){
  heroVideo.addEventListener('click', () => {
    document.getElementById('servicios').scrollIntoView({ behavior: 'smooth' });
  });
}

const contactBtnHeader = document.getElementById('contactBtnHeader');
if(contactBtnHeader){
  contactBtnHeader.addEventListener('click', () => {
    document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });
  });
}

// ========== FORMULARIO DE CONTACTO ==========
const contactForm = document.getElementById('contactForm');
const feedbackDiv = document.getElementById('form-feedback');

if(contactForm){
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    if(!name || !email) {
      feedbackDiv.innerHTML = '<span style="color:#c2410c;">❌ Por favor completa nombre y correo.</span>';
      return;
    }
    feedbackDiv.innerHTML = '<span style="color:#1f7faa;">✅ ¡Mensaje enviado! Te contactaremos pronto.</span>';
    contactForm.reset();
    setTimeout(() => { feedbackDiv.innerHTML = ''; }, 4000);
  });
}

// ========== MODAL ENCUESTA ==========
const surveyBtn = document.getElementById('surveyBtn');
const surveyModal = document.getElementById('surveyModal');
const closeModal = document.getElementById('closeModal');
const surveyFeedbackSpan = document.getElementById('surveyFeedback');

function openModal() { if(surveyModal) surveyModal.style.display = 'flex'; }
function closeModalFunc() { if(surveyModal) surveyModal.style.display = 'none'; if(surveyFeedbackSpan) surveyFeedbackSpan.innerText = ''; }

if(surveyBtn) surveyBtn.addEventListener('click', openModal);
if(closeModal) closeModal.addEventListener('click', closeModalFunc);
window.addEventListener('click', (e) => { if(e.target === surveyModal) closeModalFunc(); });

if(document.querySelectorAll('.survey-opt').length) {
  document.querySelectorAll('.survey-opt').forEach(opt => {
    opt.addEventListener('click', (e) => {
      const selected = e.target.innerText;
      surveyFeedbackSpan.innerText = `¡Gracias por tu valoración: ${selected}! 🦷`;
      setTimeout(() => { if(surveyModal.style.display === 'flex') closeModalFunc(); }, 1500);
    });
  });
}

// ========== PUBLICACIONES CON PAGINACIÓN (MÁS RECIENTES PRIMERO) ==========
const TODAS_LAS_PUBLICACIONES = [
  {
    id: 1,
    imagen: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&auto=format",
    titulo: "🦷 Beneficios del blanqueamiento dental",
    descripcion: "Descubre cómo nuestro blanqueamiento profesional puede aclarar tus dientes hasta 8 tonos en una sola sesión. ¡Pregunta por nuestras promociones de marzo!",
    fecha: "15 de marzo, 2025",
    likes: 124,
    comments: 18
  },
  {
    id: 2,
    imagen: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format",
    titulo: "✨ Nueva tecnología 3D en implantes",
    descripcion: "Ahora contamos con planificación digital y guías quirúrgicas impresas en 3D para implantes más precisos y menos invasivos. ¡Resultados garantizados!",
    fecha: "10 de marzo, 2025",
    likes: 89,
    comments: 12
  },
  {
    id: 3,
    imagen: "https://images.unsplash.com/photo-1530026402336-89d7b2ed4601?w=800&auto=format",
    titulo: "🎉 Día de la sonrisa - Descuentos especiales",
    descripcion: "Durante todo abril, 20% de descuento en ortodoncia y limpiezas. ¡Agenda tu cita y luce una sonrisa espectacular! Promoción válida hasta el 30 de abril.",
    fecha: "5 de marzo, 2025",
    likes: 256,
    comments: 34
  },
  {
    id: 4,
    imagen: "https://images.unsplash.com/photo-1629909615184-74f495363b67?w=800&auto=format",
    titulo: "👶 Consejos para la salud bucal infantil",
    descripcion: "Enseña a tus hijos buenos hábitos desde pequeños. Nuestra odontopediatra comparte tips para evitar caries en niños y hacer del cepillado un momento divertido.",
    fecha: "28 de febrero, 2025",
    likes: 67,
    comments: 9
  },
  {
    id: 5,
    imagen: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format",
    titulo: "🏆 Reconocimiento como mejor clínica dental 2025",
    descripcion: "¡Estamos felices de compartirles que fuimos galardonados como la mejor clínica dental del año! Gracias a todos nuestros pacientes por su confianza.",
    fecha: "20 de febrero, 2025",
    likes: 342,
    comments: 56
  },
  {
    id: 6,
    imagen: "https://images.unsplash.com/photo-1588776814112-4b8c93eec1c2?w=800&auto=format",
    titulo: "🦷 Cuidados post-extracción dental",
    descripcion: "Te compartimos una guía completa sobre los cuidados que debes tener después de una extracción dental para una pronta recuperación.",
    fecha: "15 de febrero, 2025",
    likes: 45,
    comments: 7
  },
  {
    id: 7,
    imagen: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&auto=format",
    titulo: "📢 Promoción: Limpieza dental + Revisión",
    descripcion: "Aprovecha nuestro combo de limpieza dental con revisión completa por solo $49. ¡Agenda tu cita hoy mismo!",
    fecha: "10 de febrero, 2025",
    likes: 178,
    comments: 23
  },
  {
    id: 8,
    imagen: "https://images.unsplash.com/photo-1530026402336-89d7b2ed4601?w=800&auto=format",
    titulo: "😷 ¿Cómo prevenir las caries?",
    descripcion: "Consejos prácticos para mantener una buena higiene bucal y prevenir la aparición de caries en toda la familia.",
    fecha: "5 de febrero, 2025",
    likes: 92,
    comments: 14
  }
];

// Ordenar de más reciente a más antigua (asumiendo que la fecha en string es YYYY-MM-DD o similar, aquí usamos orden inverso por id como proxy)
// Como las fechas están en formato "15 de marzo, 2025", no son fácilmente comparables, así que usamos el id inverso (mayor id = más reciente)
const PUBLICACIONES_ORDENADAS = [...TODAS_LAS_PUBLICACIONES].sort((a, b) => b.id - a.id);

let paginaActual = 1;
const PUBLICACIONES_POR_PAGINA = 3;
const totalPaginas = Math.ceil(PUBLICACIONES_ORDENADAS.length / PUBLICACIONES_POR_PAGINA);

function renderizarPost(post) {
  return `
    <div class="facebook-post">
      <div class="post-header">
        <div class="post-avatar">
          <i class="fas fa-tooth"></i>
        </div>
        <div class="post-author-info">
          <h4>DentalCare Clínica Dental</h4>
          <span><i class="far fa-clock"></i> ${post.fecha}</span>
        </div>
      </div>
      <img class="post-image" src="${post.imagen}" alt="${post.titulo}" loading="lazy">
      <div class="post-content">
        <h3 class="post-title">${post.titulo}</h3>
        <p class="post-description">${post.descripcion}</p>
      </div>
      <div class="post-stats">
        <span><i class="far fa-heart"></i> ${post.likes} Me gusta</span>
        <span><i class="far fa-comment"></i> ${post.comments} Comentarios</span>
        <span><i class="far fa-share-square"></i> Compartir</span>
      </div>
    </div>
  `;
}

function cargarPagina(pagina) {
  const feed = document.getElementById('facebookFeed');
  if (!feed) return;
  
  const inicio = (pagina - 1) * PUBLICACIONES_POR_PAGINA;
  const fin = inicio + PUBLICACIONES_POR_PAGINA;
  const publicacionesPagina = PUBLICACIONES_ORDENADAS.slice(inicio, fin);
  
  if (publicacionesPagina.length === 0) {
    feed.innerHTML = '<div class="loading-pubs">📭 No hay publicaciones en esta página</div>';
  } else {
    feed.innerHTML = publicacionesPagina.map(post => renderizarPost(post)).join('');
  }
  
  const pageInfo = document.getElementById('pageInfo');
  if (pageInfo) {
    pageInfo.textContent = `Página ${pagina} de ${totalPaginas}`;
  }
  
  const prevBtn = document.getElementById('prevPageBtn');
  const nextBtn = document.getElementById('nextPageBtn');
  
  if (prevBtn) prevBtn.disabled = (pagina === 1);
  if (nextBtn) nextBtn.disabled = (pagina === totalPaginas);
}

function setupPagination() {
  const prevBtn = document.getElementById('prevPageBtn');
  const nextBtn = document.getElementById('nextPageBtn');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (paginaActual > 1) {
        paginaActual--;
        cargarPagina(paginaActual);
        const feedElement = document.getElementById('facebookFeed');
        if (feedElement) {
          feedElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (paginaActual < totalPaginas) {
        paginaActual++;
        cargarPagina(paginaActual);
        const feedElement = document.getElementById('facebookFeed');
        if (feedElement) {
          feedElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }
}

// Inicializar publicaciones si estamos en la página correspondiente
if (window.location.pathname.includes('publicaciones.html')) {
  cargarPagina(1);
  setupPagination();
}

// Cerrar menú al hacer click fuera
document.addEventListener('click', function(event) {
  if (navMenu && navMenu.classList && navMenu.classList.contains('active')) {
    const isClickInsideNav = navMenu.contains(event.target);
    const isToggle = menuToggle && menuToggle.contains(event.target);
    if (!isClickInsideNav && !isToggle) {
      navMenu.classList.remove('active');
    }
  }
});