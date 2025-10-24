// ===== FUNCIONALIDADES PRINCIPAIS =====

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar dropdown do usuário
    initUserDropdown();
    
    // Inicializar sistema de mensagens
    initMessages();
    
    // Inicializar funcionalidades do carrinho
    initCartFeatures();
    
    // Inicializar formulários
    initForms();
});

// ===== DROPDOWN DO USUÁRIO =====
function initUserDropdown() {
    const userDropdown = document.querySelector('.user-dropdown');
    if (!userDropdown) return;
    
    const dropdownButton = userDropdown.querySelector('button');
    const dropdownContent = userDropdown.querySelector('.dropdown-content');
    
    if (dropdownButton && dropdownContent) {
        dropdownButton.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownContent.classList.toggle('show');
        });
        
        // Fechar dropdown ao clicar fora
        document.addEventListener('click', function(e) {
            if (!userDropdown.contains(e.target)) {
                dropdownContent.classList.remove('show');
            }
        });
        
        // Fechar dropdown ao pressionar Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                dropdownContent.classList.remove('show');
            }
        });
    }
}

// ===== SISTEMA DE MENSAGENS =====
function initMessages() {
    const messages = document.querySelectorAll('.alert');
    
    messages.forEach(function(message) {
        // Adicionar botão de fechar se não existir
        if (!message.querySelector('.close-btn')) {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'close-btn';
            closeBtn.innerHTML = '×';
            closeBtn.style.cssText = `
                position: absolute;
                top: 10px;
                right: 15px;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: inherit;
                opacity: 0.7;
                transition: opacity 0.3s ease;
            `;
            
            closeBtn.addEventListener('click', function() {
                message.style.animation = 'slideOut 0.3s ease forwards';
                setTimeout(() => message.remove(), 300);
            });
            
            closeBtn.addEventListener('mouseenter', function() {
                this.style.opacity = '1';
            });
            
            closeBtn.addEventListener('mouseleave', function() {
                this.style.opacity = '0.7';
            });
            
            message.style.position = 'relative';
            message.appendChild(closeBtn);
        }
        
        // Auto-remover mensagens de sucesso após 5 segundos
        if (message.classList.contains('alert-success')) {
            setTimeout(function() {
                if (message.parentNode) {
                    message.style.animation = 'slideOut 0.3s ease forwards';
                    setTimeout(() => message.remove(), 300);
                }
            }, 5000);
        }
    });
}

// ===== FUNCIONALIDADES DO CARRINHO =====
function initCartFeatures() {
    // Adicionar confirmação antes de remover item do carrinho
    const removeButtons = document.querySelectorAll('a[href*="remover_do_carrinho"]');
    removeButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            if (!confirm('Tem certeza que deseja remover este item do carrinho?')) {
                e.preventDefault();
            }
        });
    });
    
    // Adicionar loading state aos botões de ação
    const actionButtons = document.querySelectorAll('form button[type="submit"]');
    actionButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            if (this.form.checkValidity()) {
                this.classList.add('loading');
                this.disabled = true;
                
                // Adicionar spinner
                const spinner = document.createElement('span');
                spinner.className = 'spinner';
                this.appendChild(spinner);
            }
        });
    });
}

// ===== FORMULÁRIOS =====
function initForms() {
    // Validação em tempo real
    const formControls = document.querySelectorAll('.form-control');
    formControls.forEach(function(control) {
        control.addEventListener('blur', function() {
            validateField(this);
        });
        
        control.addEventListener('input', function() {
            // Remover classes de erro ao digitar
            this.classList.remove('is-invalid');
            const feedback = this.parentNode.querySelector('.invalid-feedback');
            if (feedback) {
                feedback.remove();
            }
        });
    });
    
    // Melhorar acessibilidade dos formulários
    const forms = document.querySelectorAll('form');
    forms.forEach(function(form) {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(function(field) {
                if (!validateField(field)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                // Focar no primeiro campo inválido
                const firstInvalid = form.querySelector('.is-invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                }
            }
        });
    });
}

// ===== VALIDAÇÃO DE CAMPOS =====
function validateField(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    const type = field.type;
    
    let isValid = true;
    let message = '';
    
    // Validação de campo obrigatório
    if (isRequired && !value) {
        isValid = false;
        message = 'Este campo é obrigatório.';
    }
    
    // Validação de email
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            message = 'Por favor, insira um email válido.';
        }
    }
    
    // Validação de senha
    if (type === 'password' && value) {
        if (value.length < 6) {
            isValid = false;
            message = 'A senha deve ter pelo menos 6 caracteres.';
        }
    }
    
    // Aplicar feedback visual
    if (isValid) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
        removeFieldFeedback(field);
    } else {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
        showFieldFeedback(field, message);
    }
    
    return isValid;
}

function showFieldFeedback(field, message) {
    removeFieldFeedback(field);
    
    const feedback = document.createElement('div');
    feedback.className = 'invalid-feedback';
    feedback.textContent = message;
    feedback.style.cssText = `
        color: var(--danger-color);
        font-size: 0.875rem;
        margin-top: 5px;
        display: block;
    `;
    
    field.parentNode.appendChild(feedback);
}

function removeFieldFeedback(field) {
    const existingFeedback = field.parentNode.querySelector('.invalid-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
}

// ===== UTILITÁRIOS =====
function showLoading(element) {
    element.classList.add('loading');
    element.disabled = true;
}

function hideLoading(element) {
    element.classList.remove('loading');
    element.disabled = false;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        max-width: 300px;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== ANIMAÇÕES CSS ADICIONAIS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from { 
            opacity: 1; 
            transform: translateX(0); 
        }
        to { 
            opacity: 0; 
            transform: translateX(100%); 
        }
    }
    
    .is-valid {
        border-color: var(--success-color) !important;
    }
    
    .is-invalid {
        border-color: var(--danger-color) !important;
    }
    
    .loading {
        opacity: 0.6;
        pointer-events: none;
    }
`;
document.head.appendChild(style);


