export function responsiveSize(startSize, minViewport = 768, maxViewport = 2560) {

  const minSize = (startSize / maxViewport) * minViewport

  const vw = window.innerWidth

  if (vw <= minViewport) return minSize
  if (vw >= maxViewport) return startSize

  const size = minSize + ((startSize - minSize) * (vw - minViewport)) / (maxViewport - minViewport)
  
  return size;
}