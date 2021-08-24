(function () {
    
    function ready(fn) {
        if (document.readyState != 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    function createMessage(msg) {
        const containerElem = document.querySelector('.container');
        const sectionElem = document.createElement('section');
        const bubbleElem = document.createElement('article');
        bubbleElem.classList.add('bubble');
        const loadingElem = document.createElement('span');
        loadingElem.classList.add('loading');
        loadingElem.innerHTML = '<strong>•</strong><strong>•</strong><strong>•</strong>';
        bubbleElem.appendChild(loadingElem);
        sectionElem.appendChild(bubbleElem);
        containerElem.appendChild(sectionElem);
        const messageElem = document.createElement('span');
        setTimeout(function() {
            bubbleElem.removeChild(loadingElem);
            messageElem.classList.add('message');
            messageElem.innerHTML = msg;
            bubbleElem.appendChild(messageElem);
        }, 1200);
        setTimeout(function() {
            bubbleElem.style.borderRadius = '45px';
            messageElem.style.opacity = '1';
            window.scrollTo(0,document.body.scrollHeight);
        }, 1400);
    }

    function main() {   
        let messages = [
            "Hi",
            "Nice to meet you &#128512;",
            "I am Roger Liu",
            "I am a web developer focus on front-end",
            "Here are some of my works",
            "Taiwan Inception Program Registration<br><a href='https://www.nvidia.com/zh-tw/deep-learning-ai/taiwan-inception-program/register/' target='_blank'>Visit Website</a><br><img alt='Taiwan Inception Program Registration' src='image/inception-program-register-thumbnail.JPG'>",
            "Cooler Master Contest<br><a href='https://www.nvidia.com/content/apac/campaigns/coolermaster-contest/au/' target='_blank'>Visit Website</a><br><img alt='Cooler Master Contest' src='image/cooler-master-campaign-thumbnail.JPG'>",
            "GeForce Cup<br><a href='https://www.nvidia.com/en-my/geforce/events/geforce-cup/grand-finals/' target='_blank'>Visit Website</a><br><img alt='GeForce Cup' src='image/geforce-cup-pacific-final-thumbnail.jpg'>",
            "Game Face Campaign<br><a href='https://www.nvidia.com/content/apac/game-face-campaign/ANZ/' target='_blank'>Visit Website</a><br><img alt='Game Face Campaign' src='image/gameface-campaign-thumbnail.jpg'>",
            "AI Conference Korea<br><a href='https://www.nvidia.com/ko-kr/ai-conference/' target='_blank'>Visit Website</a><br><img alt='AI Conference Korea' src='image/ai-conference-kr-19-thumbnail.jpg'>",
            "I am open to new opportunities<br>You could contact me at <a href='mailto:digiogior@gmail.com'>digiogior@gmail.com</a>",
            "Hope you have a GOOD day",
            "&#129346;"
        ]; 

        let t = 0;
        messages.forEach(function(message) {
            setTimeout(function() {
                createMessage(message);
            }, t);
            t += 2200;
        });
    }

    ready(main);

})();