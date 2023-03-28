module.exports = {
  name: 'previous',
  inVoiceChannel: true,
  run: async (client, message) => {

    const queue = client.distube.getQueue(message)
    if (!queue) return message.channel.send(`${client.emotes.error} | There is nothing in the queue right now!`)
    try{
    const song = await queue.previous()
    message.channel.send(`${client.emotes.success} | Now playing:\n${song.name}`)
    }catch(e){
     if(e.errorCode=='NO_PREVIOUS')
     message.channel.send(`${client.emotes.error} |  There is no previous song,You can add it first`)
    }
  }
}
