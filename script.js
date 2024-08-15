document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'admin' && password === 'admin@123') {
        window.location.href = './admin/index.html'; // Redirect to admin page
    } else if (username === 'smeet' && password === 'smeet@123') {
        window.location.href = './users/index.html'; // Redirect to normal home page
    }else if (username === 'afsheen' && password === 'afsheen@123') {
        window.location.href = './users/index.html'; // Redirect to normal home page
    } else {
        alert('Incorrect username or password');
    }
});

document.getElementById('guestBtn').addEventListener('click', function() {
    window.location.href = './guest/index.html'; // Redirect to guest home page
});
