export const MAX_RESPONSE_LENGTH = 24000; // MCP limit is 25000, leave buffer
export function formatResponse(data) {
    const responseText = JSON.stringify(data, null, 2);
    if (responseText.length <= MAX_RESPONSE_LENGTH) {
        return responseText;
    }
    // Response too large, return truncated version
    const truncatedData = {
        warning: "Response truncated due to size limits",
        original_length: responseText.length,
        truncated: true,
        data: JSON.stringify(data).substring(0, MAX_RESPONSE_LENGTH - 500) + "... (truncated)"
    };
    return JSON.stringify(truncatedData, null, 2);
}
export function createSummaryResponse(items, itemType, limit, suggestionText, summaryMapper) {
    const limitedItems = items.slice(0, limit);
    const summary = {
        [`total_${itemType}`]: items.length,
        showing: limitedItems.length,
        message: `Response too large. Showing first ${limitedItems.length} of ${items.length} ${itemType}. ${suggestionText}`,
        [itemType]: limitedItems.map(summaryMapper)
    };
    return JSON.stringify(summary, null, 2);
}
//# sourceMappingURL=response-formatter.js.map