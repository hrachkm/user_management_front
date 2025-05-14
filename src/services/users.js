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

}