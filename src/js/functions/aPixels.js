export const aPixels = function($startSize = 0) {
  const $maxWidth = 3840
  const $maxWidthContiner = 1920
  const $minWidth = 1280
  const $minSize = ($startSize / 1920) * 1280
  const $addSize = $startSize - $minSize
  //@media ( min-width: #{$maxWidthContiner + px})

  return +(($minSize) + ($addSize) * ((window.innerWidth - $minWidth) / ($maxWidthContiner - $minWidth))).toFixed(0)
}

export const  responsiveSize = function(startSize, minViewport = 768, maxViewport = 2560) {

  const minSize = (startSize / maxViewport) * minViewport
  const vw = window.innerWidth

  if (vw <= minViewport) return minSize
  if (vw >= maxViewport) return startSize
  const size = minSize + ((startSize - minSize) * (vw - minViewport)) / (maxViewport - minViewport)
  
  return size;
}