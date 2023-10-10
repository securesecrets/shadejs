import {
  catchError,
  Observable,
  of,
  switchMap,
  first,
} from 'rxjs';

function createFetchClient<T>(data$: Observable<T>) {
  return data$.pipe(
    switchMap((response) => of(response)),
    first(),
    catchError((err) => {
      throw err;
    }),
  );
}

function createFetch(data$: Observable<Response>) {
  return data$.pipe(
    switchMap(async (response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Fetch Error');
    }),
  );
}

export {
  createFetchClient,
  createFetch,
};
