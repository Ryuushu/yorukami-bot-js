const { DisTube } = require('distube')
const Discord = require('discord.js')
const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES
  ]
})
const fs = require('fs')
const config = require('./config.json')
const { SpotifyPlugin } = require('@distube/spotify')
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { YtDlpPlugin } = require('@distube/yt-dlp')
const idauthor = `<@343482854187073546>`
const author = idauthor.toString()

client.config = require('./config.json')
client.distube = new DisTube(client, {
  leaveOnStop: false,
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
  plugins: [
    new SpotifyPlugin({
      emitEventsAfterFetching: true
    }),
    new SoundCloudPlugin(),
    new YtDlpPlugin()
  ],
  youtubeDL: false
})
client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()
client.emotes = config.emoji

fs.readdir('./commands/', (err, files) => {
  if (err) return console.log('Could not find any commands!')
  const jsFiles = files.filter(f => f.split('.').pop() === 'js')
  if (jsFiles.length <= 0) return console.log('Could not find any commands!')
  jsFiles.forEach(file => {
    const cmd = require(`./commands/${file}`)
    console.log(`Loaded ${file}`)
    client.commands.set(cmd.name, cmd)
    if (cmd.aliases) cmd.aliases.forEach(alias => client.aliases.set(alias, cmd.name))
  })
})

client.on('ready', () => {
  client.user.setStatus('test');

  console.log('bot status', client.user.presence.status);
  console.log(`${client.user.tag} is ready to play music.`)
})

client.on('messageCreate', async message => {
  if (message.author.bot || !message.guild) return
    const prefix = config.prefix
      if (!message.content.startsWith(prefix)) return
        const args = message.content.slice(prefix.length).trim().split(/ +/g)
        const command = args.shift().toLowerCase()
        const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command))
      if (!cmd) return
        if (cmd.inVoiceChannel && !message.member.voice.channel) {
          return message.channel.send(`${client.emotes.error} | You must be in a voice channel!`)
  }
  try {
    cmd.run(client, message, args)
  } catch (e) {
    console.error(e)
    message.channel.send(`${client.emotes.error} | Error: \`${e}\``)
  }
})


const exampleEmbed = (song,isqueue) => new Discord.MessageEmbed()
	.setColor(isqueue==false?0x0099FF:0x14ff6a)
	.setTitle(song.name)
	.setURL(song.url)
	.setAuthor({ name: isqueue==false?'Playing Now ...':'Added to the queue', iconURL: song.thumbnail, url: song.url })
	//.setDescription('Duration : '+song.formattedDuration)
	.setThumbnail(song.thumbnail)
	.addFields(
		{ name: `Duration`, value: `${song.formattedDuration}`, inline: true},
   { name: `View`, value: `${song.views.toLocaleString('id-ID')}`, inline: true},
    //{ name: `\u200B`, value: `\u200B`, inline: true },
    { name: `Like`, value: `${song.likes.toLocaleString('id-ID')}`, inline: true },
    { name: 'Request By', value: `${song.user}`, inline: true }
		
	)
	//.addFields({ name: 'Request By', value: `${song.user}`, inline: true })
	//.setImage(song.thumbnail)
	.setTimestamp()
	.setFooter({ text: 'Have a good time', iconURL: 'https://i.ibb.co/51mQLCT/IMG-20230328-WA0000.jpg' });
 
const status = queue =>
  `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.join(', ') || 'Off'}\` | Loop: \`${
    queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'
  }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``
  
client.distube
  .on('playSong', (queue, song) =>{
    //queue.textChannel.send(
      //`${client.emotes.play} | Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${
        //song.user
      //}\n${status(queue)}`
    //)
    //console.log(client.emotes);
    
    queue.textChannel.send({embeds: [exampleEmbed(song,isqueue=false)]})
    }
  )
  .on('addSong', (queue, song) =>
    //queue.textChannel.send(
      //`${client.emotes.success} | Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
    //)
     queue.textChannel.send({embeds: [exampleEmbed(song,isqueue=true)]})
  )
  .on('addList', (queue, playlist) =>
    queue.textChannel.send(
      `${client.emotes.success} | Added \`${playlist.name}\` playlist (${
        playlist.songs.length
      } songs) to queue\n${status(queue)}`
    )
  )
  .on('error', (channel, e) => {
    channel.send(`${client.emotes.error} | An error encountered: ${e.toString().slice(0, 1974)}`)
    console.error(e)
  })
  .on('empty', channel => channel.send('Voice channel is empty! Leaving the channel...'))
  .on('searchNoResult', (message, query) =>
    message.channel.send(`${client.emotes.error} | No result found for \`${query}\`!`)
  )
  .on('finish', queue => queue.textChannel.send('Finished!'))
// // DisTubeOptions.searchSongs = true
// .on("searchResult", (message, result) => {
//     let i = 0
//     message.channel.send(
//         `**Choose an option from below**\n${result
//             .map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``)
//             .join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`
//     )
// })
// .on("searchCancel", message => message.channel.send(`${client.emotes.error} | Searching canceled`))
// .on("searchInvalidAnswer", message =>
//     message.channel.send(
//         `${client.emotes.error} | Invalid answer! You have to enter the number in the range of the results`
//     )
// )
// .on("searchDone", () => {})

client.login(config.token)
