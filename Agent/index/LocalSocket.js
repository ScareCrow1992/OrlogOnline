

export default class LocalSocket {
    constructor(){
        this.othersocket
        this.partnerbird
        this.index

    }

    // json으로 변환되어있음
    send(data){
        // console.log(data)
        // console.log("===========================")
        this.othersocket.onmessage(data)
    }

    onmessage(data){
        // console.log(data)
        // console.log("%%%%%%%%%%%%%%%%%%%%%%%")
        this.partnerbird.Transport(data, this.index)
    }
}