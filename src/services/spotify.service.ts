import {Injectable} from '@angular/core';
import {from, Observable, of, throwError} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';
import fetchFromSpotify, {request} from 'src/services/api';
import {AUTH_ENDPOINT} from '../app/home/home.component'

@Injectable({
    providedIn: 'root'
})
export class SpotifyService {
    private token: string = '';
    private genres: string[] = [];
    private tracks: any[] = [];
    private genreCategoryMapping: { [genre: string]: string } = {};
    private numberOfPlaylistsToFetch = 10;


    constructor() {
    }

    get allGenres(): string[] {
        return this.genres;
    }

    // ********************************** \\ ************************* 
    // https://developer.spotify.com/documentation/web-api/reference/get-categories
    // ********************************** \\ ************************* 

    get allTracks(): any[] {
        return this.tracks;
    }

    fetchTokenFromAWS(): Observable<{ value: string; expiration: number }> {
        return from(request(AUTH_ENDPOINT)).pipe(
            map(({access_token, expires_in}) => {
                const newToken = {
                    value: access_token,
                    expiration: Date.now() + (expires_in - 20) * 1000,
                };
                return newToken;
            })
        );
    }

    loadGenres(): Observable<string[]> {
        return from(fetchFromSpotify({
            token: this.token,
            endpoint: 'browse/categories',
        })).pipe(
            map((response) => {
                this.genres = response.categories.items
                    .map((category: any) => {
                        if (category.name === 'Spotify CLASSICS') {
                            return null;
                        }
                        this.genreCategoryMapping[category.name.toLowerCase()] = category.id;
                        return category.name;
                    })
                    .filter(Boolean);
                return this.genres;
            }),
            catchError((error) => {
                console.error('Error fetching genres:', error);
                return of([]);
            })
        );
    }

    // ********************************** \\ ************************* 
    // https://developer.spotify.com/documentation/web-api/reference/get-playlists-tracks
    // ********************************** \\ ************************* 

    mapGenreToCategoryId(selectedGenre: String): String {
        return this.genreCategoryMapping[selectedGenre.toLowerCase()] || '';
    }

    // ********************************** \\ ************************* 
    // https://developer.spotify.com/documentation/web-api/reference/get-a-categories-playlists
    // ********************************** \\ ************************* 

    fetchPlaylistByGenre(selectedGenre: String): Observable<any> {
        const categoryId = this.mapGenreToCategoryId(selectedGenre);
        if (!categoryId) {
            console.error(`Category ID not found for genre: ${selectedGenre}`);
            return of(null);
        }

        return this.getRandomPlaylistByCategory(categoryId).pipe(
            mergeMap((randomPlaylist) => {
                if (!randomPlaylist) {
                    return of(null);
                }
                return this.fetchTracksByPlaylistId(randomPlaylist.id).pipe(
                    map(() => randomPlaylist)
                );
            })
        );
    }

    getRandomPlaylistByCategory(categoryId: String): Observable<any> {
        const endpoint = `browse/categories/${categoryId}/playlists?limit=${this.numberOfPlaylistsToFetch}`;
        return from(fetchFromSpotify({token: this.token, endpoint})).pipe(
            mergeMap((response) => {
                const playlists = response.playlists.items;
                const playlistsWithTracks = playlists.filter((playlist: {
                    tracks: { total: number; };
                }) => playlist.tracks.total > 0);
                if (playlistsWithTracks.length > 0) {
                    // Select a random playlist that has tracks
                    const randomIndex = Math.floor(Math.random() * playlistsWithTracks.length);
                    return of(playlistsWithTracks[randomIndex]);
                } else {
                    return throwError('No playlists with tracks found');
                }
            }),
            catchError((error) => {
                console.error('Error fetching playlists with tracks:', error);
                return of(null);
            })
        );
    }

    fetchTracksByPlaylistId(playlistId: string): Observable<any[]> {
        const endpoint = `playlists/${playlistId}/tracks`;
        return from(fetchFromSpotify({token: this.token, endpoint})).pipe(
            map((response) => {
                const tracks = response.items.filter(
                    (track: any) => track.track.preview_url !== null
                );
                console.log('Tracks:', tracks);
                return tracks;
            }),
            catchError((error) => {
                console.error('Error fetching tracks:', error);
                return of([]);
            })
        );
    }

    //
    // getFirstPlaylistByCategory(categoryId: String): Observable<any> {
    //     const endpoint = `browse/categories/${categoryId}/playlists`;
    //     return from(fetchFromSpotify({token: this.token, endpoint})).pipe(
    //         map((response) => {
    //             if (response.playlists.items.length > 0) {
    //                 return response.playlists.items[0];
    //             } else {
    //                 return null;
    //             }
    //         }),
    //         catchError((error) => {
    //             console.error('Error fetching playlists:', error);
    //             return of(null);
    //         })
    //     );
    // }

    setToken(token: string) {
        this.token = token;
    }
}
