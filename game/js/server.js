var io = require('socket.io').listen(8080);

/*------------------------------
 * Player class
 *------------------------------*/
function Player(name, x, y, rotation) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.rotation = rotation;
    this.missiles = [];
}

var players = {};

io.sockets.on('connection', function (socket) {
    //hash of players active

    socket.on('connect', function(data) {
        players[data.name] = new Player(data.name, data.x, data.y, data.rotation);
        console.log("connected: " + data.name);
    });


    socket.on('player.move', function (data) {
        var p = players[data.name];
        p.x = data.x;
        p.y = data.y;
        p.rotation = data.rotation;
//        console.log("x: " + p.x, "y: " + p.y, "r: " + p.rotation);
    });

    socket.on('player.hit', function (data) {
        console.log(data.name + ' has been hit.');
    });

    socket.on('missile.update', function (data) {
        players[data.name].missiles = data.missiles;
    });

    /*------------------------------
     * Fetch players
     *------------------------------*/
    socket.on('fetch.players', function(data) {
        console.log("asking");
        socket.emit('fetch.players', players);
    });

});