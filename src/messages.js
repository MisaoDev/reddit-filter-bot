const TUTORIAL =
  '    !FilterThisImage [filter] [value]\n\nAvailable filters: brightness (%), saturation (%), hue (degrees).  \nYou can also combine filters. Examples:\n\n    !FilterThisImage saturation 150% brightness 85%\n    !FilterThisImage hue 180 saturation 128%\n    !FilterThisImage saturation 0% brightness 80% saturation 100%'

const TEXT = {
  HELLO:
    "Hello human! I'm the image filter bot.\n\nAs the name suggests, my job is to apply image filters.\n\nTo apply filters to an image in a post, comment it with the following command:\n\n" +
    TUTORIAL,
  NOT_AN_IMAGE:
    "Hello human! I'm the image filter bot.\n\nAs the name suggests, my job is to filter images, and this post does not contain any images.",
  BAD_SYNTAX:
    "Hello human! I'm the image filter bot.\n\nYou provided the wrong syntax for my command. Please use the following syntax:\n\n" +
    TUTORIAL,
  ERROR_APPLYING:
    "Hello human! There was an error while applying filters to your image. I'm so very sorry ):",
  ERROR_UPLOADING:
    "Hello human! There was an error while uploading your image. I'm so very sorry ):",
  IMAGE_UPLOADED: "Hello human! Here's your filtered image:\n\n",
}
export default TEXT
