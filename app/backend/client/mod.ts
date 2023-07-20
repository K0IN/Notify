export async function notify(notifyApiUrl: string, message: {
    title: string,
    message: string,
    iconUrl?: string,
    tags?: string[],
}, serverKey: string | undefined = undefined) {
    const headers: { [key: string]: string } = {
        'Content-Type': 'application/json',
    }

    if (serverKey) {
        headers['Authorization'] = `Bearer ${serverKey}`;
    }

    const response = await fetch(notifyApiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(message),
    });

    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error.message);
    }

    return response;
}