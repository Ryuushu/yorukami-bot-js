module.exports = {
  name: 'skip',
  aliases: ['next'],
  inVoiceChannel: true,
  run: async (client, message) => {
    const queue = client.distube.getQueue(message)
    if (!queue) return message.channel.send(`${client.emotes.error} | There is nothing in the queue right now!`)
    try {
      const song = await queue.skip()
      message.channel.send(`${client.emotes.success} | Skipped!`)
    } catch (e) {
    if(e.errorCode=='NO_UP_NEXT')
      message.channel.send(`${client.emotes.error} | There is no up next song,You can add it first`)
    }
  }
}
