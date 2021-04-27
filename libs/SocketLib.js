let $this;
let refreshIntervalIds = [];

module.exports = class SocketLib {

    constructor() {
        console.log('inside socketLib');
        $this = this;
    }

    connection( socket ) {

        console.log('inside socket connect');
        $this.socket = socket;
        socket.on( 'disconnect', $this.disconnect );
        socket.on( 'message', $this.message );
        // $this.autoSend( socket );
        socket.on( 'tick', $this.tick );
    }

    disconnect( socket ) {
        console.log('inside disconnect');
    }

    message( socket ) {
        console.log('inside message');
        console.log('message socket details', socket);
    }

    tick( in_data ) {
        console.log('inside tick');
        $this.socket.emit( 'tick', in_data );
    }

    autoSend( socket ) {
        refreshIntervalIds.push( setInterval( () => {
            socket.emit('seconds');
        },1000));
    }
}