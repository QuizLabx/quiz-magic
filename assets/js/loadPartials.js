document.addEventListener('DOMContentLoaded', () => {
    function loadPartial(elementId, filePath) {
        fetch(filePath)
            .then(response => response.text())
            .then(data => {
                document.getElementById(elementId).innerHTML = data;
            })
            .catch(error => console.error(`Error loading ${filePath}:`, error));
    }

    // Load Header
    loadPartial('header-placeholder', 'partials/header.html');

    // Load Footer
    loadPartial(\'footer-placeholder\', \'partials/footer.html\');

    // Load Main Content for index.html if on index page
    if (window.location.pathname === \'/\' || window.location.pathname === \'/index.html\') {
        loadPartial(\'main-content-placeholder\', \'partials/index-main-content.html\');
    }
});
