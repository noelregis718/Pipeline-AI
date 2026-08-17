const fs = require('fs');
const https = require('https');

const query = JSON.stringify({
  query: `
    query {
      pokemon_v2_pokemon(limit: 2000) {
        name
        pokemon_v2_pokemonstats {
          base_stat
          pokemon_v2_stat {
            name
          }
        }
      }
    }
  `
});

const options = {
  hostname: 'beta.pokeapi.co',
  path: '/graphql/v1beta',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': query.length
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      const formatted = {};
      json.data.pokemon_v2_pokemon.forEach(p => {
        const stats = {};
        p.pokemon_v2_pokemonstats.forEach(s => {
          stats[s.pokemon_v2_stat.name] = s.base_stat;
        });
        formatted[p.name] = stats;
      });
      fs.writeFileSync('src/data/pokemon_stats.json', JSON.stringify(formatted));
      console.log('Successfully saved stats for ' + Object.keys(formatted).length + ' pokemon.');
    } catch (e) {
      console.error(e);
      console.error(data);
    }
  });
});

req.on('error', (e) => {
  console.error(e);
});

req.write(query);
req.end();
