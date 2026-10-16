# h-control project page

Static project page for **h-control: Training-Free Camera Control via
Block-Conditional Gibbs Refinement**, matching the SHIFT page's visual style.

Deploy with the rest of this repository to GitHub Pages. The page is served at
`/projects/h-control/` and requires no build step or package installation.

## Included assets

- `static/css/` and `static/js/`: all page styles and interactions.
- `static/fonts/`: the Sora and Syne fonts and their OFL licenses, copied from SHIFT.
- `static/images/`: five web-ready paper figures and a hero still from the supplied output video.
- `static/videos/`: all five supplementary scenes, each split into the reference,
  h-control, and seven baseline clips, with a matching poster for every clip.

All rendered assets are ordinary files within this directory. There are no
symlinks, absolute local paths, CDN dependencies, or runtime dependencies on the
original paper and supplementary folders. The paper, arXiv, and code buttons
intentionally link to their public external resources.

The 45 clips are H.264 MP4 with fast-start metadata, at 960 × 540 and the source
16 fps (49 frames each). Cropping separates the cells of the provided comparison
grids without changing their timing. The page only loads the selected comparison
videos when requested. The embedded method labels are retained. The DAVIS
reference is the source video, not a ground-truth target-view video.

The title background loops the h-control Patio Doors result (`real10k-2/ours.mp4`)
as a muted, inline MP4. Its dedicated `hero-patio-doors.mp4` copy crops the top
80 pixels to remove the embedded method label, retaining the source timing;
`hero-patio-doors.jpg` is its matching first-frame poster. The background has a
play/pause button and starts paused when reduced motion is preferred.

Figures and numerical results were taken from the supplied paper source;
author information comes from its title block. Venue and public links follow
the existing personal homepage. The source paper and video grids are not needed
to serve or deploy this page.
