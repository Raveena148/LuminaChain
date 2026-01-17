/**
 * Converts a hex string to an integer.
 */
export const hexToInt = (hex: string): number => {
    if (!hex) return 0;
    return parseInt(hex, 16);
};

/**
 * Formats a base fee from Wei (hex) to Gwei (string).
 */
export const formatBaseFee = (baseFeeHex: string | undefined): string => {
    if (!baseFeeHex) return 'N/A';
    return (parseInt(baseFeeHex, 16) / 1e9).toFixed(2) + ' Gwei';
};

/**
 * Converts Wei (hex or string) to Ether (string).
 */
export const weiToEth = (wei: string | number): string => {
    const value = typeof wei === 'string' && wei.startsWith('0x') ? parseInt(wei, 16) : Number(wei);
    return (value / 1e18).toString();
};
