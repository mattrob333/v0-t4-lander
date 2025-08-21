"use client"

// Critical CSS component for inlining above-the-fold styles
export function CriticalCSS() {
  return (
    <style jsx>{`
      /* Critical above-the-fold CSS for Core Web Vitals optimization */
      :root {
        --primary: #00A878;
        --primary-dark: #00936B;
        --text: #000;
        --text-light: rgba(0, 0, 0, 0.7);
        --bg: #fff;
        --border: rgba(0, 0, 0, 0.1);
      }

      [data-theme="dark"] {
        --text: #fff;
        --text-light: rgba(255, 255, 255, 0.8);
        --bg: #0a0a0a;
        --border: rgba(255, 255, 255, 0.1);
      }

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        line-height: 1.6;
        color: var(--text);
        background-color: var(--bg);
        font-feature-settings: 'kern', 'liga', 'clig', 'calt';
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      /* Header critical styles */
      header {
        position: sticky;
        top: 0;
        z-index: 50;
        width: 100%;
        border-bottom: 1px solid transparent;
        transition: all 0.2s ease;
      }

      /* Hero section critical styles */
      .hero-section {
        position: relative;
        display: grid;
        grid-template-columns: 1fr;
        align-items: center;
        gap: 2.5rem;
        max-width: 80rem;
        margin: 0 auto;
        padding: 4rem 1rem 6rem;
      }

      @media (min-width: 768px) {
        .hero-section {
          grid-template-columns: 1fr 1fr;
          padding: 6rem 1rem;
        }
      }

      /* Typography critical styles */
      h1 {
        font-size: clamp(1.75rem, 5vw, 3rem);
        font-weight: 800;
        line-height: 1.2;
        letter-spacing: -0.025em;
        margin-bottom: 1rem;
        color: var(--text);
      }

      @media (min-width: 768px) {
        h1 {
          font-size: clamp(2.5rem, 5vw, 3.5rem);
          line-height: 1.15;
        }
      }

      /* Button critical styles */
      .btn-primary {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 3rem;
        padding: 0 1.5rem;
        background-color: var(--primary);
        color: white;
        font-weight: 600;
        font-size: 0.875rem;
        border: none;
        border-radius: 9999px;
        text-decoration: none;
        cursor: pointer;
        transition: background-color 0.15s ease;
        will-change: background-color;
      }

      .btn-primary:hover {
        background-color: var(--primary-dark);
      }

      /* Image container critical styles */
      .image-container {
        position: relative;
        overflow: hidden;
        border-radius: 0.75rem;
        border: 1px solid var(--border);
      }

      /* Prevent layout shift for images */
      .image-wrapper {
        position: relative;
        display: block;
        width: 100%;
        height: auto;
      }

      .image-wrapper img {
        width: 100%;
        height: auto;
        object-fit: cover;
        transition: opacity 0.3s ease;
      }

      /* Loading state styles */
      .image-loading {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
      }

      @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }

      /* Utility classes */
      .container {
        max-width: 80rem;
        margin: 0 auto;
        padding: 0 1rem;
      }

      .text-center { text-align: center; }
      .flex { display: flex; }
      .grid { display: grid; }
      .hidden { display: none; }

      @media (min-width: 768px) {
        .md\\:flex { display: flex; }
        .md\\:hidden { display: none; }
        .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      }

      /* Focus styles for accessibility */
      *:focus-visible {
        outline: 2px solid var(--primary);
        outline-offset: 2px;
      }
    `}</style>
  )
}

export default CriticalCSS;