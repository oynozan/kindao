// Date to DD/MM/YYYY Format
export function formatDate(date: Date): string {
    // Extract day, month, and year from the date object
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    // Return formatted date string
    return `${day}/${month}/${year}`;
}

// Truncating wallet addresses
export function truncateWalletAddress(walletAddress: string, prefixLength = 10, suffixLength = 6): string {
    // Check if the wallet address is valid
    if (typeof walletAddress !== 'string' || walletAddress.length < prefixLength + suffixLength)
        return walletAddress; // Return the original address if it's invalid or too short

    // Extract the prefix and suffix parts of the address
    const prefix = walletAddress.substring(0, prefixLength);
    const suffix = walletAddress.substring(walletAddress.length - suffixLength);

    // Generate the truncated address with prefix, ellipsis, and suffix
    const truncatedAddress = `${prefix}...${suffix}`;

    return truncatedAddress;
}

// Returns color based on given string
export function stringToColor(str: string): string {
    let hash = 0;
    str.split('').forEach(char => { hash = char.charCodeAt(0) + ((hash << 5) - hash) });
    let colour = '#';
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff;
        colour += value.toString(16).padStart(2, '0');
    }

    return colour;
}