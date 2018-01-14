module.exports = {
  "globDirectory": "public\\",
  "globPatterns": [
    "**/*.{html,ico,json,js,css}",
    "src/images/*.{jpg,JPG,png,PNG}"
  ],
  "swSrc": "public/service-worker-base.js",
  "swDest": "public/workbox-sw-v1.js",
  "globIgnores": [
    "..\\workbox-cli-config.js",
    "aboutUs/**"
  ]
};
