import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Environment } from '@app/env';
import { SearchListResponse } from '@app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {
  private get apiKey() {
    return this.env.google.apiKey;
  }

  private get baseUrl() {
    return this.env.google.baseUrl;
  }

  private searchConstants = {
    MAX_RESULTS: 50,
    TYPE: 'video',
    PART: 'snippet',
  };

  constructor(
    private readonly env: Environment,
    private readonly http: HttpClient,
  ) { }

  public searchVideos(query: string): Observable<SearchListResponse> {
    const params = new HttpParams()
      .set('key', this.apiKey)
      .set('maxResults', `${this.searchConstants.MAX_RESULTS}`)
      .set('type', `${this.searchConstants.TYPE}`)
      .set('part', `${this.searchConstants.PART}`)
      .set('q', query);

    return this.http.get(`${this.baseUrl}/search`, { params });
  }
}
