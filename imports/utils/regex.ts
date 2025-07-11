/**
 * Check if email is valid
 */
// eslint-disable-next-line import/prefer-default-export
export const emailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

/**
 * Selects the body tags in an HTML string
 *
 * @example
 * const bodyMatches = htmlBodyRegex.exec(htmlString);
 * const bodyContent = bodyMatches ? bodyMatches[1] : '';
 */
export const htmlBodyRegex = /<body[^>]*>([\s\S]*)<\/body>/gi;
