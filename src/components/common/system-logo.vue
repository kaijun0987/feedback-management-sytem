<template>
  <div class="app-logo">
    <svg viewBox="0 0 64 64" aria-hidden="true" class="logo-svg">
      <defs>
        <linearGradient id="feedback-logo-gradient" x1="12" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="rgb(var(--primary-400-color))" />
          <stop offset="1" stop-color="rgb(var(--primary-600-color))" />
        </linearGradient>
      </defs>

      <rect x="6" y="6" width="52" height="52" rx="16" fill="url(#feedback-logo-gradient)" />
      <path
        d="M22 22h20c3.314 0 6 2.686 6 6v8c0 3.314-2.686 6-6 6H31.5l-6.6 5.156A1 1 0 0 1 23 46.37V42h-1c-3.314 0-6-2.686-6-6v-8c0-3.314 2.686-6 6-6Z"
        fill="white"
      />
      <circle cx="26" cy="32" r="2.25" fill="rgb(var(--primary-500-color))" />
      <circle cx="32" cy="32" r="2.25" fill="rgb(var(--primary-500-color))" />
      <circle cx="38" cy="32" r="2.25" fill="rgb(var(--primary-500-color))" />
    </svg>
  </div>
</template>

<style scoped>
.app-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.logo-svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 8px 18px rgb(var(--primary-500-color), 0.22));
}
</style>
