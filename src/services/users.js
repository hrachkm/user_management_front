import { Requests } from './requests';

export class Users extends Requests {

    url = `${this.base_url}users`;

    async getUserList(){
        const response = await super.getDeleteSendRequest(
            'GET',
            this.url
        );
        return response;
    }

    async addUser(payload){
        const response = await super.postPutSendRequest(
            payload,
            'POST',
            this.url
        );
        return response;
    }

    async updateUser(userId, payload){

        const requestUrl = `${this.url}/${userId}`;
        const response = await super.postPutSendRequest(
            payload,
            'PUT',
            requestUrl
        );
        return response;
    }

    async updateUserActivation(userId, payload){
        const requestUrl = `${this.url}/activation/${userId}`;
        const response = await super.postPutSendRequest(
            payload,
            'PUT',
            requestUrl
        );
        return response;
    }

    async removeUser(userId){
        const requestUrl = `${this.url}/${userId}`;
        const response = await super.getDeleteSendRequest(
            'DELETE',
            requestUrl
        );
        return response;
    }

}