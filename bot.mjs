import axios from 'axios';
import discord from 'discord.js';

const getSubredditTopPosts = async () => {

  //wrap this in a try catch?
  const res = await axios.get(`https://www.reddit.com/r/funny/top/.json`);

  const topPosts = res?.data?.data?.children || [];

  topPosts.sort((postA, postB) => {
    if (postA?.data?.score < postB?.data?.score) {
      return 1;
    } else if (postA?.data?.score > postB?.data?.score) {
      return -1;
    }
    return 0;
  });

  return topPosts;
};

(async () => {
    const topPosts = await getSubredditTopPosts();

    console.log(topPosts.map(p => p.data.score));

})();