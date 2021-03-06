let offsetY = 0

const getTargetOffset = hash => {
  try {
    hash = window.decodeURI(hash.replace(`#`, ``))
  } catch (e) {
    hash = ``
  }

  if (hash !== ``) {
    const element = document.getElementById(hash)
    if (element) {
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop
      let clientTop =
        document.documentElement.clientTop || document.body.clientTop || 0
      let computedStyles = window.getComputedStyle(element)
      let scrollMarginTop =
        computedStyles.getPropertyValue(`scroll-margin-top`) ||
        computedStyles.getPropertyValue(`scroll-snap-margin-top`) ||
        `0px`

      return (
        element.getBoundingClientRect().top +
        scrollTop -
        parseInt(scrollMarginTop, 10) -
        clientTop -
        offsetY
      )
    }
  }
  return null
}

exports.onInitialClientRender = (_, pluginOptions) => {
  if (pluginOptions.offsetY) {
    offsetY = pluginOptions.offsetY
  }

  requestAnimationFrame(() => {
    const offset = getTargetOffset(window.location.hash)
    if (offset !== null) {
      window.scrollTo(0, offset)
    }
  })
}

exports.shouldUpdateScroll = ({ routerProps: { location } }) => {
  const offset = getTargetOffset(location.hash)
  return offset !== null ? [0, offset] : true
}
