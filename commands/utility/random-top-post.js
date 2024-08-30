const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios').default;
require('dotenv').config();

const SUBREDDIT_OPTION_NAME = 'subreddit';


const getRandomSubreddit = async () => {
  //wrap this in a try catch?
  const res = await axios.get(`${process.env.REDDIT_BASE_URL}/subreddits/.json`);
  
  const subreddits = res?.data?.data?.children || [];

  return subreddits[Math.floor(Math.random() * subreddits.length)]?.data?.display_name;
};


const getRandomSubredditTopPost = async (subreddit) => {
  //wrap this in a try catch?
  const res = await axios.get(`${process.env.REDDIT_BASE_URL}/r/${subreddit}/top/.json`);
  
  const topPosts = res?.data?.data?.children || [];

  topPosts.sort((postA, postB) => {
    if (postA?.data?.score < postB?.data?.score) {
      return 1;
    } else if (postA?.data?.score > postB?.data?.score) {
      return -1;
    }
    return 0;
  });

  return topPosts[Math.floor(Math.random() * topPosts.length)].data.permalink;
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reddit')
		.setDescription('Replies with a random top post from a random subreddit')
    .addStringOption(
      (option) =>
        option.setName(SUBREDDIT_OPTION_NAME)
          .setDescription('Use a specific subreddit to get a random top post from')
    ),
	async execute(interaction) {
    const subreddit = interaction.options.getString('subreddit');
		await interaction.reply(`https://www.reddit.com${await getRandomSubredditTopPost(subreddit || await getRandomSubreddit())}`);
	}
};