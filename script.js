
function agendarConsulta() {
    // Redireciona para WhatsApp com mensagem pré-formatada
    const telefone = '5592984143932';
    const mensagem = encodeURIComponent(
        'Olá! Gostaria de agendar uma consulta na Clin Odonto Manaus. Qual seria a melhor data e horário para você?'
    );
    window.open(`https://wa.me/${telefone}?text=${mensagem}`, '_blank');
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        if (href === '#' || href === '') {
            return;
        }

        const targetElement = document.querySelector(href);
        
        if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeIn 0.8s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);


document.querySelectorAll('.service-card, .contact-card, .beneficios-list li').forEach(el => {
    observer.observe(el);
});

function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

updateActiveLink();

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validarTelefone(telefone) {
    const regex = /^(\d{2})\s?(\d{4,5})-?(\d{4})$/;
    return regex.test(telefone);
}

function copiarParaClipboard(texto) {
    navigator.clipboard.writeText(texto).then(() => {
        alert('Copiado para a área de transferência!');
    }).catch(err => {
        console.error('Erro ao copiar:', err);
    });
}

function rastrearClique(evento, label) {
    if (window.gtag) {
        gtag('event', 'clique', {
            'evento': evento,
            'label': label
        });
    }
}

document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const label = this.textContent.trim();
        rastrearClique('botao_clicado', label);
    });
});


if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Clin Odonto Manaus - Site carregado com sucesso!');
    
    const contatoLinks = document.querySelectorAll('.contact-card');
    contatoLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href) {
                rastrearClique('contato_clicado', href);
            }
        });
    });

    const agendamentoButtons = document.querySelectorAll('[onclick="agendarConsulta()"]');
    agendamentoButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            rastrearClique('agendamento_clicado', 'whatsapp');
        });
    });
});

function detectarModoEscuro() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-mode');
    }
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (e.matches) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
});

function scrollParaTopo() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

window.addEventListener('scroll', function() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        if (window.scrollY > 300) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    }
});

function validarFormularioContato(event) {
    event.preventDefault();

    const nome = document.getElementById('nome')?.value;
    const email = document.getElementById('email')?.value;
    const mensagem = document.getElementById('mensagem')?.value;

    if (!nome || !email || !mensagem) {
        alert('Por favor, preencha todos os campos!');
        return false;
    }

    if (!validarEmail(email)) {
        alert('Por favor, insira um email válido!');
        return false;
    }

    console.log('Formulário válido:', { nome, email, mensagem });
    alert('Mensagem enviada com sucesso!');
    return false;
}

function formatarTelefone(telefone) {
    const apenasNumeros = telefone.replace(/\D/g, '');
    
    if (apenasNumeros.length === 11) {
        return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 7)}-${apenasNumeros.slice(7)}`;
    } else if (apenasNumeros.length === 10) {
        return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 6)}-${apenasNumeros.slice(6)}`;
    }
    
    return telefone;
}

function enviarEmail(formularioId) {
    const formulario = document.getElementById(formularioId);
    
    if (formulario) {
        formulario.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            
            fetch('https://formspree.io/f/SEU_ID_AQUI', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    alert('Email enviado com sucesso!');
                    formulario.reset();
                } else {
                    alert('Erro ao enviar email. Tente novamente.');
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Erro ao enviar email. Tente novamente.');
            });
        });
    }
}

function inicializarAnalytics() {

function verificarSuporte() {
    const suporte = {
        localStorage: typeof(Storage) !== 'undefined',
        geolocation: 'geolocation' in navigator,
        notification: 'Notification' in window,
        serviceWorker: 'serviceWorker' in navigator
    };

    console.log('Suporte do navegador:', suporte);
    return suporte;
}

verificarSuporte();

window.clinOdonto = {
    agendarConsulta,
    copiarParaClipboard,
    validarEmail,
    validarTelefone,
    formatarTelefone,
    scrollParaTopo,
    validarFormularioContato
};
}
