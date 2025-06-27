document.addEventListener('DOMContentLoaded', function () {
    const togglers = document.querySelectorAll('.password-display-toggler, .password-display-toggler-updated');

    togglers.forEach(function (toggle) {
        toggle.addEventListener('click', function () {
            const input = this.parentElement.querySelector('input');
            if (input) {
                if (input.type == 'password') {
                    input.type = 'text';
                    this.innerHTML = '<i class="fas fa-low-vision"></i>';
                } else {
                    input.type = 'password';
                    this.innerHTML = '<i class="far fa-eye"></i>';
                }
            }
        });
    });
});