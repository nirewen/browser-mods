// ==UserScript==
// @name         Netflix Actual Time
// @namespace    https://nirewen.dev
// @version      2025-09-04
// @description  Display actual time in Netflix based on playback speed and estimated finish time.
// @author       Nirewen
// @match        https://www.netflix.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=netflix.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let currentVideo = null;

    function updateTimeDisplay() {
        const video = document.querySelector('video');
        if (!video || isNaN(video.duration)) return;

        const actualSeconds = video.duration / video.playbackRate;
        const date = new Date(0);
        date.setSeconds(actualSeconds);
        const actualTime = date.toISOString().slice(11, 19);

        const finishTime = new Date(Date.now() + ((video.duration - video.currentTime) / video.playbackRate) * 1000);

        const times = document.querySelector('[data-uia="video-title"]');

        let actualTimeSpan = document.querySelector('.netflix-actual-time');
        if (!actualTimeSpan) {
            actualTimeSpan = document.createElement('span');
            actualTimeSpan.className = 'netflix-actual-time';
            times?.appendChild(actualTimeSpan);
        }
        actualTimeSpan.textContent = video.playbackRate !== 1 ? ` (${actualTime} @ ${video.playbackRate}x)` : '';

        let finishTimeSpan = document.querySelector('.netflix-finish-time');
        if (!finishTimeSpan) {
            finishTimeSpan = document.createElement('span');
            finishTimeSpan.className = 'netflix-finish-time';
            times?.appendChild(finishTimeSpan);
        }
        finishTimeSpan.textContent = ` ends at ${finishTime.toLocaleTimeString()}`;
    }

    function attachListeners(video) {
        if (currentVideo === video) return;
        currentVideo = video;

        ['loadedmetadata', 'play', 'ratechange', 'seeked', 'timeupdate'].forEach(event => {
            video.addEventListener(event, updateTimeDisplay);
        });

        updateTimeDisplay();
    }

    function setupObserver() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.tagName === 'VIDEO') {
                            attachListeners(node);
                        } else if (node.querySelector) {
                            const video = node.querySelector('video');
                            if (video) {
                                attachListeners(video);
                            }
                        }
                    });
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    const initialVideo = document.querySelector('video');
    if (initialVideo) {
        attachListeners(initialVideo);
    }
    setupObserver();
})();