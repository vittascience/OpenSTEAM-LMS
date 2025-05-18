function notifyA11y(message) {
    const notifier = document.getElementById('a11y-notifier');
    notifier.textContent = '';
    setTimeout(() => {
        notifier.textContent = message;
    }, 100);
}
