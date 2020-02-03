export interface SearchListResponse {
  /** Etag of this resource. */
  etag?: string;
  /** Serialized EventId of the request which produced this response. */
  eventId?: string;
  /** A list of results that match the search criteria. */
  items?: SearchResult[];
  /** Identifies what kind of resource this is. Value: the fixed string "youtube#searchListResponse". */
  kind?: string;
  /** The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set. */
  nextPageToken?: string;
  pageInfo?: PageInfo;
  /** The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set. */
  prevPageToken?: string;
  regionCode?: string;
  tokenPagination?: any;
  /** The visitorId identifies the visitor. */
  visitorId?: string;
}
export interface PageInfo {
  /** The number of results included in the API response. */
  resultsPerPage?: number;
  /** The total number of results in the result set. */
  totalResults?: number;
}
export interface SearchResult {
  /** Etag of this resource. */
  etag?: string;
  /** The id object contains information that can be used to uniquely identify the resource that matches the search request. */
  id?: ResourceId;
  /** Identifies what kind of resource this is. Value: the fixed string "youtube#searchResult". */
  kind?: string;
  /**
   * The snippet object contains basic details about a search result, such as its title or description.
   * For example, if the search result is a video, then
   * the title will be the video's title and the description will be the video's description.
   */
  snippet?: SearchResultSnippet;
}
export interface ResourceId {
  /**
   * The ID that YouTube uses to uniquely identify the referred resource, if that resource is a channel.
   * This property is only present if the
   * resourceId.kind value is youtube#channel.
   */
  channelId?: string;
  /** The type of the API resource. */
  kind?: string;
  /**
   * The ID that YouTube uses to uniquely identify the referred resource, if that resource is a playlist.
   * This property is only present if the
   * resourceId.kind value is youtube#playlist.
   */
  playlistId?: string;
  /**
   * The ID that YouTube uses to uniquely identify the referred resource, if that resource is a video.
   * This property is only present if the resourceId.kind
   * value is youtube#video.
   */
  videoId?: string;
}
export interface SearchResultSnippet {
  /** The value that YouTube uses to uniquely identify the channel that published the resource that the search result identifies. */
  channelId?: string;
  /** The title of the channel that published the resource that the search result identifies. */
  channelTitle?: string;
  /** A description of the search result. */
  description?: string;
  /**
   * It indicates if the resource (video or channel) has upcoming/active live broadcast content.
   * Or it's "none" if there is not any upcoming/active live
   * broadcasts.
   */
  liveBroadcastContent?: string;
  /** The creation date and time of the resource that the search result identifies.
   * The value is specified in ISO 8601 (YYYY-MM-DDThh:mm:ss.sZ) format.
   */
  publishedAt?: string;
  /**
   * A map of thumbnail images associated with the search result.
   * For each object in the map, the key is the name of the thumbnail image, and the value is
   * an object that contains other information about the thumbnail.
   */
  thumbnails?: ThumbnailDetails;
  /** The title of the search result. */
  title?: string;
}

export interface ThumbnailDetails {
  /** The default image for this resource. */
  default?: Thumbnail;
  /** The high quality image for this resource. */
  high?: Thumbnail;
  /** The maximum resolution quality image for this resource. */
  maxres?: Thumbnail;
  /** The medium quality image for this resource. */
  medium?: Thumbnail;
  /** The standard quality image for this resource. */
  standard?: Thumbnail;
}

export interface Thumbnail {
  /** (Optional) Height of the thumbnail image. */
  height?: number;
  /** The thumbnail image's URL. */
  url?: string;
  /** (Optional) Width of the thumbnail image. */
  width?: number;
}
