/**
 * Parse contract query responses to determine if an error has occured
 */
function identifyQueryResponseErrors(response) {
    if (typeof response === 'string'
        && (response.includes('error') || response.includes('Error'))) {
        throw new Error(response);
    }
    if (typeof response === 'object'
        && 'includes' in response
        && response.includes('parse_err')) {
        throw new Error(response);
    }
}
export { identifyQueryResponseErrors, };
