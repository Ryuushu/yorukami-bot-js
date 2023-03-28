module.exports = {
  name: 'resume',
  aliases: ['resume', 'unpause'],
  inVoiceChannel: true,
  run: async (client, message) => {
    const queue = client.distube.getQueue(message)
    if (!queue) return message.channel.send(`${client.emotes.error} | There is nothing in the queue right now!`)
    try{
     await queue.resume()
     message.channel.send(`${client.emotes.success} | Resumed the song for you :)`)
     }
     catch(e){
      if(e.errorCode=='RESUMED')
      message.channel.send(`${client.emotes.error} | The queue has been playing already`)
     }
  }
}
