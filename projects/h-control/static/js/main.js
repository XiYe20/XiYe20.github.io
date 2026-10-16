(() => {
  const nav = document.querySelector('.site-nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const heroVideo = document.getElementById('hero-video');
  const heroToggle = document.getElementById('hero-motion-toggle');
  if (heroVideo && heroToggle) {
    heroToggle.hidden = false;
    const updateHeroToggle = () => {
      heroToggle.textContent = heroVideo.paused ? 'Play background' : 'Pause background';
    };
    const playHero = () => {
      heroVideo.play().catch(updateHeroToggle);
    };
    const applyMotionPreference = () => {
      heroVideo.autoplay = !reducedMotion.matches;
      if (reducedMotion.matches) heroVideo.pause();
      else playHero();
      updateHeroToggle();
    };
    heroVideo.addEventListener('play', updateHeroToggle);
    heroVideo.addEventListener('pause', updateHeroToggle);
    heroToggle.addEventListener('click', () => {
      if (heroVideo.paused) playHero();
      else heroVideo.pause();
    });
    reducedMotion.addEventListener('change', applyMotionPreference);
    applyMotionPreference();
  }

  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    document.documentElement.classList.add('motion-ready');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.05 });
    document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));
  }

  document.querySelectorAll('[data-tabs]').forEach((group) => {
    const tabs = [...group.querySelectorAll('[role="tab"]')];
    const activate = (tab) => {
      tabs.forEach((item) => {
        const active = item === tab;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-selected', String(active));
        item.tabIndex = active ? 0 : -1;
        document.getElementById(item.dataset.panel).hidden = !active;
      });
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(tab));
      tab.addEventListener('keydown', (event) => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next === undefined) return;
        event.preventDefault();
        activate(tabs[next]);
        tabs[next].focus();
      });
    });
  });

  const copyButton = document.querySelector('.copy-btn');
  copyButton.addEventListener('click', async () => {
    const citation = document.getElementById('bibtex');
    const status = document.getElementById('copy-status');
    try {
      await navigator.clipboard.writeText(citation.textContent.trim());
      copyButton.textContent = 'Copied';
      status.textContent = 'Citation copied to clipboard.';
      setTimeout(() => { copyButton.textContent = 'Copy'; }, 1800);
    } catch {
      const range = document.createRange();
      range.selectNodeContents(citation);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      copyButton.textContent = 'Select & copy';
      status.textContent = 'Citation selected. Press Control+C or Command+C to copy.';
    }
  });

  const scene = document.getElementById('scene-select');
  const baseline = document.getElementById('baseline-select');
  const videos = ['reference', 'ours', 'baseline'].map((id) => document.getElementById(`video-${id}`));
  const playButton = document.getElementById('play-comparison');
  const progress = document.getElementById('video-progress');
  const time = document.getElementById('video-time');
  const status = document.getElementById('gallery-status');
  let playing = false;
  let generation = 0;
  let frame = 0;

  document.querySelector('.gallery-controls').hidden = false;
  document.querySelector('.playback-controls').hidden = false;
  videos.forEach((video) => { video.controls = false; });

  const updateProgress = () => {
    const duration = Number.isFinite(videos[0].duration) ? videos[0].duration : 3.0625;
    const current = videos[0].currentTime;
    progress.max = duration;
    progress.value = current;
    progress.setAttribute('aria-valuetext', `${current.toFixed(1)} of ${duration.toFixed(1)} seconds`);
    time.value = `${current.toFixed(1)} / ${duration.toFixed(1)} s`;
  };
  const pause = () => {
    playing = false;
    generation += 1;
    cancelAnimationFrame(frame);
    videos.forEach((video) => video.pause());
    playButton.textContent = 'Play comparison';
    updateProgress();
  };
  const tick = () => {
    if (!playing) return;
    // Use the reference as a shared clock, correcting drift over two frames.
    videos.slice(1).forEach((video) => {
      if (video.readyState >= 2 && Math.abs(video.currentTime - videos[0].currentTime) > 0.125) {
        video.currentTime = videos[0].currentTime;
      }
    });
    updateProgress();
    frame = requestAnimationFrame(tick);
  };
  const ready = (video) => {
    if (video.readyState >= 3) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const cleanup = () => {
        clearTimeout(timeout);
        video.removeEventListener('canplay', loaded);
        video.removeEventListener('error', failed);
      };
      const loaded = () => { cleanup(); resolve(); };
      const failed = () => { cleanup(); reject(new Error('Video unavailable')); };
      const timeout = setTimeout(failed, 15000);
      video.addEventListener('canplay', loaded, { once: true });
      video.addEventListener('error', failed, { once: true });
      video.preload = 'auto';
      video.load();
    });
  };
  const play = async () => {
    const token = ++generation;
    playing = true;
    playButton.textContent = 'Loading…';
    try {
      const start = videos[0].ended ? 0 : videos[0].currentTime;
      videos.forEach((video) => {
        video.preload = 'auto';
        if (video.readyState >= 1) video.currentTime = start;
      });
      // Start media directly from the click so browsers that defer preload
      // still receive a user-initiated play request. Align once all are ready.
      await Promise.all(videos.map((video) => video.play()));
      if (token !== generation) return;
      videos.forEach((video) => { video.currentTime = start; });
      playButton.textContent = 'Pause comparison';
      frame = requestAnimationFrame(tick);
    } catch {
      if (token !== generation) return;
      pause();
      videos.forEach((video) => { video.controls = true; });
      status.textContent = 'Use the video controls to play individually, or retry Play comparison.';
    }
  };

  playButton.addEventListener('click', () => playing ? pause() : play());
  document.getElementById('restart-comparison').addEventListener('click', () => {
    pause();
    videos.forEach((video) => { video.currentTime = 0; });
    play();
  });
  videos[0].addEventListener('ended', () => {
    if (!playing) return;
    pause();
    videos.forEach((video) => { video.currentTime = 0; });
    play();
  });
  progress.addEventListener('input', async () => {
    const target = Number(progress.value);
    pause();
    const token = generation;
    try {
      await Promise.all(videos.map(ready));
      if (token !== generation) return;
      videos.forEach((video) => { video.currentTime = target; });
      updateProgress();
    } catch {
      status.textContent = 'Unable to load this comparison. Try another scene.';
    }
  });
  videos[0].addEventListener('seeked', updateProgress);

  const changeComparison = () => {
    pause();
    const isDavis = scene.value.startsWith('davis');
    const method = baseline.selectedOptions[0].textContent;
    const trained = ['trajectorycrafter', 'trajectoryattention', 'recammaster'].includes(baseline.value);
    document.getElementById('baseline-label').replaceChildren(document.createTextNode(method + ' '));
    const badge = document.createElement('span');
    badge.textContent = trained ? 'Training-based' : 'Training-free';
    document.getElementById('baseline-label').append(badge);
    document.getElementById('reference-label').textContent = isDavis ? 'Source video' : 'Reference video';
    status.textContent = isDavis ? 'DAVIS · dynamic scene' : 'RealEstate10K · static scene';
    document.getElementById('reference-note').textContent = isDavis
      ? 'DAVIS reference: the original source video, not a ground-truth video at the target camera path. All generated methods use the same requested trajectory. Clips retain their original timing.'
      : 'RealEstate10K reference: held-out video along the target camera trajectory. Clips are cropped from the supplementary comparison grids; all methods retain their original timing.';
    ['reference', 'ours', baseline.value].forEach((methodId, index) => {
      const stem = `static/videos/${scene.value}/${methodId}`;
      videos[index].poster = `${stem}.jpg`;
      videos[index].controls = false;
      videos[index].preload = 'none';
      videos[index].src = `${stem}.mp4`;
      videos[index].load();
    });
    updateProgress();
  };
  scene.addEventListener('change', changeComparison);
  baseline.addEventListener('change', changeComparison);
  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
})();
