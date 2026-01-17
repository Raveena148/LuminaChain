/**
 * Converts a hex string to an integer.
 */
export const hexToInt = (hex) => {
    if (!hex)
        return 0;
    return parseInt(hex, 16);
};
/**
 * Formats a base fee from Wei (hex) to Gwei (string).
 */
export const formatBaseFee = (baseFeeHex) => {
    if (!baseFeeHex)
        return 'N/A';
    return (parseInt(baseFeeHex, 16) / 1e9).toFixed(2) + ' Gwei';
};
/**
 * Converts Wei (hex or string) to Ether (string).
 */
export const weiToEth = (wei) => {
    const value = typeof wei === 'string' && wei.startsWith('0x') ? parseInt(wei, 16) : Number(wei);
    return (value / 1e18).toString();
};
