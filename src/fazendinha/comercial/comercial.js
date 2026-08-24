
const scenes = [
    document.querySelector('#scene-juices'),
    document.querySelector('#scene-desserts'),
    document.querySelector('#scene-drinks'),
    document.querySelector('#scene-sodas')
];

const progressBar =
    document.querySelector('#progress-bar');

let currentScene = 0;

const sceneDuration = 7000;

function showScene(index) {

    scenes.forEach(scene => {
        scene.classList.remove('active');
    });

    scenes[index].classList.add('active');

    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';

    requestAnimationFrame(() => {

        requestAnimationFrame(() => {

            progressBar.style.transition =
                `width ${sceneDuration}ms linear`;

            progressBar.style.width = '100%';

        });

    });

}

function nextScene() {

    currentScene++;

    if (currentScene >= scenes.length) {
        currentScene = 0;
    }

    showScene(currentScene);
}

showScene(0);

setInterval(
    nextScene,
    sceneDuration
);
