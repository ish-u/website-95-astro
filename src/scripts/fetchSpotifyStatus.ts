// Fetch Now Playing Song on Spotify
export async function fetchSongDetails() {
  // Song Name
  const song = await fetch(
    "https://currently-playing.up.railway.app/currently-playing"
  )
    .then((res) => res.json())
    .catch((e) => console.error(e));
  const sonegURLElements = document.getElementsByClassName("song-url");
  const sonegElements = document.getElementsByClassName("song-name");
  const songImageElements = document.getElementsByClassName("song-image");
  for (let i = 0; i < sonegElements.length; i++) {
    const songNameEle = sonegElements.item(i);
    if (songNameEle) {
      songNameEle.innerHTML = song?.name ?? "Nothing";
    }

    const songUrl = sonegURLElements.item(i);
    if (songUrl) {
      (songUrl as HTMLAnchorElement).href = song?.url ?? "";
    }

    const songImageEle = songImageElements.item(i);
    if (songImageEle) {
      (songImageEle as HTMLImageElement).src =
        song?.image ?? "images/music.png";
    }
  }
}
