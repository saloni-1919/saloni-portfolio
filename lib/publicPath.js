export const publicPath = (path) => !path ? '' : `${process.env.NEXT_PUBLIC_BASE_PATH || ''}${path.startsWith('/') ? path : '/' + path}`;
