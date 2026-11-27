<!-- Shot 12 · Figma 309:13918 : vector layout exported from Figma, colours mapped to the chapter tokens, motion per 07-panggung-v3 §5. -->
<svg class="scene" viewBox="0 0 720 420" preserveAspectRatio="xMidYMid slice" fill="none" aria-hidden="true" focusable="false">
  <defs><clipPath id="site-live-globe"><circle cx="353" cy="196.5" r="103" /></clipPath></defs>
  <path class="f-mid s-ink" d="M352.5 300C409.661 300 456 253.661 456 196.5C456 139.339 409.661 93 352.5 93C295.339 93 249 139.339 249 196.5C249 253.661 295.339 300 352.5 300Z" stroke-width="2.25"/>
  <g clip-path="url(#site-live-globe)">
    <g class="meridians">
    <path class="s-ink" d="M399 196.5C399 253.661 378.181 300 352.5 300C326.819 300 306 253.661 306 196.5C306 139.339 326.819 93 352.5 93C378.181 93 399 139.339 399 196.5Z" stroke-width="1.875"/>
    <path class="s-ink" d="M352.5 93V300" stroke-width="1.875"/>
    </g>
    </g>
  <path class="s-ink" d="M262.5 147C322.5 162 382.5 162 442.5 147" stroke-width="1.875"/>
    <path class="s-ink" d="M249 196.5H456" stroke-width="1.875"/>
    <path class="s-ink" d="M262.5 246C322.5 231 382.5 231 442.5 246" stroke-width="1.875"/>
  <g class="rise cloud">
    <path class="f-paper s-ink" d="M411 177H517.5C523.866 177.398 530.128 175.251 534.91 171.031C539.692 166.812 542.603 160.865 543 154.5C543.398 148.135 541.251 141.872 537.032 137.09C532.812 132.308 526.866 129.398 520.5 129C520.919 121.956 518.96 114.976 514.938 109.178C510.916 103.38 505.064 99.1005 498.32 97.0254C491.575 94.9502 484.33 95.1996 477.744 97.7336C471.158 100.268 465.614 104.939 462 111C458.691 105.57 453.571 101.482 447.543 99.4571C441.515 97.4321 434.965 97.5998 429.049 99.9306C423.132 102.261 418.228 106.606 415.201 112.198C412.173 117.79 411.217 124.272 412.5 130.5C406.334 130.301 400.341 132.56 395.84 136.779C391.34 140.999 388.699 146.834 388.5 153C388.301 159.166 390.56 165.159 394.78 169.66C398.999 174.161 404.834 176.801 411 177Z" stroke-width="2.25" stroke-linejoin="round"/>
    </g>
  <g class="rise addr">
    <path class="f-paper s-ink" d="M480.75 318H239.25C227.238 318 217.5 327.738 217.5 339.75C217.5 351.762 227.238 361.5 239.25 361.5H480.75C492.762 361.5 502.5 351.762 502.5 339.75C502.5 327.738 492.762 318 480.75 318Z" stroke-width="2.25"/>
    <g class="live">
    <path class="f-mid" opacity="0.7" d="M243 351.75C249.627 351.75 255 346.377 255 339.75C255 333.123 249.627 327.75 243 327.75C236.373 327.75 231 333.123 231 339.75C231 346.377 236.373 351.75 243 351.75Z"/>
    </g>
    <path class="f-acc" d="M243 345C245.899 345 248.25 342.649 248.25 339.75C248.25 336.851 245.899 334.5 243 334.5C240.101 334.5 237.75 336.851 237.75 339.75C237.75 342.649 240.101 345 243 345Z"/>
    <text x="259.5" y="343.1" font-size="13.5" font-weight="500" class="f-ink">febriannugroho.my.id</text>
    </g>
  <path class="f-acc" d="M165 102C166.26 107.74 169.76 111.24 175.5 112.5C169.76 113.76 166.26 117.26 165 123C163.74 117.26 160.24 113.76 154.5 112.5C160.24 111.24 163.74 107.74 165 102Z"/>
    <path class="f-acc" d="M570 238.5C571.08 243.42 574.08 246.42 579 247.5C574.08 248.58 571.08 251.58 570 256.5C568.92 251.58 565.92 248.58 561 247.5C565.92 246.42 568.92 243.42 570 238.5Z"/>
    <path class="f-ink" d="M555 294.75C555.63 297.62 557.38 299.37 560.25 300C557.38 300.63 555.63 302.38 555 305.25C554.37 302.38 552.62 300.63 549.75 300C552.62 299.37 554.37 297.62 555 294.75Z"/>
  <text x="246.5" y="40.29" font-size="10.5" class="f-muted mono">PR #2 · deploy to Cloudflare Workers</text>
</svg>

<style>
.meridians { animation: spin 2200ms linear both; }
  @keyframes spin { from { translate: -18px 0; } }
  .cloud { --y: -9px; }
  .addr { --d: 120ms; --y: 6px; }
  .live { transform-box: fill-box; transform-origin: center; animation: halo 600ms var(--ease-out) 420ms 2; }
  @keyframes halo { 50% { scale: 1.3; opacity: 0.35; } }
</style>
