import { Observable } from 'rxjs';
declare function createFetchClient<T>(data$: Observable<T>): Observable<T>;
declare function createFetch(data$: Observable<Response>): Observable<any>;
export { createFetchClient, createFetch, };
