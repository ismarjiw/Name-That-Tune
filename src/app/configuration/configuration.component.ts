import { Component, OnInit } from '@angular/core';
import { AUTH_ENDPOINT, TOKEN_KEY } from '../home/home.component';
import fetchFromSpotify, { request } from 'src/services/api';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css'],
})
export class ConfigurationComponent implements OnInit {
  
  constructor() {}

  genres: String[] = ["House", "Alternative", "J-Rock", "R&B"];
  selectedGenre: String = "";
  authLoading: boolean = false;
  configLoading: boolean = false;
  token: String = "";

  categoryId: String = '';
  genreCategoryMapping: { [genre: string]: string } = {};

  firstPlaylist: any;
  firstPlaylistId: String = '';
  tracks: any[] = [];

  async ngOnInit(): Promise<void> {
    this.authLoading = true;
    const storedTokenString = localStorage.getItem(TOKEN_KEY);
    if (storedTokenString) {
      const storedToken = JSON.parse(storedTokenString);
      if (storedToken.expiration > Date.now()) {
        console.log("Token found in localstorage");
        this.authLoading = false;
        this.token = storedToken.value;
        this.loadGenres(storedToken.value);
        return;
      }
    }
    console.log("Sending request to AWS endpoint");
    request(AUTH_ENDPOINT).then(({ access_token, expires_in }) => {
      const newToken = {
        value: access_token,
        expiration: Date.now() + (expires_in - 20) * 1000,
      };
      localStorage.setItem(TOKEN_KEY, JSON.stringify(newToken));
      this.authLoading = false;
      this.token = newToken.value;
      this.loadGenres(newToken.value);
    });
  }

  loadGenres = async (t: any) => {
    this.configLoading = true;

    const response = await fetchFromSpotify({
      token: t,
      endpoint: "browse/categories",
    });

    this.genres = response.categories.items.map((category: any) => {

      // Exclude the genre "Spotify Classics"
      if (category.name === "Spotify CLASSICS") {
        return null;
      }
      // Populate the genre to categoryId mapping
      this.genreCategoryMapping[category.name.toLowerCase()] = category.id;
      return category.name;
    })
    .filter(Boolean); // Remove null values from the array

    this.configLoading = false;
  };

  mapGenreToCategoryId(selectedGenre: string): string {
    return this.genreCategoryMapping[selectedGenre.toLowerCase()] || '';
  }

  async fetchPlaylistByGenre(selectedGenre: string) {
    // Map selected genre to category ID
    const categoryId = this.mapGenreToCategoryId(selectedGenre);
    if (!categoryId) {
      console.error(`Category ID not found for genre: ${selectedGenre}`);
      return;
    }
  
    // Fetch the first playlist for the selected genre
    this.firstPlaylist = await this.getFirstPlaylistByCategory(this.token, categoryId);
    console.log('First Playlist:', this.firstPlaylist);

    this.firstPlaylistId = this.firstPlaylist.id;
    console.log('Playlist Id: ', this.firstPlaylistId);

    this.fetchTracksByPlaylistId(this.firstPlaylistId);
  }

  async fetchTracksByPlaylistId(playlistId: String) {
    // Construct the endpoint
    const endpoint = `playlists/${playlistId}/tracks`;
  
    try {
      // Fetch tracks data from the Spotify API
      const response = await fetchFromSpotify({ token: this.token, endpoint: endpoint });
      
      // Extract tracks from the response
      // const tracks = response.items;
      const tracks = response.items.filter((track: any) => track.track.preview_url !== null);
  
      // Log the tracks or process them as needed
      console.log('Tracks:', tracks);
      
      this.tracks = tracks;

      return tracks;
    } catch (error) {
      console.error('Error fetching tracks:', error);
      return null;
    }
  }
  
  setGenre(selectedGenre: any) {
    this.selectedGenre = selectedGenre;
    console.log(this.selectedGenre);

    const categoryId = this.mapGenreToCategoryId(selectedGenre);
    console.log('Category ID:', categoryId);

    this.fetchPlaylistByGenre(selectedGenre);
  }

  getFirstPlaylistByCategory = async (t: String, categoryId: String) => {
    const endpoint = `browse/categories/${categoryId}/playlists`;
    const response = await fetchFromSpotify({
      token: t,
      endpoint: endpoint,
    });
    // Check if there are playlists available
    if (response.playlists.items.length > 0) {
      // Return the first playlist item
      return response.playlists.items[0];
    } else {
      // Return null or handle the case when no playlists are available
      return null;
    }
  }
}
