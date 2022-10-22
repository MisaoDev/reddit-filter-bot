import * as dotenv from 'dotenv'
import Snoowrap from 'snoowrap'
import { CommentStream } from 'snoostorm'
import fetch from 'node-fetch'
import sharp from 'sharp'
import TEXT from './messages.js'
import { amMentioned, getOptions } from './parsing.js'
import imgur from 'imgur'
const { ImgurClient } = imgur

dotenv.config()

const VALID_OPTIONS = ['brightness', 'saturation', 'hue']

const reddit = new Snoowrap({
  userAgent: 'reddit-image-filter-bot',
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  username: process.env.REDDIT_USER,
  password: process.env.REDDIT_PASS,
})

const BOT_START_DATE = Date.now() / 1000

const comments = new CommentStream(reddit, {
  subreddit: process.env.SUBREDDIT_STRING,
  limit: 10,
  pollTime: 2000,
})

comments.on('item', async (comment) => {
  if (comment.created_utc < BOT_START_DATE) return

  // Check message text
  const options = getOptions(comment.body)
  if (!options) {
    if (!amMentioned(comment.body)) return //Not for me!
    console.log('I was mentioned!')
    return comment.reply(TEXT.HELLO)
  }
  if (options.length === 0) {
    console.log('no options provided/bad syntax')
    return comment.reply(TEXT.BAD_SYNTAX)
  }

  const post = await reddit.getSubmission(comment.link_id).fetch()

  if (post.post_hint !== 'image') {
    console.log('not an image!')
    return comment.reply(TEXT.NOT_AN_IMAGE)
  }

  const url = post.url
  let res = await fetch(url)
  if (!res.ok) throw new Error(`unexpected response ${res.statusText}`)

  const buffer = Buffer.from(await res.arrayBuffer())
  let image = await sharp(buffer)

  const filterOptions = {}
  options.forEach((option) => {
    const { opt, arg } = option
    const amount = arg.endsWith('%') ? parseFloat(arg) / 100 : parseInt(arg)

    if (!VALID_OPTIONS.includes(opt)) {
      // Ignore this filter
      return console.log('invalid option')
    }

    filterOptions[opt] = amount
  })

  try {
    image = await image.modulate(filterOptions).png()
  } catch (error) {
    console.log('error while applying filter', error)
    return comment.reply(TEXT.ERROR_APPLYING)
  }

  const imgur = new ImgurClient({
    clientId: process.env.IMGUR_CLIENT_ID,
    clientSecret: process.env.IMGUR_CLIENT_SECRET,
    refreshToken: process.env.IMGUR_REFRESH_TOKEN,
  })

  res = await imgur.upload({
    image: await image.toBuffer(),
    type: 'stream',
  })
  if (!res.success) {
    console.log('error al subir la imagen')
    return comment.reply(TEXT.ERROR_UPLOADING)
  }

  return comment.reply(TEXT.IMAGE_UPLOADED + res.data.link)
})
