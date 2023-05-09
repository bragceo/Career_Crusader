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

if (document.querySelector(".results")) {
    document.querySelector(".results").addEventListener("click", (e) => {
        if (e.target.closest(".upvote")) {
            let jobID = e.target.closest(".upvote").parentNode.parentNode.querySelector(".jobID").value;
            let downvoteRemoved = false;
            fetch('/feedback/upvote/' + jobID).then(res => res.json()).then(data => {
                if (data.upvote) {
                    e.target.closest(".upvote").classList.add("voted");
                }
                if (!data.upvote) {
                    e.target.closest(".upvote").classList.remove("voted");
                }

                if (data.downvote) {
                    e.target.closest(".upvote").parentNode.querySelector(".downvote").classList.add("voted");
                }
                if (!data.downvote) {
                    if (e.target.closest(".upvote").parentNode.querySelector(".downvote").classList.contains("voted")) {
                        downvoteRemoved = true;
                    }
                    e.target.closest(".upvote").parentNode.querySelector(".downvote").classList.remove("voted");
                }

                if (data.increaseCount) {
                    let count = e.target.closest(".upvote").querySelector(".upvote-count");
                    count.innerHTML = parseInt(count.innerHTML) + 1;

                    if (downvoteRemoved) {
                        let downvoteCount = e.target.closest(".upvote").parentNode.querySelector(".downvote-count");
                        downvoteCount.innerHTML = parseInt(downvoteCount.innerHTML) - 1;
                    }
                }
                if (!data.increaseCount) {
                    let count = e.target.closest(".upvote").querySelector(".upvote-count");
                    count.innerHTML = parseInt(count.innerHTML) - 1;
                }
            });
        }

        if (e.target.closest(".downvote")) {
            let jobID = e.target.closest(".downvote").parentNode.parentNode.querySelector(".jobID").value;
            let upvoteRemoved = false;
            fetch('/feedback/downvote/' + jobID).then(res => res.json()).then(data => {
                if (data.downvote) {
                    e.target.closest(".downvote").classList.add("voted");
                }
                if (!data.downvote) {
                    e.target.closest(".downvote").classList.remove("voted");
                }

                if (data.upvote) {
                    e.target.closest(".downvote").parentNode.querySelector(".upvote").classList.add("voted");
                }
                if (!data.upvote) {
                    if (e.target.closest(".downvote").parentNode.querySelector(".upvote").classList.contains("voted")) {
                        upvoteRemoved = true;
                    }
                    e.target.closest(".downvote").parentNode.querySelector(".upvote").classList.remove("voted");
                }

                if (data.increaseCount) {
                    let count = e.target.closest(".downvote").querySelector(".downvote-count");
                    count.innerHTML = parseInt(count.innerHTML) + 1;

                    if (upvoteRemoved) {
                        let upvoteCount = e.target.closest(".downvote").parentNode.querySelector(".upvote-count");
                        upvoteCount.innerHTML = parseInt(upvoteCount.innerHTML) - 1;
                    }
                }
                if (!data.increaseCount) {
                    let count = e.target.closest(".downvote").querySelector(".downvote-count");
                    count.innerHTML = parseInt(count.innerHTML) - 1;
                }
            });
        }
    });
}