export default class Online {
    constructor()
    {
        this.active = true

        window.location.hash.split("&").forEach(hash =>{
            if(hash === "#online"){
                this.active = true
            }
        })


        if(!this.active){
            return;
        }
        

    }

    // Connect_SocketServer(url){
    //     this.webSocket = new WebSocket(url);
    //     return this.webSocket
    // }

}