module.exports = {
  name: 'pause',
  aliases: ['pause', 'hold'],
  inVoiceChannel: true,
  run: async (client, message) => {

    const queue = client.distube.getQueue(message)
    if (!queue) return message.channel.send(`${client.emotes.error} | There is nothing in the queue right now!`)
      try{
        //if (queue.pause) {
          //await queue.resume()
          //return message.channel.send('Resumed the song for you :)')
        //}
    await queue.pause()
    message.channel.send(`${client.emotes.success} | Paused the song for you :)`)
    
    }catch(e){
    if(e.errorCode=='PAUSED')
     message.channel.send(`${client.emotes.error} | The queue has been paused already`)
    }
  }
}
