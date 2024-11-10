import axios from 'axios'
import path from 'path'
import https from "https"
import fs from "fs"

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

function downloadImage (url) {
  return new Promise((resolve, reject) => {
    const fileName = path.join('public/data-images/'+url.replace(/^.*?([^/]*)$/, "$1"));
    if (fs.existsSync(fileName)) {
      console.log(`${fileName} existed, ignore...`);
      resolve(null);
      return;
    }
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        console.log(`Failed to Download ${fileName}: ${response.statusCode}`);
        reject();
        return;
      }

      const fileStream = fs.createWriteStream(fileName);

      response.pipe(fileStream);
      fileStream.on("finish", () => {
        console.log(`Downloaded ${url} as ${fileName}`);
        resolve(true);
      });
    }).on("error", (error) => {
      console.log(`Error downloading ${url}: ${error}`);
      reject();
    });
  });
}


async function downloadJson() {
  const heroList = (await axios.get('https://www.dota2.com/datafeed/herolist?language=schinese')).data.result.data.heroes.map(i => ({
    id: i.id,
    name: i.name.replace('npc_dota_hero_', ''),
    nameEN: i.name_english_loc,
    nameCN: i.name_loc,
  }))
  for (const hero of heroList) {
    await downloadImage(`https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/heroes/${hero.name}.png`)
    const heroData = (await axios.get(`https://www.dota2.com/datafeed/herodata?language=schinese&hero_id=${hero.id}`)).data.result.data.heroes[0]
    hero.abilities = heroData.abilities.filter(i => 
      !i.ability_is_granted_by_scepter && !i.ability_is_granted_by_shard && !i.ability_is_innate
    ).map(i => ({
      id: i.id,
      name: i.name,
      nameCN: i.name_loc,
    }))
    for (const ability of hero.abilities) {
      await downloadImage(`https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/abilities/${ability.name}.png`)
      await wait(500)
    }
    await wait(1000)
  }
  fs.writeFileSync(path.join('public/data.json'), JSON.stringify(heroList, null, 2))
}

await downloadJson()