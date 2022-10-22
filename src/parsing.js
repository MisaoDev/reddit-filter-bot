export const amMentioned = (msg) => {
  return msg?.match(/[uU]\/ImageFilterBot/g)
}

/**
 * Parses the main command with arguments and options
 * @param {String} msg Command string
 * @returns Object with options and arguments
 * @example '!FilterThisImage saturation 50% brightness 120% hue 180'
 *          will return:
 *            [
 *              { opt: 'saturation', arg: '50%' },
 *              { opt: 'brightness', arg: '120%' },
 *              { opt: 'hue', arg: '180' }
 *            ]
 */
export const getOptions = (msg) => {
  const args = msg.match(/^!FilterThisImage(?:\s(.+))?/)
  if (!args) return null
  if (!args[1]) return []
  const matches = [...args[1].matchAll(/(?:^|\s)([a-zA-Z]+)\s+(-?[0-9%]+)/g)]
  const options = matches.map((m) => ({ opt: m[1], arg: m[2] }))
  return options
}
