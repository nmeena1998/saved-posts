export class HttpError extends Error {
  constructor(public status: 401 | 403 | 404 | 409, message: string) {
    super(message);
  }
}

export const unauthorized = () => new HttpError(401, 'Unauthenticated');
export const forbidden = () => new HttpError(403, 'Forbidden');
export const notFound = () => new HttpError(404, 'Not found');
