// Store-B canonical 301/302 redirects.
//
// See `apps/store-a/src/config/redirects.js` for rationale. Add new redirects
// here, never inline in `next.config.js`.

const redirects = [
  { source: '/frames', destination: '/picture-frames', permanent: false },
  { source: '/diploma-frames', destination: '/diploma-certificate-frames', permanent: true },
  { source: '/returns', destination: '/returns-exchanges', permanent: true },
  { source: '/jerseys', destination: '/jersey-frames', permanent: true },
  { source: '/shadowbox-designer', destination: '/shadowbox/designer', permanent: true },
  { source: '/specialty/mat-designer', destination: '/mat-designer', permanent: true },
  { source: '/specialty/bouquet', destination: '/bouquet-frames', permanent: true },
  { source: '/specialty/record-album-frames', destination: '/record-album-frames', permanent: true },
  { source: '/specialty/cd-frames', destination: '/cd-frames', permanent: true },
  { source: '/specialty/movie-poster', destination: '/movie-poster-frames', permanent: true },
  { source: '/specialty/collage', destination: '/collage-frames', permanent: true },
  { source: '/specialty/ticket', destination: '/ticket-frames', permanent: true },
  { source: '/photo-collage-frames', destination: '/collage-frames', permanent: true },
  { source: '/collage-frames/designer', destination: '/collage-frames', permanent: true },
  { source: '/ticket-stub-frames', destination: '/ticket-frames', permanent: true },
  { source: '/magazine-frame-sizes', destination: '/magazine-sizes-guide', permanent: true },
  { source: '/comic-book-frame', destination: '/comic-book-frames', permanent: true },
  { source: '/designer/comic-book-frame', destination: '/comic-book-frames', permanent: true },
  { source: '/playbill-frames/designer', destination: '/playbill-frames', permanent: true },
  { source: '/newspaper-frames/designer', destination: '/newspaper-frames', permanent: true },
  { source: '/shadowbox/deep-frames', destination: '/shadowbox/deep-shadowbox-frames', permanent: true },
  { source: '/shadowbox/depth-guide', destination: '/shadowbox/deep-shadowbox-frames', permanent: true },
];

module.exports = { redirects };
