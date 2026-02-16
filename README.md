# Mobile-First Video Platform
A high-performance, mobile-first video streaming application built with React and Vite. This project focuses on a seamless "YouTube-style" user experience, featuring persistent playback and gesture-based controls.

## Features

### Mini-Player State
Toggle between a full-screen view and a persistent bottom-docked mini-bar.

### Custom Control Suite
10-second skip/rewind.

Custom progress slider with time stamping.

Volume and mute toggling.

### Manual Fullscreen Toggle
Custom button to trigger native browser fullscreen mode on mobile devices.

### Category Navigation
A horizontally swipable category bar featuring "flick-scroll" physics. It allows for instant content filtering across the platform while maintaining a sticky position at the top of the viewport for constant accessibility.

## Set-Up

### Install dependencies
```bash
    npm install
```

### Run the Development Server
You must use the --host flag to allow external (mobile) access
```bash
    npm run dev -- --host
```