export class Requests{
    base_url = 'http://localhost:3000/';

    async getDeleteSendRequest(method, url){
        try {
            const response = await fetch(url, {
                method: method
            })
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    async postPutSendRequest(data, method, url) {
        try {
            const response = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: method,
                body: JSON.stringify(data),
            });
            return await response.json();
        } catch (error) {
            console.error(error);
            return;
        }
    }
}