const Discord = require('discord.js')
const exampleEmbed =(q) => new Discord.MessageEmbed()
	.setColor(0xFFCA14)
	.setTitle('List Queue')
  .setDescription(q)
	.setTimestamp()
	.setFooter({ text: 'Have a good time', iconURL: 'https://i.ibb.co/51mQLCT/IMG-20230328-WA0000.jpg' });
 
module.exports = {
  name: 'queue',
  aliases: ['q'],
  run: async (client, message) => {
    const queue = client.distube.getQueue(message)
    if (!queue) return message.channel.send(`${client.emotes.error} | There is nothing playing!`)
    const q = queue.songs
      .map((song, i) => `${i === 0 ? 'Playing Now : \n' : `${i}.`} ${song.name} - \`${song.formattedDuration}\``)
      .join('\n')
    message.channel.send({embeds: [exampleEmbed(q)]})
  }
}
