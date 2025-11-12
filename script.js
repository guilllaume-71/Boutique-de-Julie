// Bouton "Entre Dans L'univers"
// ===== OUVRIR/FERMER LA MODALE =====
document.addEventListener('DOMContentLoaded', function() {
    const ctaButton = document.querySelector('.cta-button');
    const modal = document.getElementById('authModal');
    const closeModal = document.getElementById('closeModal');
    
    // Ouvrir la modale
    ctaButton.addEventListener('click', function() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Bloquer le scroll
    });
    
    // Fermer la modale (bouton X)
    closeModal.addEventListener('click', function() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    // Fermer en cliquant à l'extérieur
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // ===== BASCULER ENTRE CONNEXION/INSCRIPTION =====
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Retirer active de tous les boutons et contenus
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Ajouter active au bouton cliqué
            this.classList.add('active');
            
            // Afficher le contenu correspondant
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // ===== GESTION DES FORMULAIRES =====
    const authForms = document.querySelectorAll('.auth-form');
    
    authForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simuler une connexion réussie
            alert('Connexion réussie ! Redirection vers la boutique...');
            
            // Fermer la modale
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            // TODO: Ajouter la vraie logique de connexion ici
        });
    });
});
