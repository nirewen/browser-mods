// ==UserScript==
// @name         YouTube Anchors
// @namespace    https://nirewen.dev/
// @version      2025-09-04
// @description  Display anchors in the video progress bar
// @author       Nirewen
// @match        https://www.youtube.com/watch?v=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

(function () {
    try {
        const $progressBar = document.querySelector('.ytp-progress-bar');

        if (!$progressBar) return;

        const $anchors = document.createElement('div');
        $anchors.style = `
                    display: flex;
                    justify-content: space-between;
                    position: absolute;
                    top: 86.35%;
                    left: 0;
                    right: 0;
                `;

        for (let i = 0; i <= 10; i++) {
            const $span = document.createElement('span');

            if (i < 10) {
                $span.style = `
                            background: var(--yt-spec-raised-background);
                            width: 12px;
                            height: 12px;
                            display: grid;
                            place-content: center;
                            border-radius: 50%;
                            border-top-left-radius: 0;
                            font-size: 10px;
                        `;

                $span.textContent = i;
            }

            $anchors.appendChild($span);
        }

        $progressBar.appendChild($anchors);
    } catch (e) {
        console.error("Error occurred:", e);
    }
})();