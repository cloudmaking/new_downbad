document.addEventListener("DOMContentLoaded", function() {
    const filterButtons = document.querySelectorAll('.filter-button');
    const appCards = document.querySelectorAll('.app-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            //console.log(`Filter button clicked: ${filter}`);
            appCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(',');
                //console.log(`Card categories: ${categories}`);
                if (filter === 'all' || categories.includes(filter)) {
                    card.style.display = 'flex';
                    //console.log(`Showing card: ${card.querySelector('h2').innerText}`);
                } else {
                    card.style.display = 'none';
                    //console.log(`Hiding card: ${card.querySelector('h2').innerText}`);
                }
            });
        });
    });
});
