/**
 * Created by larry on 2016/12/30.
 * display marks move in board
 */
(function(WGo){
    "use strict";
    /*
     *  add solid triangle for show
     */
    WGo.Board.drawHandlers['TRS'] =  {
        stone: {
            draw: function(args, board) {
                var xr = board.getX(args.x),
                    yr = board.getY(args.y),
                    sr = board.stoneRadius;

                //this.strokeStyle ="red";// args.c || get_markup_color(board, args.x, args.y);
                //this.lineWidth = args.lineWidth || board.lineWidth || 1;
                this.fillStyle="#FF0000";
                this.beginPath();
                this.moveTo(xr-0.5, yr-0.5-Math.round(sr/2));
                this.lineTo(Math.round(xr-sr/2)-0.5, Math.round(yr+sr/3)+0.5);
                this.lineTo(Math.round(xr+sr/2)+0.5, Math.round(yr+sr/3)+0.5);
                this.closePath();
                this.fill();
                //this.stroke();
            }
        }
    }
    var Marker={};
    var defConfig={
        markerStyle:'TRS',//display style
        markerNum:1,// Set to specify how many items should be displayed at once. from back to front
        lastMoveColor:'red'
    }

    Marker=function(player,board,config){
        this.player = player;
        this.board = board;
        this.config = config || {};
        for (var key in defConfig) if (this.config[key] === undefined && defConfig[key] !== undefined) this.config[key] = defConfig[key];
        this.init();
    }

    Marker.prototype={
        init:function(){
            this._bindEvent();
        },
        clearDefaultSytle:function(){
            var node=this.player.kifuReader.node;
            if(node.move){
                this.board.removeObject({
                    x:node.move.x,
                    y:node.move.y,
                    type:'CR'
                })
            }
        },
        _bindEvent: function () {
            var self = this;
            this.player.addEventListener('update', function (e) {
                self.showMarker(e);
            });
        },
        clearMarker: function () {
            if(!this.lbs)return;
            for (var i = 0; i < this.lbs.length; i++) {
                this.board.removeObject(this.lbs[i])
            }
        },
        switchMaker: function (config) {
            this.clearMarker();
            for (var key in config) this.config[key] = config[key];
            this.showMarker({
                position: this.player.kifuReader.game.getPosition()
            })
        },
        showMarker: function (e) {
            this.clearMarker();
            this.lbs = [];
            var poss = new WGo.Position(this.player.kifu.size);
            var clonePos = e.position.clone();
            var num = this.player.kifuReader.path.m;
            var node = this.player.kifuReader.node;
            var step = 0;
            while (node.move && (step < this.config.markerNum || this.config.markerNum == 0)) {
                var x = node.move.x;
                var y = node.move.y;
                if (clonePos.get(x, y) && poss.get(x, y) == 0) {
                    poss.set(x, y, num);
                    if(step==0){
                        this.lbs.push({
                            x: x,
                            y: y,
                            text: num,
                            c: this.config.lastMoveColor,
                            type: this.config.markerStyle
                        })
                    }else{
                        this.lbs.push({
                            x: x,
                            y: y,
                            text: num,
                            type: this.config.markerStyle
                        })
                    }

                }
                num--;
                step++;
                node = node.parent;
            }
            for (var i = 0; i < this.lbs.length; i++) {
                this.board.addObject(this.lbs[i])
            }
        },
    }
    WGo.Player.Marker=Marker
    if(WGo.BasicPlayer && WGo.BasicPlayer.component.Control) {
        WGo.BasicPlayer.component.Control.menu.push({
            constructor: WGo.BasicPlayer.control.MenuItem,
            args: {
                name: "switchmarker",
                togglable: true,
                click: function(player) {
                    this._marker=this._marker||new WGo.Player.Marker(player,player.board);
                    if(!this._isFirst){
                        player.config.markLastMove=false;
                        this._marker.clearDefaultSytle();
                        this._marker.switchMaker();
                        this._isFirst=true;
                    }else if(this._marker.config.markerStyle=='LB'&&this._marker.config.markerNum!=0){
                        this._marker.switchMaker({
                            'markerNum':0
                        });
                    }else if(this._marker.config.markerStyle=='LB'&&this._marker.config.markerNum==0) {
                        this._marker.switchMaker({
                            'markerStyle': 'TRS',
                            'markerNum': 1
                        });
                    }else{
                        this._marker.switchMaker({
                            'markerStyle': 'LB',
                            'markerNum': 5
                        });
                    }
                },
            }
        });
    }

    WGo.i18n.en["switchmarker"] = "Switch Marker";
})(WGo)