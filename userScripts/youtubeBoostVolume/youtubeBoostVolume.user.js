// ==UserScript==
// @name         YouTube Boost Volume
// @namespace    https://nirewen.dev
// @version      2025.12.14
// @description  5x volume for YouTube
// @author       Nirewen
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// ==/UserScript==


(function() {
    'use strict';
    const BOOST_AMOUNT = 5;

    let gainNode = null;

    function boostVolume() {
        const video = document.querySelector('.video-stream.html5-main-video');
        if (!video) return;

        if (!gainNode) {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioCtx.createMediaElementSource(video);
            gainNode = audioCtx.createGain();
            source.connect(gainNode);
            gainNode.connect(audioCtx.destination);
        }

        gainNode.gain.value = BOOST_AMOUNT;
    }

    function setupVideoListeners() {
        const video = document.querySelector('.video-stream.html5-main-video');
        if (!video) return;

        ['play'].forEach(event => {
            video.addEventListener(event, boostVolume);
        });
    }

    function handleNavigation() {
        if (location.pathname !== '/watch') return;

        const interval = setInterval(() => {
            if (document.querySelector('.video-stream.html5-main-video')) {
                clearInterval(interval);
                setupVideoListeners();
            }
        }, 100);
    }

    window.addEventListener('yt-navigate-finish', handleNavigation);

    if (document.readyState === 'complete') {
        handleNavigation();
    } else {
        window.addEventListener('load', handleNavigation);
    }
})();