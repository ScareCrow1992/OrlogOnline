

export default class LocalSocket {
    constructor(){
        this.othersocket
        this.partnerbird

    }

    // json으로 변환되어있음
    send(data){
        this.othersocket.onmessage(data)
    }

    onmessage(data){
        this.partnerbird.Transport(data)
    }
}