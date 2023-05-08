if (document.querySelector('.quote')) {
    let quotes = document.querySelectorAll('.quote');
    let i = 0;
    setInterval(() => {
        quotes[i].classList.remove('active');
        i++;
        if (i == quotes.length) {
            i = 0;
        }
        quotes[i].classList.add('active');
    }, 5000);
}