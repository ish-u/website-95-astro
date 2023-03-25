// Fetch Now Playing Song on Spotify
export async function fetchSongDetails() {
  // Song Name
  const song = await (
    await fetch("https://spotify-readme.ishu2.repl.co/nowPlaying/plainText")
  ).json();
  const title = song.name;
  const artists = song.artists.join(", ");
  const sonegElements = document.getElementsByClassName("song-name");
  const songImageElements = document.getElementsByClassName("song-image");
  for (let i = 0; i < sonegElements.length; i++) {
    const songNameEle = sonegElements.item(i);
    if (songNameEle) {
      songNameEle.innerHTML = title + " - " + artists;
    }
    // Song Image
    const songImageEle = songImageElements.item(i);
    if (songImageEle) {
      (songImageEle as HTMLImageElement).src =
        "https://spotify-readme.ishu2.repl.co/nowPlaying/image?t=" +
        new Date().getMilliseconds();
    }
  }
}
