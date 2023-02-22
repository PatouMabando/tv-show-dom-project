let allEpisodes;

function setup() {
  document
        .getElementById("searchInput")
        .addEventListener("input", makePageForMatchingEpisodes);

    //we cache the episode list locally for further filtering
    allEpisodes = getAllEpisodes();
    makePageForEpisodes(allEpisodes);
}

//level-200
function makePageForMatchingEpisodes(event) {
  const query = document.getElementById("searchInput").value;
  const filtered = allEpisodes.filter(episode =>
      episodeMatchesQuery(episode, query)
  );
  makePageForEpisodes(filtered);
}



//level-300
function contains(inspectStr, targetStr) {
  return -1!==inspectStr.tolowercase().indexof(targetStr.tolowercase());
}

function episodeMatchesQuery(episode, query) {
  return contains(episode.name, query) || contains(episode.summary, query);
}


function handleChosenEpisode(event) {
  let opts = event.target.selectedOptions;
  if (opts.length !== 1) {
      return;
  }
  let id = opts[0].value;
  document.location.assign(`#${id}`);
}

function makeEpisodeSelector(episodes) {
  const selectElem = document.getElementById("episodeSelect");
  selectElem.textContent = ""; //empty it
  selectElem.onchange = handleChosenEpisode;
  episodes.forEach(episode => {
      //<option value="S01E01">S01E01 Winter is Coming</option>;
      const optionElem = document.createElement("option");
      const code = makeEpisodeCode(episode);
      optionElem.setAttribute("value", code);
      optionElem.textContent = `${code} - ${episode.name}`;
      selectElem.appendChild(optionElem);
  });
}


function pad(num) {
  return num.toString().padStart(2, "0");
}

function makeEpisodeCode(episode) {
  return `S${pad(episode.season)}E${pad(episode.number)}`;
}

function makePageForEpisodes(json) {
  makeEpisodeSelector(json);

  document.getElementById(
      "countDisplay"
  ).textContent = `Displaying ${json.length}/${allEpisodes.length} episodes.`;

  const container = document.getElementById("episodes");
  container.textContent = ""; //wipe previous content
  json.forEach(episode => {
      const card = makeCardForEpisode(episode);
      container.appendChild(card);
  });
}

function makeCardForEpisode(episode) {
  
  const code = makeEpisodeCode(episode);

  const card = document.createElement("div");
  card.classList.add("card");
  card.setAttribute("id", code);

  const h1 = document.createElement("h1");
  h1.textContent = `${episode.name} - ${code}`;

  const img = document.createElement("img");
  img.setAttribute(
      "src",
      episode.image ? episode.image.medium : "https://placekitten.com/300/200"
  );

  const p = document.createElement("p");
  p.textContent = stripTags(episode.summary);

  card.appendChild(h1);
  card.appendChild(img);
  card.appendChild(p);
  return card;
}


function stripTags(str) {
  if (!str) {
      return str;
  }

  return str.replace(/<\/?[a-z]+>/gi, "");
}

window.onload = setup;