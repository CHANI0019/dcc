document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll reveal animation
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const cards = document.querySelectorAll('.card, .token-card, .section-header');
    cards.forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });

    // Header transparency on scroll
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(15, 23, 42, 0.95)';
            header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
        } else {
            header.style.background = 'rgba(15, 23, 42, 0.8)';
            header.style.boxShadow = 'none';
        }
    });

    // Localization Logic
    const langBtns = document.querySelectorAll('.lang-btn');
    const translatableElements = document.querySelectorAll('[data-en]');

    const setLanguage = (lang) => {
        document.documentElement.lang = lang;
        localStorage.setItem('dcc-lang', lang);

        translatableElements.forEach(el => {
            const translation = el.getAttribute(`data-${lang}`);
            if (translation) {
                if (translation.includes('<')) {
                    el.innerHTML = translation;
                } else {
                    el.innerText = translation;
                }
            }
        });

        // Update active button state
        langBtns.forEach(btn => {
            if (btn.id === `btn-${lang}`) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    };

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.id.split('-')[1];
            setLanguage(lang);
        });
    });

    // Initialize language (Default to Korean)
    const savedLang = localStorage.getItem('dcc-lang') || 'ko';
    setLanguage(savedLang);

    // Modal Logic
    const modal = document.getElementById('docModal');
    const modalBody = document.getElementById('modalBody');
    const modalTitle = document.getElementById('modalTitle');
    const closeBtn = document.querySelector('.close-modal');
    const viewButtons = document.querySelectorAll('.doc-item .btn');

    viewButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            const filePath = button.getAttribute('href');
            const docTitle = button.parentElement.querySelector('span').innerText;

            modalTitle.innerText = docTitle;
            modalBody.innerHTML = '<p>Loading document...</p>';
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scroll

            try {
                const response = await fetch(filePath);
                if (!response.ok) throw new Error('Failed to load document');
                const markdown = await response.text();
                
                // Use marked.js to render markdown (if loaded)
                if (window.marked) {
                    modalBody.innerHTML = marked.parse(markdown);
                } else {
                    modalBody.innerHTML = `<pre style="white-space: pre-wrap;">${markdown}</pre>`;
                }
            } catch (error) {
                if (window.location.protocol === 'file:') {
                    modalBody.innerHTML = `
                        <div style="color: #ef4444; padding: 2rem; background: #fee2e2; border-radius: 12px; border: 1px solid #fecaca;">
                            <h3 style="margin-top: 0;">⚠️ 로컬 파일 보안 제한 (CORS)</h3>
                            <p>브라우저 보안 정책으로 인해 로컬 파일(file://)에서 문서를 직접 불러올 수 없습니다.</p>
                            <p>이 기능을 정상적으로 확인하시려면 <strong>로컬 웹 서버</strong>를 실행해야 합니다.</p>
                            <hr style="border: none; border-top: 1px solid #fecaca; margin: 1.5rem 0;">
                            <p><strong>해결 방법:</strong></p>
                            <ul style="text-align: left; margin-bottom: 1rem;">
                                <li>VS Code를 사용 중이라면 <strong>Live Server</strong> 확장 프로그램을 사용하세요.</li>
                                <li>터미널에서 <code>npx serve</code> 명령어를 실행하세요.</li>
                                <li>또는 파일을 실제 웹 서버에 업로드하면 정상 작동합니다.</li>
                            </ul>
                            <a href="${filePath}" target="_blank" class="btn btn-primary" style="display: inline-block; margin-top: 1rem;">문서 직접 열기 (새 창)</a>
                        </div>
                    `;
                } else {
                    modalBody.innerHTML = `<p style="color: #ef4444;">Error: ${error.message}</p>`;
                }
            }
        });
    });

    // Close modal
    closeBtn.onclick = () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };
});
