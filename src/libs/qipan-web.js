(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.QipanAPI = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getQipanVersion() {
    return "v1.5.27";
}
exports.getQipanVersion = getQipanVersion;
var VertexT;
(function (VertexT) {
    VertexT[VertexT["BLACK"] = 1] = "BLACK";
    VertexT[VertexT["WHITE"] = 2] = "WHITE";
    VertexT[VertexT["EMPTY"] = 3] = "EMPTY";
})(VertexT = exports.VertexT || (exports.VertexT = {}));
var sgfCoor = "abcdefghijklmnopqrstuvwxyz".split("");
exports.MAX_SIZE = 26;
function getSgfCoor(size) {
    return sgfCoor.slice(0, size);
}
exports.getSgfCoor = getSgfCoor;
function coorPt2Sgf(pt, size) {
    if (pt === "PASS") {
        return "tt";
    }
    var sgfPt = coorIdx2SgfPt(coorPt2Idx(pt, size), size);
    if (sgfPt) {
        return "" + sgfPt.xsgf + sgfPt.ysgf;
    }
    else {
        return "tt";
    }
}
exports.coorPt2Sgf = coorPt2Sgf;
function coorIdx2SgfPt(idx, size) {
    if (idx >= size * size) {
        console.error("coorIdx2SgfPt " + idx + " " + size);
        return;
    }
    var x = idx % size;
    var y = Math.floor(idx / size);
    return {
        x: x,
        y: y,
        xsgf: sgfCoor[x],
        ysgf: sgfCoor[y],
    };
}
exports.coorIdx2SgfPt = coorIdx2SgfPt;
function coorPt2Idx(pt, size) {
    if (pt.idx) {
        return pt.idx;
    }
    else {
        pt.idx = pt.y * size + pt.x;
        return pt.idx;
    }
}
exports.coorPt2Idx = coorPt2Idx;
var RotateDeg;
(function (RotateDeg) {
    RotateDeg[RotateDeg["deg0"] = 1] = "deg0";
    RotateDeg[RotateDeg["deg90"] = 2] = "deg90";
    RotateDeg[RotateDeg["deg180"] = 3] = "deg180";
    RotateDeg[RotateDeg["deg270"] = 4] = "deg270";
})(RotateDeg = exports.RotateDeg || (exports.RotateDeg = {}));
function buildDefaultConfig() {
    console.log('zjk ', VertexT.BLACK);
    return {
        isRemoteControlled: false,
        whoPlayFirst: VertexT.BLACK,
        size: 19,
        width: 200, height: 200,
        rotation: RotateDeg.deg0,
        scale: 1.0,
        x1: 0, x2: 18,
        y1: 0, y2: 18,
    };
}
exports.buildDefaultConfig = buildDefaultConfig;
var CtxType;
(function (CtxType) {
    CtxType[CtxType["WEB"] = 1] = "WEB";
    CtxType[CtxType["WX"] = 2] = "WX";
})(CtxType = exports.CtxType || (exports.CtxType = {}));
function getMyRect(c) {
    return {
        width: c.width,
        height: c.height,
        scale: c.scale,
    };
}
exports.getMyRect = getMyRect;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Debug = (function () {
    function Debug() {
        this.dumped = {};
    }
    Debug.prototype.dump = function (name, v) {
        this.dumped[name] = v;
    };
    return Debug;
}());
exports.Debug = Debug;
exports.debug = new Debug();

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
var config_1 = require("./config");
var timu_1 = require("./timu");
var qipan_1 = require("./qipan");
var rule_1 = require("./rule");
var pen_1 = require("./pen");
var wqipan_1 = require("./wqipan");
function buildInitGameData(g) {
    if (!(g && g.content instanceof Array && g.content.length === 2)) {
        console.error('buildInitGameData prepos');
        g.content = [[], []];
    }
    if (g.blackfirst === void 0) {
        console.error('qipu no blackfirst');
        g.blackfirst = true;
    }
    if (!(g.pos instanceof Array)) {
        console.error('buildInitGameData pos');
        g.pos = [];
    }
    var size = g.lu;
    return {
        size: size,
        ab: g.content[0],
        aw: g.content[1],
        moves: g.pos,
        whoFirst: (g.blackfirst) ? config_1.VertexT.BLACK : config_1.VertexT.WHITE
    };
}
exports.buildInitGameData = buildInitGameData;
function processMoves(wqp, rawMoves) {
    var size = wqp.config.size;
    var moves = util_1.parseSgfPtLst(rawMoves, size);
    for (var i = 0; i < moves.length; ++i) {
        var move = moves[i];
        wqp.placePtNode(move);
        wqp.switchSide();
    }
    wqp.qipan.doRender();
}
exports.processMoves = processMoves;
function placeNonPtNodeList(wqp, rawpts, color) {
    var size = wqp.config.size;
    var pts = util_1.parseSgfPtLst(rawpts, size);
    wqp.qipan.state.whoPlace = color;
    for (var _i = 0, pts_1 = pts; _i < pts_1.length; _i++) {
        var pt = pts_1[_i];
        if (pt !== "PASS") {
            wqp.placeNonPtNode(pt);
        }
    }
}
exports.placeNonPtNodeList = placeNonPtNodeList;
function test123(qdata) {
    if (qdata.ru === 1 || qdata.ru === 2) {
        var key = atob("MTAx");
        var t = qdata.ru + 1;
        {
            var k = (key + t) + t;
            var attrs = ["Y29udGVudA==", "b2tfYW5zd2Vycw==", "Y2hhbmdlX2Fuc3dlcnM=", "ZmFpbF9hbnN3ZXJz"];
            for (var _i = 0, attrs_1 = attrs; _i < attrs_1.length; _i++) {
                var attr = attrs_1[_i];
                var x = atob(attr);
                if ((typeof qdata[x]) === "string") {
                    qdata[x] = JSON.parse(util_1.test202(qdata[x], k + t));
                }
            }
        }
    }
}
exports.test123 = test123;
var Game = (function () {
    function Game(ctx, config, gdata) {
        this.gdata = gdata;
        this.wqp = new wqipan_1.WeiQipan(ctx, config, gdata.whoFirst);
        processMoves(this.wqp, gdata.moves);
        var game = this;
        game.wqp.timu = void 0;
    }
    Game.prototype.startGameShixia = function (cb) {
        if (!!!cb) {
            throw new Error("startGameShixia no cb");
        }
        if (this.wqp.isInShixia()) {
            console.error('game begin Shixia');
            return;
        }
        this.wqp.beginShixia(cb);
    };
    Game.prototype.endGameShixia = function () {
        this.wqp.endShixia();
    };
    Game.prototype.getStepCount = function () {
        return this.wqp.qipan.state.movesHashes.length;
    };
    Game.prototype.getCurrStepCount = function () {
        return this.wqp.qipan.state.depth;
    };
    Game.prototype.prev = function (k) {
        this.wqp.prevThenRender(k);
    };
    Game.prototype.goto = function (k) {
        this.wqp.gotoThenRender(k);
    };
    Game.prototype.next = function (k) {
        this.wqp.nextThenRender(k);
    };
    Game.prototype.setPlayMode = function (who, callback) {
        if (this.wqp.timu && this.wqp.timu.mode === "PLAY") {
            console.error("timu play mode setPlayMode");
            return;
        }
        var s = this.wqp.qipan.state;
        s.whoPlay = who;
        s.whoPlace = void 0;
        if (s.depth === 0) {
            s.config.whoPlayFirst = who;
        }
        this.wqp.setPlaceOrPlay(callback, wqipan_1.ClickMode.Play);
    };
    Game.prototype.setPlaceMode = function (who, callback) {
        if (this.wqp.timu && this.wqp.timu.mode === "PLAY") {
            console.error("timu play mode setPlaceMode");
            return;
        }
        this.wqp.qipan.state.whoPlace = who;
        this.wqp.setPlaceOrPlay(callback, wqipan_1.ClickMode.Place);
    };
    Game.prototype.playMove = function (pt) {
        if (this.wqp.hasPt(pt)) {
            return;
        }
        if (this.wqp.config.audioOn) {
            this.wqp.qipan.prepareAudio();
        }
        this.wqp.playMove(pt);
        this.wqp.switchSide();
    };
    Game.prototype.playNonShixiaMove = function (pt) {
        console.log(pt);
    };
    Game.prototype.playNonShixiaPass = function () {
    };
    Game.prototype.setPtsText = function (rawpts, textLst) {
        var pts = util_1.parseSgfPtLst(rawpts, this.getSize());
        var d = this.wqp.qipan.state.node.ruleData;
        if (d === void 0) {
            return;
        }
        var si = d.symbolInfo;
        si.winratePts = [];
        for (var i = 0; i < pts.length; ++i) {
            var pt = pts[i];
            var text = textLst[i];
            if (pt !== 'PASS') {
                si.winratePts.push({
                    pt: pt, text: text
                });
            }
        }
        this.wqp.qipan.doRender();
    };
    Game.prototype.setConfirm = function (enable) {
        this.wqp.needConfirm = enable;
        this.wqp.qipan.state.candidate = void 0;
        this.wqp.qipan.doRender();
    };
    Game.prototype.adjust = function (direction) {
        if (!!!this.wqp.needConfirm) {
            console.error("adjust not confirm mode");
            return "ERROR";
        }
        var cand = this.wqp.qipan.state.candidate;
        if (!!!cand) {
            console.error("adjust no candidate");
            return "ERROR";
        }
        var pt = cand.pt;
        var config = this.wqp.qipan.state.config;
        if (direction === "UP") {
            if (pt.y === config.y1) {
                return "FAILED";
            }
            else {
                pt.y--;
            }
        }
        else if (direction === "DOWN") {
            if (pt.y === config.y2) {
                return "FAILED";
            }
            else {
                pt.y++;
            }
        }
        else if (direction === "LEFT") {
            if (pt.x === config.x1) {
                return "FAILED";
            }
            else {
                pt.x--;
            }
        }
        else if (direction === "RIGHT") {
            if (pt.x === config.x2) {
                return "FAILED";
            }
            else {
                pt.x++;
            }
        }
        pt.idx = void 0;
        this.wqp.qipan.doRender();
        return "OK";
    };
    Game.prototype.confirm = function () {
        if (!!!this.wqp.needConfirm) {
            console.error("confirm not confirm mode");
            return;
        }
        var cand = this.wqp.qipan.state.candidate;
        if (cand) {
            wqipan_1.userPlayPt(cand.pt, this.wqp);
        }
        else {
            console.error("confirm no candidate");
        }
        this.wqp.qipan.state.candidate = void 0;
    };
    Game.prototype.placePt = function (pt, who) {
        var oldWho = this.wqp.qipan.state.whoPlace;
        this.wqp.qipan.state.whoPlace = who;
        this.wqp.placeNonPtNode(pt);
        this.wqp.qipan.state.whoPlace = oldWho;
    };
    Game.prototype.placeSymbol = function (pt) {
        this.wqp.placeSymbol(pt);
    };
    Game.prototype.setSizeAndClear = function (size) {
        var lu = (size > 19) ? 19 :
            ((size < 2) ? 2 : Math.floor(size));
        this.loadQipu({
            lu: lu,
            content: [[], []],
            pos: [],
            blackfirst: true,
        });
    };
    Game.prototype.setSizeAndClearWithPlay = function (size, playCallback) {
        this.setSizeAndClear(size);
        this.wqp.setPlaceOrPlay(playCallback, wqipan_1.ClickMode.Play);
    };
    Game.prototype.clockwiseRotate = function () {
        this.wqp.qipan.nextRotate(1);
    };
    Game.prototype.counterClockwiseRotate = function () {
        this.wqp.qipan.nextRotate(3);
    };
    Game.prototype.loadQipu = function (qipu) {
        var gdata = buildInitGameData(qipu);
        var config = this.wqp.qipan.state.config;
        var showCoor = this.wqp.qipan.state.config.showCoor;
        config.size = gdata.size;
        config.x1 = 0;
        config.x2 = gdata.size - 1;
        config.y1 = 0;
        config.y2 = gdata.size - 1;
        config.ab = util_1.parseSgfPtLst(gdata.ab, gdata.size);
        config.aw = util_1.parseSgfPtLst(gdata.aw, gdata.size);
        config.rotation = config_1.RotateDeg.deg0;
        var ctx = this.wqp.qipan.render.ctx;
        this.wqp = new wqipan_1.WeiQipan(ctx, config, config_1.VertexT.BLACK);
        this.wqp.qipan.recomputeQipanRect();
        this.wqp.qipan.showCoor(showCoor);
        this.wqp.setWhoPlay(qipu.blackfirst);
        processMoves(this.wqp, gdata.moves);
        if (qipu.step && (qipu.step > 0)) {
            this.prev(gdata.moves.length);
            this.next(qipu.step);
        }
        if (this.wqp.timu) {
            this.wqp.timu.setMode("INVAL");
            this.wqp.timu = void 0;
        }
    };
    Game.prototype.loadTimu = function (qdata) {
        var config = this.wqp.qipan.state.config;
        test123(qdata);
        var newConfig = qipan_1.buildConfigFromQData(config.width, config.height, config.scale, config.isRemoteControlled, qdata);
        if (newConfig === void 0) {
            console.error("loadTimu return void");
            return;
        }
        newConfig.rotation = config.rotation;
        newConfig.audioOn = config.audioOn;
        var timuConfig = timu_1.buildTimuConfig(newConfig, qdata);
        if (timuConfig === void 0) {
            console.error("loadTimu return void");
            return;
        }
        var newWqp = new wqipan_1.WeiQipan(this.wqp.qipan.render.ctx, timuConfig, timuConfig.whoPlayFirst);
        var t = new timu_1.Timu(newWqp, timuConfig);
        t.setWhoFirst(timuConfig.whoPlayFirst);
        t.setMode("INVAL");
        t.wqp.qipan.recomputeQipanRect();
        t.wqp.qipan.showCoor(config.showCoor);
        this.wqp = newWqp;
        this.wqp.timu = t;
        return t;
    };
    Game.prototype.startPlaceSymbolMode = function (type, cb) {
        this.disablePenMode();
        this.wqp.startPlaceSymbolMode(type);
        this.wqp.clickCb = cb;
    };
    Game.prototype.enablePenMode = function (color, cb) {
        if (color === void 0) { color = "#c64000"; }
        var penMode = this.wqp.qipan.state.penMode;
        penMode.drawing = false;
        penMode.mode = pen_1.PenDrawMode.DRAW;
        penMode.color = color;
        penMode.cb = cb;
        penMode.isRemoteControlled = this.wqp.qipan.state.config.isRemoteControlled;
    };
    Game.prototype.syncPenDrawing = function (data) {
        var qipan = this.wqp.qipan;
        var penMode = qipan.state.penMode;
        penMode.syncPenDrawing(qipan.render.ctx, qipan.state.config, data);
    };
    Game.prototype.clearPenDrawing = function () {
        var penMode = this.wqp.qipan.state.penMode;
        penMode.pts = [];
        this.wqp.qipan.doRender();
    };
    Game.prototype.disablePenMode = function () {
        var penMode = this.wqp.qipan.state.penMode;
        penMode.mode = pen_1.PenDrawMode.DISABLE;
    };
    Game.prototype.isInPenMode = function () {
        var penMode = this.wqp.qipan.state.penMode;
        return penMode.mode === pen_1.PenDrawMode.DRAW;
    };
    Game.prototype.enableShapeMode = function () {
        var penMode = this.wqp.qipan.state.penMode;
        penMode.drawing = false;
        penMode.mode = pen_1.PenDrawMode.SHAPE;
    };
    Game.prototype.disableShapeMode = function () {
        this.disablePenMode();
    };
    Game.prototype.setEstimate101 = function (d) {
        if ((d.bs instanceof Array) && (d.ws instanceof Array)) {
            this.wqp.setEstimate(d.bs, d.ws);
            this.wqp.qipan.doRender();
        }
        else {
            console.error("setEstimate101 ", d);
        }
    };
    Game.prototype.clearEstimate = function () {
        var s = this.wqp.qipan.state;
        var rs = s.ruleState;
        rs.hasEstimate = false;
        rs.whiteEstimate = [];
        rs.blackEstimate = [];
        this.wqp.qipan.doRender();
    };
    Game.prototype.hasEstimate = function () {
        return this.wqp.hasEstimate();
    };
    Game.prototype.clearSymbol = function () {
        this.wqp.qipan.clearSymbol();
    };
    Game.prototype.getSize = function () {
        return this.wqp.qipan.state.config.size;
    };
    Game.prototype.getPtSeq = function () {
        var size = this.getSize();
        var seq = this.wqp.getPtSeq();
        var sgfSeq = seq.map(function (pt) { return config_1.coorPt2Sgf(pt, size); });
        return sgfSeq;
    };
    Game.prototype.setShowHands = function (k) {
        var s = this.wqp.qipan.state;
        s.showHandCount = k;
        rule_1.updateAnnoCache(s);
        this.wqp.qipan.doRender();
    };
    Game.prototype.getShowHands = function () {
        var s = this.wqp.qipan.state;
        return s.showHandCount;
    };
    Game.prototype.getEatCounts = function () {
        var s = this.wqp.qipan.state;
        return s.eatCounts;
    };
    Game.prototype.playPass = function () {
        if (this.wqp.clickMode === wqipan_1.ClickMode.Play) {
            this.wqp.placePtNode("PASS");
            this.wqp.switchSide();
        }
        else {
            console.error("playPass: qipan not in PlAY mode");
        }
    };
    Game.prototype.showCoor = function (show) {
        if (show === void 0) { show = true; }
        this.wqp.qipan.showCoor(show);
    };
    Game.prototype.setAudio = function (onoff) {
        this.wqp.qipan.setAudio(onoff);
    };
    Game.prototype.isShowCoor = function () {
        return this.wqp.qipan.state.config.showCoor;
    };
    Game.prototype.setRemoteControlled = function (onoff) {
        var penMode = this.wqp.qipan.state.penMode;
        penMode.setRemoteControlled(onoff);
        this.wqp.qipan.state.config.isRemoteControlled = onoff;
    };
    Game.prototype.getRemoteControlled = function () {
        return this.wqp.qipan.state.config.isRemoteControlled;
    };
    Game.prototype.doRender = function () {
        this.wqp.qipan.doRender();
    };
    Game.prototype.setStudentVoteMode = function (cb) {
        this.wqp.setVoteMode('stu', cb);
    };
    Game.prototype.setTeacherVoteMode = function () {
        this.wqp.setVoteMode('tea');
    };
    Game.prototype.updateTeacherVoteMode = function (gtpPts) {
        this.wqp.updateTeacherVoteMode(gtpPts);
    };
    Game.prototype.exitVoteMode = function () {
        this.wqp.exitVoteMode();
    };
    Game.prototype.setTeacherVoteSelection = function (gtpPt) {
        this.wqp.setTeacherVoteSelection(gtpPt);
    };
    return Game;
}());
exports.Game = Game;

},{"./config":1,"./pen":4,"./qipan":5,"./rule":7,"./timu":9,"./util":10,"./wqipan":12}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
function getUnrotate(rotation, p) {
    var unrotate = config_1.RotateDeg.deg0;
    if (rotation === config_1.RotateDeg.deg90) {
        unrotate = config_1.RotateDeg.deg270;
    }
    else if (rotation === config_1.RotateDeg.deg180) {
        unrotate = config_1.RotateDeg.deg180;
    }
    else if (rotation === config_1.RotateDeg.deg270) {
        unrotate = config_1.RotateDeg.deg90;
    }
    return getRotate(unrotate, p);
}
function getRotate(rotation, p) {
    var x = p.x;
    var y = p.y;
    var maxAxis = 1.0;
    if (rotation === config_1.RotateDeg.deg90) {
        x = maxAxis - p.y;
        y = p.x;
    }
    else if (rotation === config_1.RotateDeg.deg180) {
        x = maxAxis - p.x;
        y = maxAxis - p.y;
    }
    else if (rotation === config_1.RotateDeg.deg270) {
        x = p.y;
        y = maxAxis - p.x;
    }
    return {
        x: x, y: y, newPathColor: p.newPathColor
    };
}
var PenDrawMode;
(function (PenDrawMode) {
    PenDrawMode[PenDrawMode["DISABLE"] = 1] = "DISABLE";
    PenDrawMode[PenDrawMode["DRAW"] = 2] = "DRAW";
    PenDrawMode[PenDrawMode["SHAPE"] = 3] = "SHAPE";
})(PenDrawMode = exports.PenDrawMode || (exports.PenDrawMode = {}));
function Point2CPoint(p) {
    var x = Math.floor(p.x * 10000) / 10000;
    var y = Math.floor(p.y * 10000) / 10000;
    return {
        x: x, y: y, c: p.newPathColor
    };
}
var PenMode = (function () {
    function PenMode() {
        this.mode = PenDrawMode.DISABLE;
        this.drawing = false;
        this.lastX = 0;
        this.lastY = 0;
        this.color = "#c64000";
        this.pts = [];
        this.ptsForCb = [];
        this.isCallingCb = false;
        this.isRemoteControlled = false;
    }
    PenMode.prototype.drawPoint = function (x, y, newLineColor, ctx) {
        if (newLineColor) {
            ctx.strokeStyle = newLineColor;
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(x, y);
        }
        else {
            ctx.lineTo(x, y);
            ctx.stroke();
        }
        this.lastX = x;
        this.lastY = y;
    };
    PenMode.prototype.mouseup = function () {
        this.drawing = false;
    };
    PenMode.prototype.mousemove = function (ctx, offsetX, offsetY, config) {
        if (this.isRemoteControlled) {
            return;
        }
        if (!this.drawing) {
            return;
        }
        var scale = config.scale;
        var x = offsetX * scale;
        var y = offsetY * scale;
        this.savePoint(x, y, config, void 0);
        var dx = this.lastX - x;
        var dy = this.lastY - y;
        if ((dx * dx + dy * dy) < 20) {
            return;
        }
        this.drawPoint(x, y, void 0, ctx);
    };
    PenMode.prototype.mousedown = function (ctx, offsetX, offsetY, config) {
        if (this.isRemoteControlled) {
            return;
        }
        this.drawing = true;
        var scale = config.scale;
        var x = offsetX * scale;
        var y = offsetY * scale;
        this.savePoint(x, y, config, this.color);
        this.drawPoint(x, y, this.color, ctx);
    };
    PenMode.prototype.publishPointToCallback = function (p) {
        var that = this;
        if (this.cb === void 0) {
            return;
        }
        var cp = Point2CPoint(p);
        this.ptsForCb.push(cp);
        if (!this.isCallingCb) {
            this.isCallingCb = true;
            setTimeout(function () {
                that.cb && that.cb(that.ptsForCb);
                that.ptsForCb = [];
                that.isCallingCb = false;
            }, 60);
        }
    };
    PenMode.prototype.savePoint = function (x, y, config, color) {
        var rect = config.qipanRect;
        if (!rect) {
            console.error("savePoint no rect");
            return;
        }
        var rp = {
            x: (x - rect.qipanX) / rect.qipanW,
            y: (y - rect.qipanY) / rect.qipanH,
            newPathColor: color,
        };
        var p = getUnrotate(config.rotation, rp);
        this.publishPointToCallback(p);
        this.pts.push(p);
    };
    PenMode.prototype.setRemoteControlled = function (onoff) {
        this.isRemoteControlled = onoff;
    };
    PenMode.prototype.syncPenDrawing = function (ctx, config, data) {
        if (this.mode !== PenDrawMode.DRAW) {
            console.error("syncPenDrawing mode", this.mode);
        }
        if (!config.qipanRect) {
            console.error("syncPenDrawing no qipanRect");
            return;
        }
        var qr = config.qipanRect;
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var cpoint = data_1[_i];
            var pointNoRot = {
                x: cpoint.x, y: cpoint.y, newPathColor: cpoint.c
            };
            var point = getRotate(config.rotation, pointNoRot);
            var x = point.x * qr.qipanW + qr.qipanX;
            var y = point.y * qr.qipanH + qr.qipanY;
            this.savePoint(x, y, config, point.newPathColor);
            this.drawPoint(x, y, point.newPathColor, ctx);
        }
    };
    PenMode.prototype.render = function (ctx, config) {
        if ((this.pts.length > 0) && (config.qipanRect)) {
            ctx.lineWidth = 6;
            var qr = config.qipanRect;
            var pt = getRotate(config.rotation, this.pts[0]);
            pt.newPathColor && (ctx.strokeStyle = pt.newPathColor);
            var lastX = pt.x * qr.qipanW + qr.qipanX;
            var lastY = pt.y * qr.qipanH + qr.qipanY;
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            for (var i = 1; i < this.pts.length; ++i) {
                var pt_1 = getRotate(config.rotation, this.pts[i]);
                var x = pt_1.x * qr.qipanW + qr.qipanX;
                var y = pt_1.y * qr.qipanH + qr.qipanY;
                if (pt_1.newPathColor) {
                    ctx.strokeStyle = pt_1.newPathColor;
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                }
                else {
                    ctx.lineTo(x, y);
                    ctx.stroke();
                }
            }
        }
    };
    return PenMode;
}());
exports.PenMode = PenMode;

},{"./config":1}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
var render_1 = require("./render");
var state_1 = require("./state");
var util_1 = require("./util");
var rule_1 = require("./rule");
var webapi_1 = require("./webapi");
var getSquareBox = function (x1, x2, y1, y2, size) {
    while (x2 - x1 > y2 - y1 && y1 > 0) {
        --y1;
    }
    while (x2 - x1 > y2 - y1 && y2 < size - 1) {
        ++y2;
    }
    while (x2 - x1 < y2 - y1 && x1 > 0) {
        --x1;
    }
    while (x2 - x1 < y2 - y1 && x2 < size - 1) {
        ++x2;
    }
    return {
        x1: x1, x2: x2,
        y1: y1, y2: y2,
    };
};
function buildConfigFromQData(width, height, scale, isRemoteControlled, d) {
    if (!(width && height)) {
        console.error('buildConfigFromQData ', 'w ', width, 'h ', height);
        return void 0;
    }
    if (!(d) ||
        !(d.content && d.content.length === 2) ||
        !(d.lu && d.lu >= 2)) {
        console.error('buildConfigFromQData ', d);
        return void 0;
    }
    var size = d.lu;
    var rawAb = d.content[0];
    var rawAw = d.content[1];
    var _a = util_1.parseSetupCoor(rawAb, rawAw, size), ab = _a.ab, aw = _a.aw;
    var box = getSquareBox(d.pos_x1, d.pos_x2, d.pos_y1, d.pos_y2, size);
    var whoPlayFirst = (d && d.blackfirst) ? config_1.VertexT.BLACK : config_1.VertexT.WHITE;
    return {
        isRemoteControlled: isRemoteControlled,
        whoPlayFirst: whoPlayFirst,
        size: size,
        width: width, height: height,
        rotation: config_1.RotateDeg.deg0,
        scale: scale,
        x1: box.x1, x2: box.x2,
        y1: box.y1, y2: box.y2,
        ab: ab, aw: aw,
    };
}
exports.buildConfigFromQData = buildConfigFromQData;
function getUnrotatedPt(rotation, size, pt) {
    var unrotate = config_1.RotateDeg.deg0;
    if (rotation === config_1.RotateDeg.deg90) {
        unrotate = config_1.RotateDeg.deg270;
    }
    else if (rotation === config_1.RotateDeg.deg180) {
        unrotate = config_1.RotateDeg.deg180;
    }
    else if (rotation === config_1.RotateDeg.deg270) {
        unrotate = config_1.RotateDeg.deg90;
    }
    return getRotatedPt(unrotate, size, pt);
}
exports.getUnrotatedPt = getUnrotatedPt;
function getRotatedPt(rotation, size, pt) {
    var x = pt.x;
    var y = pt.y;
    var maxAxis = size - 1;
    if (rotation === config_1.RotateDeg.deg90) {
        x = maxAxis - pt.y;
        y = pt.x;
    }
    else if (rotation === config_1.RotateDeg.deg180) {
        x = maxAxis - pt.x;
        y = maxAxis - pt.y;
    }
    else if (rotation === config_1.RotateDeg.deg270) {
        x = pt.y;
        y = maxAxis - pt.x;
    }
    var rpt = { x: x, y: y };
    var idx = config_1.coorPt2Idx(rpt, size);
    rpt.idx = idx;
    return rpt;
}
exports.getRotatedPt = getRotatedPt;
function getRotatedRange(rotation, size, x1, x2, y1, y2) {
    var maxAxis = size - 1;
    var rx1 = x1;
    var rx2 = x2;
    var ry1 = y1;
    var ry2 = y2;
    if (rotation === config_1.RotateDeg.deg90) {
        ry1 = x1;
        ry2 = x2;
        rx1 = maxAxis - y2;
        rx2 = maxAxis - y1;
    }
    else if (rotation === config_1.RotateDeg.deg180) {
        rx1 = maxAxis - x2;
        rx2 = maxAxis - x1;
        ry1 = maxAxis - y2;
        ry2 = maxAxis - y1;
    }
    else if (rotation === config_1.RotateDeg.deg270) {
        rx1 = y1;
        rx2 = y2;
        ry1 = maxAxis - x2;
        ry2 = maxAxis - x1;
    }
    return {
        rx1: rx1, rx2: rx2, ry1: ry1, ry2: ry2
    };
}
function computeFitQipanRect(canvasW, canvasH, rx1, rx2, ry1, ry2) {
    var computeSizeAndOffset = function (z0, n0, z1, n1) {
        var weight = 0.05;
        var sq0 = z0 / n0;
        var sq1 = z1 / n1;
        var w = (sq0 < sq1) ? z0 : (sq1 * n0 + z0 * weight) / (1 + weight);
        return {
            w: w,
            x: (z0 - w) / 2.0,
        };
    };
    var _a = computeSizeAndOffset(canvasW, rx2 - rx1 + 1, canvasH, ry2 - ry1 + 1), qipanW = _a.w, qipanX = _a.x;
    var _b = computeSizeAndOffset(canvasH, ry2 - ry1 + 1, canvasW, rx2 - rx1 + 1), qipanH = _b.w, qipanY = _b.x;
    return {
        qipanX: qipanX, qipanW: qipanW, qipanY: qipanY, qipanH: qipanH,
    };
}
function computeQipanRect(rect, size, rotation, x1, x2, y1, y2, showCoor) {
    var canvasW = rect.width;
    var canvasH = rect.height;
    var _a = getRotatedRange(rotation, size, x1, x2, y1, y2), rx1 = _a.rx1, rx2 = _a.rx2, ry1 = _a.ry1, ry2 = _a.ry2;
    var _b = (isFillCanvas()) ?
        { qipanX: 0, qipanW: canvasW, qipanY: 0, qipanH: canvasH } :
        computeFitQipanRect(canvasW, canvasH, rx1, rx2, ry1, ry2), qipanX = _b.qipanX, qipanW = _b.qipanW, qipanY = _b.qipanY, qipanH = _b.qipanH;
    var miniumDivide = ((!showCoor) && (size === 2)) ? 2.5 : 4;
    var borderDivide = miniumDivide + (((rx2 - rx1) > (ry2 - ry1)) ? (rx2 - rx1) : (ry2 - ry1));
    var paddingRatio = 0.5;
    var borderPadW = qipanW / borderDivide;
    var borderPadH = qipanH / borderDivide;
    var paddingW = borderPadW * paddingRatio;
    var paddingH = borderPadH * paddingRatio;
    var borderW = borderPadW - paddingW;
    var borderH = borderPadH - paddingH;
    var partialGridRatio = 4.0 / 7.0;
    var innerDW = 0;
    var gridsDW = 0;
    var gridNX = rx2 - rx1;
    innerDW += borderW;
    gridsDW += paddingW;
    if (rx1 <= 0) {
        if (showCoor) {
            innerDW += borderW;
        }
    }
    else {
        gridNX += partialGridRatio;
    }
    var innerX = qipanX + innerDW;
    var gridsX = innerX + gridsDW;
    innerDW += borderW;
    gridsDW += paddingW;
    if (rx2 >= size - 1) {
        if (showCoor) {
            innerDW += borderW;
        }
    }
    else {
        gridNX += partialGridRatio;
    }
    var innerW = qipanW - innerDW;
    var gridsW = innerW - gridsDW;
    var squareW = gridsW / gridNX;
    var gOrigX = (rx1 <= 0) ? gridsX : (gridsX + squareW * partialGridRatio);
    var innerDH = 0;
    var gridsDH = 0;
    innerDH += borderH;
    gridsDH += paddingH;
    var gridNY = ry2 - ry1;
    if (ry1 <= 0) {
        if (showCoor) {
            innerDH += borderH;
        }
    }
    else {
        gridNY += partialGridRatio;
    }
    var innerY = qipanY + innerDH;
    var gridsY = innerY + gridsDH;
    innerDH += borderH;
    gridsDH += paddingH;
    if (ry2 >= size - 1) {
        if (showCoor) {
            innerDH += borderH;
        }
    }
    else {
        gridNY += partialGridRatio;
    }
    var innerH = qipanH - innerDH;
    var gridsH = innerH - gridsDH;
    var squareH = gridsH / gridNY;
    var gOrigY = (ry1 <= 0) ? gridsY : (gridsY + squareH * partialGridRatio);
    return {
        scale: rect.scale,
        size: size,
        canvasW: canvasW, canvasH: canvasH,
        qipanW: qipanW, qipanH: qipanH,
        qipanX: qipanX, qipanY: qipanY,
        innerW: innerW, innerH: innerH,
        innerX: innerX, innerY: innerY,
        gridsW: gridsW, gridsH: gridsH,
        gridsX: gridsX, gridsY: gridsY,
        gOrigX: gOrigX, gOrigY: gOrigY,
        squareW: squareW, squareH: squareH,
        x1: x1, x2: x2, y1: y1, y2: y2,
        rx1: rx1, rx2: rx2, ry1: ry1, ry2: ry2,
    };
}
exports.computeQipanRect = computeQipanRect;
var AudioStateEnum;
(function (AudioStateEnum) {
    AudioStateEnum[AudioStateEnum["STATE_READY"] = 1] = "STATE_READY";
    AudioStateEnum[AudioStateEnum["STATE_PLAYING"] = 2] = "STATE_PLAYING";
    AudioStateEnum[AudioStateEnum["STATE_PLAYING2"] = 3] = "STATE_PLAYING2";
    AudioStateEnum[AudioStateEnum["STATE_DONE"] = 4] = "STATE_DONE";
})(AudioStateEnum || (AudioStateEnum = {}));
var AudioSoundEnum;
(function (AudioSoundEnum) {
    AudioSoundEnum[AudioSoundEnum["SOUND_NONE"] = 1] = "SOUND_NONE";
    AudioSoundEnum[AudioSoundEnum["SOUND_PLACE"] = 2] = "SOUND_PLACE";
    AudioSoundEnum[AudioSoundEnum["SOUND_PLACE_EAT_ONE"] = 3] = "SOUND_PLACE_EAT_ONE";
    AudioSoundEnum[AudioSoundEnum["SOUND_PLACE_EAT_MULTI"] = 4] = "SOUND_PLACE_EAT_MULTI";
})(AudioSoundEnum || (AudioSoundEnum = {}));
function getAudioCtx(ctxType, qipan) {
    var ctx = (ctxType == config_1.CtxType.WX) ? wx.createInnerAudioContext() : webapi_1.getWebAudioCtx();
    var onEnd = function () {
        if (!qipan.audio) {
            return;
        }
        var type = qipan.audio.soundType;
        if (type === AudioSoundEnum.SOUND_PLACE) {
            qipan.audio.state = AudioStateEnum.STATE_DONE;
        }
        else if (type === AudioSoundEnum.SOUND_PLACE_EAT_ONE ||
            type === AudioSoundEnum.SOUND_PLACE_EAT_MULTI) {
            if (qipan.audio.state === AudioStateEnum.STATE_PLAYING) {
                ctx.src = (type === AudioSoundEnum.SOUND_PLACE_EAT_ONE) ?
                    "/lib101weiqi/qipan/audio/eat1.mp3" : "/lib101weiqi/qipan/audio/eat2.mp3";
                ctx.play();
                qipan.audio.state = AudioStateEnum.STATE_PLAYING2;
            }
            else {
                qipan.audio.state = AudioStateEnum.STATE_DONE;
            }
        }
        else {
            console.error("Audio play error");
            return;
        }
    };
    ctx.onEnded(onEnd);
    return ctx;
}
var Qipan = (function () {
    function Qipan(ctx, configOptional, cb) {
        var config = (configOptional) ? configOptional : config_1.buildDefaultConfig();
        this.state = state_1.buildState(config);
        this.render = render_1.getRender(ctx, this);
        this.cb = cb;
        this.doRender();
    }
    Qipan.prototype.useTheme = function (name) {
        var qipan = this;
        if (name === 'wood') {
            exports.qipanNonPicTheme = allThemes['wood'];
            webapi_1.qipanWoodTheme.use = true;
            webapi_1.qipanWoodTheme.onLoad = function () {
                qipan.doRender();
            };
        }
        else {
            webapi_1.qipanWoodTheme.use = false;
        }
        var theme = allThemes[name];
        if (theme) {
            exports.qipanNonPicTheme = theme;
        }
    };
    Qipan.prototype.getTheme = function () {
        if (webapi_1.qipanWoodTheme.use) {
            return "wood";
        }
        return "default";
    };
    Qipan.prototype.prev = function () {
        state_1.prevState(this.state);
    };
    Qipan.prototype.next = function (d) {
        if (d) {
            state_1.nextState(this.state, d);
            return true;
        }
        else {
            if (this.state.depth < this.state.movesHashes.length) {
                state_1.nextStateWithoutDiff(this.state);
                return true;
            }
            else {
                return false;
            }
        }
    };
    Qipan.prototype.doRender = function () {
        this.render.triggerRender();
    };
    Qipan.prototype.reset = function () {
        state_1.resetToRoot(this.state);
        this.doRender();
    };
    Qipan.prototype.setPlayable = function (cb) {
        this.tryPlayAt = cb;
    };
    Qipan.prototype.onTap = function (x, y, button) {
        if (button === void 0) { button = 0; }
        var qp = this;
        if (qp.state.config.audioOn) {
            qp.prepareAudio();
        }
        if (qp.state.cursor.onQipan && qp.state.cursor.pt) {
            var maxAxis = qp.state.config.size - 1;
            var pt = qp.state.cursor.pt;
            if ((pt.x === 0 || pt.x === maxAxis) && (pt.y === 0 || pt.y === maxAxis)) {
                qp.state.showVersion += 1;
                if (qp.state.showVersion > 12) {
                    qp.doRender();
                }
            }
            else {
                qp.state.showVersion = 0;
            }
        }
        if (qp.customOnClick) {
            qp.customOnClick(x, y);
            return;
        }
        state_1.updateCursor(this.state, this.render, x, y);
        if (qp.state.cursor.onQipan && qp.state.cursor.pt && qp.tryPlayAt) {
            var cfg = qp.state.config;
            var pt = getUnrotatedPt(cfg.rotation, cfg.size, qp.state.cursor.pt);
            if (button === 0) {
                qp.tryPlayAt(pt);
            }
            else if (button === 2) {
                qp.tryPlayAt2 && qp.tryPlayAt2(pt);
            }
        }
    };
    Qipan.prototype.setAudioType = function (d) {
        var that = this;
        if (d.ruleData && d.ruleData.type === rule_1.NodeDataType.type1) {
            var weiqi = d.ruleData;
            var type = AudioSoundEnum.SOUND_PLACE;
            if (weiqi.eatNum === 0) {
                type = AudioSoundEnum.SOUND_PLACE;
            }
            else if (weiqi.eatNum === 1) {
                type = AudioSoundEnum.SOUND_PLACE_EAT_ONE;
            }
            else if (weiqi.eatNum > 1) {
                type = AudioSoundEnum.SOUND_PLACE_EAT_MULTI;
            }
            if (that.audio && that.audio.state === AudioStateEnum.STATE_READY) {
                that.audio.soundType = type;
            }
        }
    };
    Qipan.prototype.playAudio = function () {
        if (!this.state.config.audioOn || !this.audio) {
            return;
        }
        var type = this.audio.soundType;
        var ctx = this.audio.ctx;
        this.audio.state = AudioStateEnum.STATE_PLAYING;
        if (type === AudioSoundEnum.SOUND_PLACE ||
            type === AudioSoundEnum.SOUND_PLACE_EAT_ONE ||
            type === AudioSoundEnum.SOUND_PLACE_EAT_MULTI) {
            ctx.src = "/lib101weiqi/qipan/audio/firststone.mp3";
            ctx.play();
        }
    };
    Qipan.prototype.prepareAudio = function () {
        if (this.audio && this.audio.state === AudioStateEnum.STATE_DONE) {
            this.audio.state = AudioStateEnum.STATE_READY;
            this.audio.soundType = AudioSoundEnum.SOUND_NONE;
        }
        else {
            var ctxType = this.render.ctx.ctxType;
            if (ctxType) {
                this.audio = {
                    soundType: AudioSoundEnum.SOUND_NONE,
                    state: AudioStateEnum.STATE_READY,
                    ctx: getAudioCtx(ctxType, this),
                };
            }
        }
    };
    Qipan.prototype.showCoor = function (show) {
        if (show === void 0) { show = true; }
        var c = this.state.config;
        c.showCoor = show;
        c.qipanRect = void 0;
        c.qipanRect = render_1.getQipanRect(this.state);
        this.doRender();
    };
    Qipan.prototype.clearSymbol = function () {
        var data = this.state.node.ruleData;
        if (data === void 0) {
            return;
        }
        var si = data.symbolInfo;
        si.idx2sym = {};
        si.nonSeqSymbols = [];
        si.nonSeq = [];
        si.numSymbols = [];
        si.alaSymbols = [];
        this.doRender();
    };
    Qipan.prototype.setAudio = function (onoff) {
        if (onoff === void 0) { onoff = true; }
        this.state.config.audioOn = onoff;
    };
    Qipan.prototype.rotate = function (deg) {
        var c = this.state.config;
        c.rotation = deg;
        c.qipanRect = void 0;
        c.qipanRect = render_1.getQipanRect(this.state);
        this.doRender();
    };
    Qipan.prototype.nextRotate = function (k) {
        var curr = this.state.config.rotation;
        var i = 0;
        for (i = 0; i < 4; ++i) {
            if (curr === rotations[i]) {
                break;
            }
        }
        var idx = (i + k) % 4;
        this.rotate(rotations[idx]);
    };
    Qipan.prototype.recomputeQipanRect = function () {
        this.state.config.qipanRect = void 0;
        this.state.config.qipanRect = render_1.getQipanRect(this.state);
    };
    return Qipan;
}());
exports.Qipan = Qipan;
var rotations = [config_1.RotateDeg.deg0, config_1.RotateDeg.deg90, config_1.RotateDeg.deg180, config_1.RotateDeg.deg270];
var ktTheme = {
    outerBorder: "#fccb6a",
    qipan: "#fccb6a",
    symbolBg: "#fccb6a",
    line: "#7d5b38",
    fillCanvas: true,
    getLineWidth: function (radius, size) {
        var ds = (size + 4 <= 19) ? (size + 4) : size;
        var dr = radius * (ds / 19.0);
        return Math.floor(dr / 15.0 * 100) / 100.0;
    }
};
var pkTheme = {
    outerBorder: "#FFAC61",
    qipan: "#FD983E",
    line: "#9D5029",
};
var tiantiTheme = {
    outerBorder: "#d8af87",
    qipan: "#f1d6b3",
    line: "#c8ab88",
};
var woodTheme = {
    outerBorder: "#d5a55b",
    qipan: "#d5a55b",
    line: "#000000",
    getLineWidth: function () {
        return 1;
    }
};
var allThemes = {
    "kttheme": ktTheme,
    "pktheme": pkTheme,
    "tttheme": tiantiTheme,
    "wood": woodTheme,
};
exports.qipanNonPicTheme = woodTheme;
var PtStyle;
(function (PtStyle) {
    PtStyle[PtStyle["default"] = 1] = "default";
    PtStyle[PtStyle["img"] = 2] = "img";
})(PtStyle = exports.PtStyle || (exports.PtStyle = {}));
function buildAllPtStyles() {
    var black = {
        ptType: PtStyle.default,
        base: "#352D29",
        highlight: "#564D48",
    };
    var white = {
        ptType: PtStyle.default,
        base: "#FFF8ED",
        highlight: "#FFFFFF",
    };
    return {
        "defaultblackpt": black,
        "defaultwhitept": white,
    };
}
exports.allPtStyles = buildAllPtStyles();
var currentBlackStyle = "defaultblackpt";
var currentWhiteStyle = "defaultwhitept";
function setPtStyle(namekey, color) {
    if (namekey in exports.allPtStyles) {
        if (color === config_1.VertexT.BLACK) {
            currentBlackStyle = namekey;
        }
        else {
            currentWhiteStyle = namekey;
        }
        return true;
    }
    else {
        return false;
    }
}
exports.setPtStyle = setPtStyle;
function getPtStyle(color) {
    var key = (color === config_1.VertexT.BLACK) ? currentBlackStyle : currentWhiteStyle;
    var pt = exports.allPtStyles[key];
    if (pt) {
        return pt;
    }
    else {
        console.error("getPtStyle ", key);
        return exports.allPtStyles["defaultblackpt"];
    }
}
exports.getPtStyle = getPtStyle;
var BgStyle;
(function (BgStyle) {
    BgStyle[BgStyle["img"] = 1] = "img";
    BgStyle[BgStyle["draw"] = 2] = "draw";
})(BgStyle = exports.BgStyle || (exports.BgStyle = {}));
function buildAllBgStyles() {
    var ktbg = {
        bgType: BgStyle.draw,
        outerBorder: "#fccb6a",
        qipan: "#fccb6a",
        symbolBg: "#fccb6a",
    };
    var ttbg = {
        bgType: BgStyle.draw,
        outerBorder: "#d8af87",
        qipan: "#f1d6b3",
        symbolBg: "#f1d6b3",
    };
    var customBg = {
        bgType: BgStyle.draw,
        outerBorder: "#fccb6a",
        qipan: "#fccb6a",
        symbolBg: "#fccb6a",
    };
    return {
        "ktbg": ktbg,
        "ttbg": ttbg,
        "custombg": customBg,
    };
}
exports.allBgStyles = buildAllBgStyles();
var currentBgStyle = "ktbg";
function setBgStyle(namekey) {
    if (namekey in exports.allBgStyles) {
        currentBgStyle = namekey;
        return true;
    }
    return false;
}
exports.setBgStyle = setBgStyle;
function getBgStyle() {
    var bg = exports.allBgStyles[currentBgStyle];
    if (bg) {
        return bg;
    }
    else {
        console.error("getBgStyle " + currentBgStyle);
        return exports.allBgStyles["ktbg"];
    }
}
exports.getBgStyle = getBgStyle;
function isFillCanvas() {
    return true;
}

},{"./config":1,"./render":6,"./rule":7,"./state":8,"./util":10,"./webapi":11}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var state_1 = require("./state");
var qipan_1 = require("./qipan");
var config_1 = require("./config");
var timu_1 = require("./timu");
var rule_1 = require("./rule");
function defaultDrawPt(ctx, xc, yc, radius, baseStyle, highlightStyle) {
    ctx.beginPath();
    ctx.arc(xc, yc, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = baseStyle;
    ctx.fill();
    if (ctx.ctxType === config_1.CtxType.WEB) {
        ctx.beginPath();
        ctx.ellipse && ctx.ellipse(xc - radius / 2.2, yc - radius / 2.2, radius * 2.83 / 9.0, radius * 1.2 / 9.0, Math.PI * 0.75, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = highlightStyle;
        ctx.fill();
    }
}
function drawPt(ctx, color, anno, x, y, gridX, gridY, boardX, boardY, radius) {
    var ptStyle = qipan_1.getPtStyle(color);
    if (color === config_1.VertexT.BLACK || color === config_1.VertexT.WHITE) {
        var xc = boardX + x * gridX;
        var yc = boardY + y * gridY;
        if (ptStyle.ptType === qipan_1.PtStyle.default) {
            var style = ptStyle;
            defaultDrawPt(ctx, xc, yc, radius, style.base, style.highlight);
        }
        else if (ptStyle.ptType === qipan_1.PtStyle.img) {
            var style = ptStyle;
            ctx.drawImage(style.img, xc - radius, yc - radius, radius * 2, radius * 2);
        }
        if (anno !== '') {
            ctx.fillStyle = (color === config_1.VertexT.WHITE) ? "#564D48" : "#FFFFFF";
            var fontsize = radius;
            var fontstyle = 'bold ' + Math.floor(fontsize) + 'px Arial, "Courier New"';
            ctx.font = fontstyle;
            ctx.fillText(anno, xc, yc);
        }
    }
}
function getXYFromPt(pt, rect) {
    var x = rect.gOrigX + (pt.x - rect.rx1) * rect.squareW;
    var y = rect.gOrigY + (pt.y - rect.ry1) * rect.squareH;
    return { x: x, y: y };
}
function getSymbolBg() {
    var bg = qipan_1.getBgStyle();
    if (bg.bgType === qipan_1.BgStyle.draw) {
        var style = bg;
        return style.symbolBg;
    }
    return void 0;
}
function drawSymbolBg(ctx, pt, rect, radius) {
    var style = getSymbolBg();
    if (style === void 0) {
        return;
    }
    ctx.fillStyle = style;
    var size = radius / 1.1;
    var _a = getXYFromPt(pt, rect), x = _a.x, y = _a.y;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
}
function drawTriangles(ctx, pt, rect, radius, boardColor, alpha) {
    if (alpha === void 0) { alpha = 1.0; }
    var black = "rgba(53, 45, 41, " + alpha + ")";
    var white = "rgba(255, 248, 237, " + alpha + ")";
    var empty = "rgba(198, 64, 0, " + alpha + ")";
    var style = (boardColor === config_1.VertexT.BLACK) ? white :
        ((boardColor === config_1.VertexT.WHITE) ? black : empty);
    if ((boardColor === config_1.VertexT.EMPTY)) {
        drawSymbolBg(ctx, pt, rect, radius);
    }
    var _a = getXYFromPt(pt, rect), x = _a.x, y = _a.y;
    ctx.fillStyle = style;
    ctx.font = 'bold ' + Math.floor(radius * 2) + 'px Arial, "Courier New"';
    ctx.fillText('\u25B2', x, y);
}
function drawStr(ctx, pt, rect, radius, boardColor, text, alpha) {
    if (alpha === void 0) { alpha = 1.0; }
    var black = "rgba(53, 45, 41, " + alpha + ")";
    var white = "rgba(255, 248, 237, " + alpha + ")";
    var empty = "rgba(0, 53, 169, " + alpha + ")";
    var style = (boardColor === config_1.VertexT.BLACK) ? white :
        ((boardColor === config_1.VertexT.WHITE) ? black : empty);
    if ((boardColor === config_1.VertexT.EMPTY)) {
        drawSymbolBg(ctx, pt, rect, radius);
    }
    var _a = getXYFromPt(pt, rect), x = _a.x, y = _a.y;
    ctx.fillStyle = style;
    ctx.font = 'bold ' + Math.floor(radius * 1.4) + 'px Arial, "Courier New"';
    ctx.fillText(text, x, y);
}
function drawSquare(ctx, pt, rect, radius, boardColor, alpha) {
    if (alpha === void 0) { alpha = 1.0; }
    var black = "rgba(53, 45, 41, " + alpha + ")";
    var white = "rgba(255, 248, 237, " + alpha + ")";
    var empty = "rgba(77, 129, 20, " + alpha + ")";
    var style = (boardColor === config_1.VertexT.BLACK) ? white :
        ((boardColor === config_1.VertexT.WHITE) ? black : empty);
    if ((boardColor === config_1.VertexT.EMPTY)) {
        drawSymbolBg(ctx, pt, rect, radius);
    }
    ctx.fillStyle = style;
    var size = radius;
    var _a = getXYFromPt(pt, rect), x = _a.x, y = _a.y;
    var xc = x - size / 2;
    var yc = y - size / 2;
    ctx.fillRect(xc, yc, size, size);
}
function drawCircle(ctx, pt, rect, radius, boardColor, alpha) {
    if (alpha === void 0) { alpha = 1.0; }
    var black = "rgba(53, 45, 41, " + alpha + ")";
    var white = "rgba(255, 248, 237, " + alpha + ")";
    var empty = "rgba(0, 53, 169, " + alpha + ")";
    var style = (boardColor === config_1.VertexT.BLACK) ? white :
        ((boardColor === config_1.VertexT.WHITE) ? black : empty);
    if ((boardColor === config_1.VertexT.EMPTY)) {
        drawSymbolBg(ctx, pt, rect, radius);
    }
    ctx.lineWidth = 4;
    ctx.strokeStyle = style;
    var size = radius / 2.2;
    var _a = getXYFromPt(pt, rect), x = _a.x, y = _a.y;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();
}
function drawVoteCircle(ctx, pt, rect, color, radius, text, textcolor) {
    ctx.lineWidth = 4;
    ctx.fillStyle = color;
    var size = radius / 1.2;
    var _a = getXYFromPt(pt, rect), x = _a.x, y = _a.y;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    if ((text !== '') && textcolor) {
        ctx.fillStyle = textcolor;
        ctx.font = 'bold ' + Math.floor(radius * 1.0) + 'px Arial, "Courier New"';
        ctx.fillText(text, x, y);
    }
}
exports.ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function drawSymbols(ctx, rect, s, radius) {
    var cfg = s.config;
    var data = s.node.ruleData;
    if (data === void 0) {
        return;
    }
    var si = data.symbolInfo;
    for (var i = 0; i < si.nonSeq.length; ++i) {
        var idx = config_1.coorPt2Idx(si.nonSeq[i], s.config.size);
        var boardColor = s.curr.vertices[idx];
        var pt = qipan_1.getRotatedPt(cfg.rotation, cfg.size, si.nonSeq[i]);
        var symbol = si.nonSeqSymbols[i];
        if (symbol === rule_1.SymbolEnum.triangle) {
            drawTriangles(ctx, pt, rect, radius, boardColor, 1.0);
        }
        else if (symbol === rule_1.SymbolEnum.circle) {
            drawCircle(ctx, pt, rect, radius, boardColor, 1.0);
        }
        else if (symbol === rule_1.SymbolEnum.square) {
            drawSquare(ctx, pt, rect, radius, boardColor, 1.0);
        }
    }
    var drawAla = function (rawpt, text) {
        var idx = config_1.coorPt2Idx(rawpt, s.config.size);
        var boardColor = s.curr.vertices[idx];
        var pt = qipan_1.getRotatedPt(cfg.rotation, cfg.size, rawpt);
        drawStr(ctx, pt, rect, radius, boardColor, text, 1.0);
    };
    var drawWinratePts = function (rawpt, text) {
        var size = cfg.size;
        var pt = qipan_1.getRotatedPt(cfg.rotation, cfg.size, rawpt);
        var _a = getXYFromPt(pt, rect), x = _a.x, y = _a.y;
        ctx.strokeStyle = 'rgba(0, 0, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.fillStyle = 'rgba(0, 128, 0, 0.8)';
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = 'bold ' + Math.floor(radius * 1.0) + 'px Arial, "Courier New"';
        ctx.fillText(text, x, y);
    };
    for (var i = 0; i < si.numSymbols.length; ++i) {
        var text = (i + 1).toString();
        drawAla(si.numSymbols[i], text);
    }
    for (var i = 0; i < si.alaSymbols.length; ++i) {
        var text = exports.ALPHABET[(i % exports.ALPHABET.length)];
        drawAla(si.alaSymbols[i], text);
    }
    if (si.winratePts) {
        for (var i = 0; i < si.winratePts.length; ++i) {
            var t = si.winratePts[i];
            drawWinratePts(t.pt, t.text);
        }
    }
    if (si.permanentSymbols) {
        for (var i = 0; i < si.permanentSymbols.length; ++i) {
            var s_1 = si.permanentSymbols[i];
            drawAla(s_1.pt, s_1.text);
        }
    }
}
function getSeqSymbolNextText(s, symbol) {
    var si = s.node.ruleData.symbolInfo;
    if (symbol === rule_1.SymbolEnum.alphabet) {
        var k = si.alaSymbols.length;
        var text = exports.ALPHABET[(k % exports.ALPHABET.length)];
        return text;
    }
    else if (symbol === rule_1.SymbolEnum.number) {
        var k = si.numSymbols.length;
        var text = (k + 1).toString();
        return text;
    }
    else {
        console.error("getSeqSymbolNextText");
        return '';
    }
}
function drawVoteInfo(ctx, rect, s, radius) {
    if (!s.voteInfo) {
        return;
    }
    var voteInfo = s.voteInfo;
    if (voteInfo.type === "stu") {
        if (voteInfo.pt) {
            var rpt = qipan_1.getRotatedPt(s.config.rotation, s.config.size, voteInfo.pt);
            drawVoteCircle(ctx, rpt, rect, voteInfo.colorStuSelect, radius, '');
        }
    }
    else {
        for (var _i = 0, _a = Object.values(voteInfo.count); _i < _a.length; _i++) {
            var ptCount = _a[_i];
            var idx = config_1.coorPt2Idx(ptCount.pt, s.config.size);
            if (s.curr.vertices[idx] !== config_1.VertexT.EMPTY) {
                continue;
            }
            var rpt = qipan_1.getRotatedPt(s.config.rotation, s.config.size, ptCount.pt);
            var color = voteInfo.colorTeaShow;
            if (voteInfo.pt && (voteInfo.pt.x === ptCount.pt.x) && (voteInfo.pt.y === ptCount.pt.y)) {
                color = voteInfo.colorTeaSelect;
            }
            drawVoteCircle(ctx, rpt, rect, color, radius, ptCount.count.toString(), voteInfo.colorNumber);
        }
    }
}
function drawEstimate(ctx, rect, s, radius) {
    var drawEstimateOneColor = function (c, pts) {
        var x1 = s.config.x1;
        var y1 = s.config.y1;
        ctx.fillStyle = (c === config_1.VertexT.BLACK) ? "#352D29" : "#FFF8ED";
        for (var _i = 0, pts_1 = pts; _i < pts_1.length; _i++) {
            var rawpt = pts_1[_i];
            var pt = qipan_1.getRotatedPt(s.config.rotation, s.config.size, rawpt);
            var x = pt.x - x1;
            var y = pt.y - y1;
            var size = radius * 1.0;
            var xc = rect.gOrigX + x * rect.squareW - size / 2;
            var yc = rect.gOrigY + y * rect.squareH - size / 2;
            ctx.fillRect(xc, yc, size, size);
        }
    };
    var weiqiState = s.ruleState;
    drawEstimateOneColor(config_1.VertexT.BLACK, weiqiState.blackEstimate);
    drawEstimateOneColor(config_1.VertexT.WHITE, weiqiState.whiteEstimate);
}
var COORXALL = "ABCDEFGHJKLMNOPQRST".split('');
var COORYALL = "123456789".split('')
    .concat('10 11 12 13 14 15 16 17 18 19'.split(' '));
function getCoorXText(r, coorx, coory, size) {
    if (r === config_1.RotateDeg.deg0) {
        return coorx;
    }
    else if (r === config_1.RotateDeg.deg90) {
        var ret = coory.slice(0, size);
        ret.reverse();
        return ret;
    }
    else if (r === config_1.RotateDeg.deg180) {
        var ret = coorx.slice(0, size);
        ret.reverse();
        return ret;
    }
    else {
        if (r !== config_1.RotateDeg.deg270) {
            console.error("getCoorXText");
        }
        var ret = coory.slice(0, size);
        return ret;
    }
}
function getCoorYText(r, coorx, coory, size) {
    if (r === config_1.RotateDeg.deg0) {
        return coory;
    }
    else if (r === config_1.RotateDeg.deg90) {
        return coorx;
    }
    else if (r === config_1.RotateDeg.deg180) {
        var ret = coory.slice(0, size);
        ret.reverse();
        return ret;
    }
    else {
        if (r !== config_1.RotateDeg.deg270) {
            console.error("getCoorYText");
        }
        var ret = coorx.slice(0, size);
        ret.reverse();
        return ret;
    }
}
function drawStarPoints19(ctx, radius, gOrigX, gOrigY, squareW, squareH, x1, x2, y1, y2, noGridDict) {
    var starSize = Math.max(Math.floor(radius / 5), 1);
    for (var xi = x1; xi <= x2; ++xi) {
        for (var yi = y1; yi <= y2; ++yi) {
            if ((xi === 3 && yi === 3) ||
                (xi === 3 && yi === 9) ||
                (xi === 3 && yi === 15) ||
                (xi === 9 && yi === 3) ||
                (xi === 9 && yi === 9) ||
                (xi === 9 && yi === 15) ||
                (xi === 15 && yi === 3) ||
                (xi === 15 && yi === 9) ||
                (xi === 15 && yi === 15)) {
                var idx = yi * 19 + xi;
                if (noGridDict[idx]) {
                    continue;
                }
                var xc = Math.floor(gOrigX + (xi - x1) * squareW) + 0.5;
                var yc = Math.floor(gOrigY + (yi - y1) * squareH) + 0.5;
                ctx.beginPath();
                ctx.arc(xc, yc, starSize, 0.0001, Math.PI * 2, false);
                ctx.fill();
            }
        }
    }
}
function drawVersion(ctx, fontsize, x, y) {
    var version = config_1.getQipanVersion();
    console.log('qipan version: ', version);
    ctx.font = 'bold ' + Math.floor(fontsize) + 'px Arial, "Courier New"';
    ctx.fillStyle = "#ff0000";
    ctx.fillText(version, x, y);
}
function getNoGridDict(s) {
    var d = [];
    var cfg = s.config;
    var data = s.node.ruleData;
    var si = data.symbolInfo;
    for (var i = 0; i < cfg.size * cfg.size; ++i) {
        d.push(false);
    }
    var addPt = function (d, pt) {
        var rpt = qipan_1.getRotatedPt(cfg.rotation, cfg.size, pt);
        var idx = config_1.coorPt2Idx(rpt, cfg.size);
        d[idx] = true;
    };
    for (var i = 0; i < si.nonSeq.length; ++i) {
        addPt(d, si.nonSeq[i]);
    }
    for (var i = 0; i < si.numSymbols.length; ++i) {
        addPt(d, si.numSymbols[i]);
    }
    for (var i = 0; i < si.alaSymbols.length; ++i) {
        addPt(d, si.alaSymbols[i]);
    }
    if (si.permanentSymbols) {
        for (var i = 0; i < si.permanentSymbols.length; ++i) {
            addPt(d, si.permanentSymbols[i].pt);
        }
    }
    if (s.candidate) {
        addPt(d, s.candidate.pt);
    }
    var shouldHideGridCursor = s.cursor.onQipan && s.cursor.show
        && s.cursor.pt && (!s.config.isRemoteControlled);
    if (shouldHideGridCursor && s.cursor.pt) {
        var idx = config_1.coorPt2Idx(s.cursor.pt, cfg.size);
        d[idx] = true;
    }
    return d;
}
function draw(ctx, rect, s, strongX, strongY, showCoor, annotations) {
    if (showCoor === void 0) { showCoor = false; }
    var canvasW = rect.canvasW, canvasH = rect.canvasH, qipanW = rect.qipanW, qipanH = rect.qipanH, qipanX = rect.qipanX, qipanY = rect.qipanY, innerW = rect.innerW, innerH = rect.innerH, innerX = rect.innerX, innerY = rect.innerY, gridsW = rect.gridsW, gridsH = rect.gridsH, gridsX = rect.gridsX, gridsY = rect.gridsY, gOrigX = rect.gOrigX, gOrigY = rect.gOrigY, squareW = rect.squareW, squareH = rect.squareH, rx1 = rect.rx1, rx2 = rect.rx2, ry1 = rect.ry1, ry2 = rect.ry2;
    var rotation = s.config.rotation;
    var b = s.curr;
    ctx.clearRect(0, 0, canvasW, canvasH);
    var COORX = COORXALL.slice(0, b.size);
    var COORY = COORYALL.slice(0, b.size).reverse();
    {
        var bgStyle = qipan_1.getBgStyle();
        if (bgStyle.bgType === qipan_1.BgStyle.img) {
            var style = bgStyle;
            ctx.drawImage(style.img, qipanX, qipanY, qipanW, qipanH);
        }
        else if (bgStyle.bgType === qipan_1.BgStyle.draw) {
            var style = bgStyle;
            ctx.fillStyle = style.outerBorder;
            ctx.fillRect(qipanX, qipanY, qipanW, qipanH);
            ctx.fillStyle = style.qipan;
            ctx.fillRect(innerX, innerY, innerW, innerH);
        }
        var radius_1 = ((squareW < squareH) ? squareW : squareH) * 17.8 / 18.0 / 2.0;
        var noGridDict = getNoGridDict(s);
        var noGridSize = radius_1 / 1.1;
        ctx.fillStyle = qipan_1.qipanNonPicTheme.line;
        ctx.strokeStyle = qipan_1.qipanNonPicTheme.line;
        ctx.lineCap = "square";
        var gridWeight = (qipan_1.qipanNonPicTheme.getLineWidth) ?
            qipan_1.qipanNonPicTheme.getLineWidth(radius_1, b.size) :
            (radius_1 / 15.0);
        if (gridWeight > 1.2) {
            gridWeight = 1.2;
        }
        var NX = rx2 - rx1 + 1;
        var NY = ry2 - ry1 + 1;
        for (var i = 0; i < NX; ++i) {
            ctx.lineWidth = (i + rx1 === strongX) ? gridWeight * 2 : gridWeight;
            ctx.beginPath();
            var x = Math.floor(gOrigX + squareW * i) + 0.5;
            ctx.moveTo(x, gridsY);
            for (var j = 0; j < NY; ++j) {
                var idx = (j + ry1) * b.size + (i + rx1);
                if (noGridDict[idx]) {
                    var y = gOrigY + j * squareH;
                    (y - noGridSize > gridsY) && ctx.lineTo(x, y - noGridSize);
                    var y2 = (y + noGridSize > gridsY + gridsH) ? (gridsY + gridsH) : (y + noGridSize);
                    ctx.moveTo(x, y2);
                }
            }
            ctx.lineTo(x, gridsY + gridsH);
            ctx.stroke();
        }
        for (var i = 0; i < NY; ++i) {
            ctx.lineWidth = (i + ry1 === strongY) ? gridWeight * 2 : gridWeight;
            ctx.beginPath();
            var y = Math.floor(gOrigY + squareH * i) + 0.5;
            ctx.moveTo(gridsX, y);
            for (var j = 0; j < NX; ++j) {
                var idx = (i + ry1) * b.size + (j + rx1);
                if (noGridDict[idx]) {
                    var x = gOrigX + j * squareW;
                    (x - noGridSize > gridsX) && ctx.lineTo(x - noGridSize, y);
                    var x2 = (x + noGridSize > gridsX + gridsW) ? (gridsX + gridsW) : (x + noGridSize);
                    ctx.moveTo(x2, y);
                }
            }
            ctx.lineTo(gridsX + gridsW, y);
            ctx.stroke();
        }
        if (b.size === 19) {
            drawStarPoints19(ctx, radius_1, gOrigX, gOrigY, squareW, squareH, rx1, rx2, ry1, ry2, noGridDict);
        }
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        if (showCoor && (b.size >= 5)) {
            var fontsize = squareW / 3.0;
            ctx.font = 'bold ' + Math.floor(fontsize) + 'px Arial, "Courier New"';
            var RCOORX = getCoorXText(s.config.rotation, COORX, COORY, b.size);
            if (ry1 === 0) {
                var coory = gridsY - squareH * 0.8;
                for (var i = 0; i < NX; ++i) {
                    ctx.fillText(RCOORX[rx1 + i], gOrigX + squareW * i, coory);
                }
            }
            if (ry2 === b.size - 1) {
                var coory = gOrigY + squareH * (NY - 0.2);
                for (var i = 0; i < NX; ++i) {
                    ctx.fillText(RCOORX[rx1 + i], gOrigX + squareW * i, coory);
                }
            }
            var RCOORY = getCoorYText(s.config.rotation, COORX, COORY, b.size);
            if (rx1 === 0) {
                var coorx = gridsX - squareW * 0.8;
                for (var i = 0; i < NY; ++i) {
                    ctx.fillText(RCOORY[ry1 + i], coorx, gOrigY + squareH * i);
                }
            }
            if (rx2 === b.size - 1) {
                var coorx = gOrigX + squareW * (NX - 0.2);
                for (var i = 0; i < NX; ++i) {
                    ctx.fillText(RCOORY[ry1 + i], coorx, gOrigY + squareH * i);
                }
            }
        }
        b.vertices.forEach(function (value, index) {
            var opt = config_1.coorIdx2SgfPt(index, b.size);
            if (opt === void 0) {
                return;
            }
            var pt = qipan_1.getRotatedPt(rotation, b.size, opt);
            if (pt.x >= rx1 && pt.y >= ry1 && pt.x <= rx2 && pt.y <= ry2) {
                drawPt(ctx, value, annotations[index], pt.x - rx1, pt.y - ry1, squareW, squareH, gOrigX, gOrigY, radius_1);
            }
        });
        if ((s.showVersion > 12) && (b.size > 5)) {
            drawVersion(ctx, squareW, qipanX + qipanW / 2, qipanY + qipanH / 2);
        }
        return radius_1;
    }
}
function drawTransparentPt(ctx, rect, pt, color, radius, x1, y1) {
    var x = pt.x - x1;
    var y = pt.y - y1;
    var xc = rect.gOrigX + x * rect.squareW;
    var yc = rect.gOrigY + y * rect.squareH;
    ctx.beginPath();
    ctx.arc(xc, yc, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = (color === config_1.VertexT.BLACK) ? "rgba(53, 45, 41, 0.6)" : "rgba(255, 248, 237, 0.6)";
    ctx.strokeStyle = "#000000";
    ctx.fill();
}
function drawShixiaDaan(ctx, rect, pt, x1, y1, radius, color) {
    var x = pt.x - x1;
    var y = pt.y - y1;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(rect.gOrigX + x * rect.squareW, rect.gOrigY + y * rect.squareH, radius / 1.8, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}
function drawColorCircle(ctx, rect, pt, radius, color) {
    var x = pt.x - rect.rx1;
    var y = pt.y - rect.ry1;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(rect.gOrigX + x * rect.squareW, rect.gOrigY + y * rect.squareH, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}
function drawDaanHint(ctx, rect, s, radius) {
    var node = s.node;
    var size = s.config.size;
    var rotation = s.config.rotation;
    for (var _i = 0, _a = Object.keys(node.children); _i < _a.length; _i++) {
        var key = _a[_i];
        var child = node.children[key];
        var timuData = child.timuData;
        if (timuData && timuData.color !== state_1.ShixiaColor.NOCOLOR) {
            var color = ((timuData.color === state_1.ShixiaColor.RED) ?
                '#C80000' :
                ((timuData.color === state_1.ShixiaColor.BLUE) ?
                    '#1C569A' : '#1D8012'));
            var pt = timu_1.getPtFromTimuData(timuData, s.depth);
            if (pt === void 0) {
                return;
            }
            if (pt !== "PASS") {
                var rpt = qipan_1.getRotatedPt(rotation, size, pt);
                drawShixiaDaan(ctx, rect, rpt, rect.rx1, rect.ry1, radius, color);
            }
        }
    }
}
function drawLuoziTimu(ctx, rect, s, radius) {
    if (s.timuInfo === void 0) {
        return;
    }
    var luoziState = s.timuInfo.luoziState;
    var luoziCount = s.timuInfo.luoziCount;
    for (var _i = 0, _a = Object.keys(luoziState); _i < _a.length; _i++) {
        var k = _a[_i];
        var idx = parseInt(k);
        var pt = config_1.coorIdx2SgfPt(idx, s.config.size);
        if (pt === void 0) {
            console.error("drawLuoziTimu ", idx);
            return;
        }
        var rpt = qipan_1.getRotatedPt(s.config.rotation, s.config.size, pt);
        if (luoziCount === 0) {
            drawColorCircle(ctx, rect, rpt, radius / 1.5, '#1C569A');
        }
        if (luoziState[idx]) {
            drawColorCircle(ctx, rect, rpt, radius / 2.2, '#1D8012');
        }
    }
}
function getQipanRect(s) {
    if (s.config.qipanRect) {
        return s.config.qipanRect;
    }
    else {
        var myrect = config_1.getMyRect(s.config);
        var showCoor = (s.config.showCoor) ? true : false;
        var rect = qipan_1.computeQipanRect(myrect, s.curr.size, s.config.rotation, s.config.x1, s.config.x2, s.config.y1, s.config.y2, showCoor);
        s.config.qipanRect = rect;
        return rect;
    }
}
exports.getQipanRect = getQipanRect;
function drawCursor(ctx, rect, s, radius) {
    var b = s.curr;
    var candidateIdx = -1;
    if (s.candidate) {
        candidateIdx = config_1.coorPt2Idx(s.candidate.pt, b.size);
    }
    if ((ctx.ctxType === config_1.CtxType.WEB) && (s.whoPlay !== void 0)
        && (s.cursor.show) && (s.cursor.onQipan) && (s.cursor.pt !== void 0)) {
        var idx = config_1.coorPt2Idx(qipan_1.getUnrotatedPt(s.config.rotation, b.size, s.cursor.pt), b.size);
        var color = b.vertices[idx];
        var pt = s.cursor.pt;
        if (s.cursor.type === 'vote') {
            if (!s.voteInfo) {
                console.error('cursor type vote without voteInfo');
            }
            else if (color === config_1.VertexT.EMPTY && candidateIdx !== idx) {
                drawVoteCircle(ctx, pt, rect, s.voteInfo.colorStuSelect, radius, '');
            }
        }
        if (s.config.isRemoteControlled) {
            return;
        }
        if (s.cursor.type === 'pt') {
            if (color === config_1.VertexT.EMPTY && candidateIdx !== idx) {
                var who = (s.whoPlace === void 0) ? s.whoPlay : s.whoPlace;
                drawTransparentPt(ctx, rect, pt, who, radius, rect.rx1, rect.ry1);
            }
        }
        else if (s.cursor.type === rule_1.SymbolEnum.triangle) {
            drawTriangles(ctx, pt, rect, radius, color, 0.6);
        }
        else if (s.cursor.type === rule_1.SymbolEnum.square) {
            drawSquare(ctx, pt, rect, radius, color, 0.6);
        }
        else if (s.cursor.type === rule_1.SymbolEnum.circle) {
            drawCircle(ctx, pt, rect, radius, color, 0.6);
        }
        else if (s.cursor.type === rule_1.SymbolEnum.number ||
            s.cursor.type === rule_1.SymbolEnum.alphabet) {
            var text = getSeqSymbolNextText(s, s.cursor.type);
            if (text !== '') {
                drawStr(ctx, pt, rect, radius, color, text, 0.6);
            }
        }
    }
}
function _render(r, s) {
    var ctx = r.ctx;
    if (ctx) {
        var rect = getQipanRect(s);
        var strongXLine = void 0;
        var strongYLine = void 0;
        var rotatedCandidate = (s.candidate) ?
            {
                pt: qipan_1.getRotatedPt(s.config.rotation, s.config.size, s.candidate.pt),
                color: s.candidate.color,
            } : void 0;
        if (rotatedCandidate) {
            strongXLine = rotatedCandidate.pt.x;
            strongYLine = rotatedCandidate.pt.y;
        }
        var annotations = state_1.computeAnnotations(s);
        var radius = draw(ctx, rect, s, strongXLine, strongYLine, s.config.showCoor, annotations);
        if (s.config.permanentTriangles) {
            for (var _i = 0, _a = s.config.permanentTriangles; _i < _a.length; _i++) {
                var pt = _a[_i];
                var idx = config_1.coorPt2Idx(pt, s.config.size);
                var boardColor = s.curr.vertices[idx];
                var rpt = qipan_1.getRotatedPt(s.config.rotation, s.config.size, pt);
                drawTriangles(ctx, rpt, rect, radius, boardColor);
            }
        }
        if (s.timuInfo) {
            drawLuoziTimu(ctx, rect, s, radius);
        }
        {
            if (rotatedCandidate) {
                drawTransparentPt(ctx, rect, rotatedCandidate.pt, rotatedCandidate.color, radius, rect.rx1, rect.ry1);
            }
            drawSymbols(ctx, rect, s, radius);
            drawCursor(ctx, rect, s, radius);
            drawEstimate(ctx, rect, s, radius);
            drawVoteInfo(ctx, rect, s, radius);
        }
        if (s.showShixiaDaan) {
            drawDaanHint(ctx, rect, s, radius);
        }
        if (s.penMode.pts.length > 0) {
            s.penMode.render(ctx, s.config);
        }
        r.lastRenderQipanRect = rect;
        (ctx.ctxType === config_1.CtxType.WX) && ctx.draw && ctx.draw(false, function () {
            r.qp.cb && r.qp.cb();
        });
    }
}
function _triggerRender(r, qp) {
    if (r.isRendering) {
        return;
    }
    r.isRendering = true;
    requestAnimationFrame(function () {
        _render(r, qp.state);
        r.isRendering = false;
    });
}
function getRender(ctx, qp) {
    function newRender() {
        var r = {
            isRendering: false,
            qp: qp,
            ctx: ctx,
            render: function (s) {
                _render(r, s);
            },
            triggerRender: function () {
                _triggerRender(r, qp);
            },
            lastRenderQipanRect: "NO_LAST_RENDER",
        };
        if (ctx.ctxType === config_1.CtxType.WEB && ctx.updateQipan) {
            ctx.updateQipan(qp);
        }
        return r;
    }
    return newRender();
}
exports.getRender = getRender;
function getQipanRectLastRender(r) {
    return r.lastRenderQipanRect;
}
exports.getQipanRectLastRender = getQipanRectLastRender;

},{"./config":1,"./qipan":5,"./rule":7,"./state":8,"./timu":9}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var state_1 = require("./state");
var config_1 = require("./config");
var debug_1 = require("./debug");
var NodeDataType;
(function (NodeDataType) {
    NodeDataType[NodeDataType["type0"] = 0] = "type0";
    NodeDataType[NodeDataType["type1"] = 1] = "type1";
    NodeDataType[NodeDataType["type2"] = 2] = "type2";
})(NodeDataType = exports.NodeDataType || (exports.NodeDataType = {}));
var SymbolEnum;
(function (SymbolEnum) {
    SymbolEnum[SymbolEnum["triangle"] = 1] = "triangle";
    SymbolEnum[SymbolEnum["circle"] = 2] = "circle";
    SymbolEnum[SymbolEnum["square"] = 3] = "square";
    SymbolEnum[SymbolEnum["number"] = 4] = "number";
    SymbolEnum[SymbolEnum["alphabet"] = 5] = "alphabet";
})(SymbolEnum = exports.SymbolEnum || (exports.SymbolEnum = {}));
function buildEmptySymbolInfo() {
    return {
        idx2sym: {},
        nonSeqSymbols: [],
        nonSeq: [],
        numSymbols: [],
        alaSymbols: [],
    };
}
exports.buildEmptySymbolInfo = buildEmptySymbolInfo;
function updateAnnoCache(s) {
    var size = s.config.size;
    var weiqiState = s.ruleState;
    var cache = weiqiState.annotationCache;
    var count = s.showHandCount;
    var threshold = (count === 'all') ? -1 : weiqiState.currentK - count + 0.5;
    for (var i = 0; i < size * size; ++i) {
        cache[i] = '';
    }
    var curr = s.rootNode;
    for (var i = 0; i < s.depth; ++i) {
        var hash = s.movesHashes[i];
        var nextNode = curr.children[hash];
        if (nextNode) {
            curr = nextNode;
        }
        else {
            console.error("node null child ", hash, i, s.movesHashes);
            return;
        }
        var d = curr.ruleData;
        if (d === void 0) {
            console.error("node has no data");
            return;
        }
        if (d.type === NodeDataType.type1) {
            var ptdata = d;
            if (ptdata.pt === "PASS") {
                continue;
            }
            var idx = config_1.coorPt2Idx(ptdata.pt, size);
            if (ptdata.anno > threshold) {
                cache[idx] = ptdata.anno.toString();
            }
            else {
                cache[idx] = '';
            }
        }
        else if (d.type === NodeDataType.type2) {
            var data = d;
            var pts = data.black.concat(data.white);
            for (var _i = 0, pts_1 = pts; _i < pts_1.length; _i++) {
                var pt = pts_1[_i];
                var idx = config_1.coorPt2Idx(pt, size);
                cache[idx] = '';
            }
        }
    }
}
exports.updateAnnoCache = updateAnnoCache;
function getNeighbours(b, pt) {
    var ns = [];
    if (pt.x > 0) {
        ns.push({
            x: pt.x - 1,
            y: pt.y,
        });
    }
    if (pt.x < b.size - 1) {
        ns.push({
            x: pt.x + 1,
            y: pt.y,
        });
    }
    if (pt.y > 0) {
        ns.push({
            x: pt.x,
            y: pt.y - 1,
        });
    }
    if (pt.y < b.size - 1) {
        ns.push({
            x: pt.x,
            y: pt.y + 1,
        });
    }
    return ns;
}
var getColor = function (b, pt) { return b.vertices[config_1.coorPt2Idx(pt, b.size)]; };
var LibertyCounter = (function () {
    function LibertyCounter() {
        this.prevCountPts = [];
    }
    LibertyCounter.prototype.doFloodfill = function (pt, size) {
        LibertyCounter.floodfill[config_1.coorPt2Idx(pt, size)] = LibertyCounter.filled;
    };
    LibertyCounter.prototype.notFloodfilled = function (pt, size) {
        return LibertyCounter.floodfill[config_1.coorPt2Idx(pt, size)] !== LibertyCounter.filled;
    };
    LibertyCounter.prototype.count = function (b, pt) {
        LibertyCounter.filled++;
        if (4294967295 === LibertyCounter.filled) {
            LibertyCounter.filled = 1;
            LibertyCounter.floodfill = new Uint32Array(config_1.MAX_SIZE * config_1.MAX_SIZE);
        }
        var color = getColor(b, pt);
        var queue = [pt];
        this.doFloodfill(pt, b.size);
        this.prevCountPts = [];
        var liberties = 0;
        while (queue.length > 0) {
            var pt_1 = queue.shift();
            if (!pt_1) {
                break;
            }
            this.prevCountPts.push(config_1.coorPt2Idx(pt_1, b.size));
            for (var _i = 0, _a = getNeighbours(b, pt_1); _i < _a.length; _i++) {
                var npt = _a[_i];
                if (this.notFloodfilled(npt, b.size)) {
                    this.doFloodfill(npt, b.size);
                    var nColor = getColor(b, npt);
                    if (nColor === color) {
                        queue.push(npt);
                    }
                    else if (nColor === config_1.VertexT.EMPTY) {
                        ++liberties;
                    }
                }
            }
        }
        return liberties;
    };
    LibertyCounter.prototype.getPrevCountGroup = function () {
        return this.prevCountPts;
    };
    LibertyCounter.floodfill = new Uint32Array(config_1.MAX_SIZE * config_1.MAX_SIZE);
    LibertyCounter.filled = 1;
    return LibertyCounter;
}());
var counter = new LibertyCounter();
debug_1.debug.dump('counter', counter);
debug_1.debug.dump('LibertyCounter', LibertyCounter);
function eatDead(vs, dead, b) {
    for (var _i = 0, dead_1 = dead; _i < dead_1.length; _i++) {
        var v = dead_1[_i];
        vs.push({
            index: v,
            oldColor: b.vertices[v],
            color: config_1.VertexT.EMPTY,
        });
    }
}
function getKoStatus(data) {
    if (data.type === NodeDataType.type1) {
        var d = data;
        return d.ko;
    }
    return void 0;
}
function getWeiqiRule() {
    function isSuicide(pt, b, color) {
        for (var _i = 0, _a = getNeighbours(b, pt); _i < _a.length; _i++) {
            var u = _a[_i];
            var nc = getColor(b, u);
            if (nc === config_1.VertexT.EMPTY) {
                return false;
            }
            else {
                var libs = counter.count(b, u);
                if (nc === color) {
                    if (libs > 1) {
                        return false;
                    }
                }
                else {
                    if (libs <= 1) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    return {
        isLegal: function (pt, state, color) {
            var TILLEGAL = 2;
            var curr = state.curr, node = state.node;
            var size = curr.size;
            if (node.ruleData) {
                var ko = getKoStatus(node.ruleData);
                if (ko && config_1.coorPt2Idx(ko, size) === config_1.coorPt2Idx(pt, size)) {
                    return { tag: TILLEGAL, pt: pt, illegalReason: "KO" };
                }
            }
            if (curr.vertices[config_1.coorPt2Idx(pt, size)] !== config_1.VertexT.EMPTY) {
                return { tag: TILLEGAL, pt: pt, illegalReason: "NOT_EMPTY" };
            }
            if (isSuicide(pt, state.curr, color)) {
                return { tag: TILLEGAL, pt: pt, illegalReason: "SUICIDE" };
            }
            return "Legal";
        },
        buildRuleDiff: function (b, pt, color, k) {
            if (pt === "PASS") {
                var data_1 = {
                    symbolInfo: buildEmptySymbolInfo(),
                    type: NodeDataType.type1,
                    anno: k + 1,
                    pt: "PASS",
                    color: color,
                    eatNum: 0,
                };
                return {
                    vs: [],
                    hashCode: "PASS",
                    ruleData: data_1
                };
            }
            var vs = [];
            var index = config_1.coorPt2Idx(pt, b.size);
            vs.push({
                index: index,
                oldColor: b.vertices[index],
                color: color,
            });
            var opColor = (color === config_1.VertexT.BLACK) ? config_1.VertexT.WHITE : config_1.VertexT.BLACK;
            var eyeplay = true;
            var totalDead = 0;
            var ko = undefined;
            for (var _i = 0, _a = getNeighbours(b, pt); _i < _a.length; _i++) {
                var u = _a[_i];
                var c = getColor(b, u);
                if (c !== opColor) {
                    eyeplay = false;
                }
                if (c === opColor && counter.count(b, u) == 1) {
                    var deadGroup = counter.getPrevCountGroup();
                    eatDead(vs, deadGroup, b);
                    totalDead += deadGroup.length;
                    ko = u;
                }
            }
            var d = state_1.buildBoardDiff(vs, config_1.coorPt2Sgf(pt, b.size));
            var data = {
                symbolInfo: buildEmptySymbolInfo(),
                type: NodeDataType.type1,
                anno: k + 1,
                pt: pt,
                color: color,
                eatNum: totalDead,
            };
            if (eyeplay && totalDead === 1) {
                data.ko = ko;
            }
            d.ruleData = data;
            return d;
        },
    };
}
exports.getWeiqiRule = getWeiqiRule;

},{"./config":1,"./debug":2,"./state":8}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
var rule_1 = require("./rule");
var render_1 = require("./render");
var pen_1 = require("./pen");
var NONPT_HASH = 'NONPT';
var ShixiaColor;
(function (ShixiaColor) {
    ShixiaColor[ShixiaColor["NOCOLOR"] = 0] = "NOCOLOR";
    ShixiaColor[ShixiaColor["GREEN"] = 1] = "GREEN";
    ShixiaColor[ShixiaColor["BLUE"] = 2] = "BLUE";
    ShixiaColor[ShixiaColor["RED"] = 3] = "RED";
})(ShixiaColor = exports.ShixiaColor || (exports.ShixiaColor = {}));
function getDefaultCursor() {
    return { show: false, type: 'pt', onQipan: false };
}
function initVoteInfo(type) {
    return {
        type: type,
        count: {},
        colorTeaSelect: 'rgba(10, 70, 164, 1.0)',
        colorStuSelect: 'rgba(194, 83, 20, 1.0)',
        colorTeaShow: 'rgba(194, 83, 20, 1.0)',
        colorNumber: '#ffe9ac',
    };
}
exports.initVoteInfo = initVoteInfo;
function buildEmptyBoard(size) {
    var vertices = new Uint8Array(size * size);
    for (var i = 0; i < vertices.length; ++i) {
        vertices[i] = config_1.VertexT.EMPTY;
    }
    return {
        size: size,
        vertices: vertices,
    };
}
function getHashCode(vs, size) {
    var vts = ["" + config_1.VertexT.EMPTY, "" + config_1.VertexT.BLACK, "" + config_1.VertexT.WHITE];
    var vsSorted = {};
    vts.forEach(function (v) {
        vsSorted[v] = [];
    });
    for (var _i = 0, vs_1 = vs; _i < vs_1.length; _i++) {
        var v = vs_1[_i];
        var sgfPt = config_1.coorIdx2SgfPt(v.index, size);
        if (sgfPt === void 0) {
            continue;
        }
        var pt = "" + sgfPt.xsgf + sgfPt.ysgf;
        vsSorted["" + v.color].push(pt);
    }
    return vts.map(function (v) {
        vsSorted[v].sort();
        return vsSorted[v].join('');
    }).join('|');
}
function buildBoardDiff(vs, hashCode) {
    var d = {
        vs: vs,
        hashCode: hashCode,
    };
    return d;
}
exports.buildBoardDiff = buildBoardDiff;
function buildSetupDiff(size, ab, aw) {
    var vs = [];
    var populate = function (pts, color) {
        for (var _i = 0, pts_1 = pts; _i < pts_1.length; _i++) {
            var pt = pts_1[_i];
            if (pt !== "PASS") {
                vs.push({
                    index: config_1.coorPt2Idx(pt, size),
                    oldColor: config_1.VertexT.EMPTY,
                    color: color,
                });
            }
        }
    };
    if (ab) {
        populate(ab, config_1.VertexT.BLACK);
    }
    if (aw) {
        populate(aw, config_1.VertexT.WHITE);
    }
    return buildBoardDiff(vs, NONPT_HASH);
}
exports.buildSetupDiff = buildSetupDiff;
function IdentityDiff() {
    var vs = [];
    return {
        vs: vs,
        hashCode: NONPT_HASH,
    };
}
function buildInitialNode() {
    var node = {
        diff: IdentityDiff(),
        children: {},
        ruleData: {
            type: rule_1.NodeDataType.type0,
            symbolInfo: rule_1.buildEmptySymbolInfo(),
        },
    };
    node.parent = node;
    return node;
}
function copyVertices(data) {
    var d = new Uint8Array(data.length);
    for (var i = 0; i < d.length; ++i) {
        d[i] = data[i];
    }
    return d;
}
function getEmptyAnnotations(size) {
    var ret = [];
    for (var i = 0; i < size * size; ++i) {
        ret.push('');
    }
    return ret;
}
function buildState(c) {
    var node = buildInitialNode();
    var diff = buildSetupDiff(c.size, c.ab, c.aw);
    var board = buildEmptyBoard(c.size);
    applyBoardDiff(board, diff);
    var rootVertices = copyVertices(board.vertices);
    var weiqiRuleState = {
        currentK: 0,
        annotationCache: getEmptyAnnotations(c.size),
        hasEstimate: false,
        whiteEstimate: [],
        blackEstimate: [],
    };
    return {
        config: c,
        showHandCount: 1,
        curr: board,
        ruleState: weiqiRuleState,
        whoPlay: config_1.VertexT.BLACK,
        depth: 0,
        movesHashes: [],
        eatCounts: [0, 0],
        node: node,
        rootVertices: rootVertices,
        rootNode: node,
        cursor: getDefaultCursor(),
        showShixiaDaan: false,
        showVersion: 0,
        penMode: new pen_1.PenMode(),
    };
}
exports.buildState = buildState;
function buildShixiaState(s, whoPlay) {
    var b = {
        size: s.curr.size,
        vertices: copyVertices(s.curr.vertices)
    };
    var weiqiRuleState = {
        currentK: 0,
        annotationCache: getEmptyAnnotations(s.config.size),
        hasEstimate: false,
        whiteEstimate: [],
        blackEstimate: [],
    };
    var node = buildInitialNode();
    return {
        config: s.config,
        showHandCount: "all",
        depth: 0,
        movesHashes: [],
        eatCounts: [],
        curr: b,
        ruleState: weiqiRuleState,
        node: node,
        rootNode: node,
        rootVertices: copyVertices(b.vertices),
        cursor: {
            show: true,
            type: 'pt',
            onQipan: false,
        },
        whoPlay: whoPlay,
        showShixiaDaan: false,
        showVersion: 0,
        penMode: new pen_1.PenMode(),
    };
}
exports.buildShixiaState = buildShixiaState;
function applyBoardDiff(b, d) {
    for (var _i = 0, _a = d.vs; _i < _a.length; _i++) {
        var v = _a[_i];
        b.vertices[v.index] = v.color;
    }
    if (d.ruleData && d.ruleData.type === rule_1.NodeDataType.type1) {
        var data = d.ruleData;
        if (data.color === config_1.VertexT.BLACK) {
            return [data.eatNum, 0];
        }
        else if (data.color === config_1.VertexT.WHITE) {
            return [0, data.eatNum];
        }
    }
    return [0, 0];
}
exports.applyBoardDiff = applyBoardDiff;
function expandNode(n, d) {
    var partialNode = {
        diff: d,
        parent: n,
        children: {},
    };
    if (n.firstChildHash === void 0) {
        n.firstChildHash = d.hashCode;
    }
    if (d.ruleData === void 0) {
        console.error("expandNode diff hhas no data");
        return;
    }
    partialNode.ruleData = d.ruleData;
    var newNode = partialNode;
    n.children[d.hashCode] = newNode;
    return newNode;
}
function updateMoveHashes(s) {
    if (s.movesHashes.length !== s.depth) {
        console.error("updateMoveHashes");
        return;
    }
    var curr = s.node;
    while (curr.firstChildHash) {
        s.movesHashes.push(curr.firstChildHash);
        curr = curr.children[curr.firstChildHash];
    }
}
function nextState(s, diff) {
    if (s.movesHashes.length > s.depth) {
        var nextHash = s.movesHashes[s.depth];
        if (nextHash === diff.hashCode) {
            var n = s.node.children[nextHash];
            if (n) {
                ++s.depth;
                s.node = n;
            }
            else {
                console.error("nextState null node ", s.depth, s.movesHashes);
                return;
            }
        }
        else {
            s.movesHashes = s.movesHashes.slice(0, s.depth);
            var n = s.node.children[diff.hashCode];
            if (n) {
                s.node = n;
            }
            else {
                var n2 = expandNode(s.node, diff);
                if (n2) {
                    s.node = n2;
                }
                else {
                    console.error("nextState ", diff);
                    return;
                }
            }
            ++s.depth;
            s.movesHashes.push(diff.hashCode);
            updateMoveHashes(s);
        }
    }
    else if (s.movesHashes.length === s.depth) {
        ++s.depth;
        s.movesHashes.push(diff.hashCode);
        if (s.node.children[diff.hashCode]) {
            console.error("nextState should not have child node");
            return;
        }
        var node = expandNode(s.node, diff);
        if (node) {
            s.node = node;
        }
        else {
            console.error("nextState ", diff);
            return;
        }
    }
    else {
        console.error("nextState state movehashes length error");
        return;
    }
    {
        var _a = applyBoardDiff(s.curr, diff), beat = _a[0], weat = _a[1];
        s.eatCounts[0] += beat;
        s.eatCounts[1] += weat;
    }
}
exports.nextState = nextState;
function nextStateType2(s, ruleData) {
    var diff = buildSetupDiff(s.config.size, ruleData.black, ruleData.white);
    diff.ruleData = ruleData;
    applyBoardDiff(s.curr, diff);
    var currNode = s.node;
    var children = {};
    var newNode = {
        ruleData: ruleData,
        diff: diff,
        parent: currNode,
        firstChildHash: currNode.firstChildHash,
        children: currNode.children,
    };
    for (var k in newNode.children) {
        var cn = newNode.children[k];
        cn.parent = newNode;
    }
    children[NONPT_HASH] = newNode;
    currNode.children = children;
    currNode.firstChildHash = NONPT_HASH;
    s.node = newNode;
    {
        var k = s.depth;
        var moves = s.movesHashes.slice(0, k);
        moves.push(NONPT_HASH);
        s.movesHashes = moves.concat(s.movesHashes.slice(k, s.movesHashes.length));
        s.depth += 1;
    }
}
exports.nextStateType2 = nextStateType2;
function nextStateWithoutDiff(s) {
    if (s.movesHashes.length > s.depth) {
        var nextHash = s.movesHashes[s.depth];
        var nextNode = s.node.children[nextHash];
        if (nextNode) {
            ++s.depth;
            s.node = nextNode;
            {
                var _a = applyBoardDiff(s.curr, nextNode.diff), beat = _a[0], weat = _a[1];
                s.eatCounts[0] += beat;
                s.eatCounts[1] += weat;
            }
        }
        else {
            console.error("nextStateWithoutDiff no nextNode ", s.movesHashes, s.depth, s.node.children);
            return;
        }
    }
    else {
        console.error("nextStateWithoutDiff");
        return;
    }
}
exports.nextStateWithoutDiff = nextStateWithoutDiff;
function buildDiff2Parent(s) {
    var vs = [];
    for (var _i = 0, _a = s.node.diff.vs; _i < _a.length; _i++) {
        var v = _a[_i];
        vs.push({
            index: v.index,
            oldColor: v.color,
            color: v.oldColor,
        });
    }
    var hashCode = getHashCode(vs, s.curr.size);
    var oriRuleData = s.node.diff.ruleData;
    var ruleData = void 0;
    if (oriRuleData && oriRuleData.type === rule_1.NodeDataType.type1) {
        var d = oriRuleData;
        ruleData = {
            type: rule_1.NodeDataType.type1,
            symbolInfo: d.symbolInfo,
            ko: d.ko,
            pt: d.pt,
            color: d.color,
            anno: d.anno,
            eatNum: -d.eatNum,
        };
    }
    return {
        vs: vs,
        hashCode: hashCode,
        ruleData: ruleData,
    };
}
function prevState(s) {
    if (s.depth === 0) {
        console.error("prevState depth 0");
        return;
    }
    var diff = buildDiff2Parent(s);
    s.depth--;
    {
        var _a = applyBoardDiff(s.curr, diff), beat = _a[0], weat = _a[1];
        s.eatCounts[0] += beat;
        s.eatCounts[1] += weat;
    }
    s.node = s.node.parent;
}
exports.prevState = prevState;
function resetToRoot(s) {
    s.depth = 0;
    s.curr.vertices = copyVertices(s.rootVertices);
    s.node = s.rootNode;
    var weiqiRuleState = {
        currentK: 0,
        annotationCache: getEmptyAnnotations(s.config.size),
        hasEstimate: false,
        whiteEstimate: [],
        blackEstimate: [],
    };
    s.ruleState = weiqiRuleState;
}
exports.resetToRoot = resetToRoot;
function updateCursor(s, r, rawx, rawy) {
    var qpRect = render_1.getQipanRectLastRender(r);
    if (qpRect === "NO_LAST_RENDER") {
        console.log('no qpRect');
        s.cursor.onQipan = false;
        return;
    }
    var rawxy2xy = function (z, gz, z0) {
        return Math.floor(z / gz + 0.5) + z0;
    };
    var x = rawxy2xy((rawx) * qpRect.scale - qpRect.gOrigX, qpRect.squareW, qpRect.rx1);
    var y = rawxy2xy((rawy) * qpRect.scale - qpRect.gOrigY, qpRect.squareH, qpRect.ry1);
    if (x < qpRect.rx1 || x > qpRect.rx2 || y < qpRect.ry1 || y > qpRect.ry2) {
        s.cursor.onQipan = false;
    }
    else {
        var show = s.cursor.show;
        var type = s.cursor.type;
        s.cursor = {
            show: show, type: type,
            onQipan: true,
            pt: { x: x, y: y, }
        };
    }
}
exports.updateCursor = updateCursor;
function computeAnnotations(s) {
    var weiqiState = s.ruleState;
    return weiqiState.annotationCache;
}
exports.computeAnnotations = computeAnnotations;

},{"./config":1,"./pen":4,"./render":6,"./rule":7}],9:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var rule_1 = require("./rule");
var qipan_1 = require("./qipan");
var state_1 = require("./state");
var config_1 = require("./config");
var util_1 = require("./util");
var wqipan_1 = require("./wqipan");
function getPtFromTimuData(d, k) {
    if (d.daans.length > 0) {
        var daan = d.daans[0];
        if (k < daan.data.length) {
            return daan.data[k].pt;
        }
        else {
            console.error("getPtFromTimuData k " + k + " >= daan len");
            return;
        }
    }
    else {
        console.error("getPtFromTimuData 0 daans");
        return;
    }
}
exports.getPtFromTimuData = getPtFromTimuData;
function parseBujvInfo(xds, size) {
    if (!((xds instanceof Array) && (xds.length > 0))) {
        return void 0;
    }
    var result = [];
    for (var _i = 0, xds_1 = xds; _i < xds_1.length; _i++) {
        var xd = xds_1[_i];
        var pts = util_1.parseSgfPtLst([xd.pt], size);
        if (pts.length !== 1 || pts[0] === "PASS") {
            console.warn("xds parse pt fail", xd.pt);
            continue;
        }
        result.push({
            pt: pts[0],
            name: xd.name,
            score: xd.score,
        });
    }
    return result;
}
exports.parseBujvInfo = parseBujvInfo;
function getPts(sgfpts, size) {
    if (!((sgfpts instanceof Array) && (sgfpts.length > 0))) {
        return void 0;
    }
    var result = [];
    var pts = util_1.parseSgfPtLst(sgfpts, size);
    for (var _i = 0, pts_1 = pts; _i < pts_1.length; _i++) {
        var pt = pts_1[_i];
        if (pt === "PASS") {
            console.error("getPts pass ", sgfpts);
        }
        else {
            result.push(pt);
        }
    }
    return result;
}
exports.getPts = getPts;
function buildTimuConfig(config, qdata) {
    var size = (qdata.lu >= 2 && qdata.lu <= 19) ? qdata.lu : config.size;
    config.size = size;
    var c = config;
    c.goodDaans = [];
    c.varDaans = [];
    c.badDaans = [];
    var addDas = function (daans, rawDas, type) {
        for (var _i = 0, rawDas_1 = rawDas; _i < rawDas_1.length; _i++) {
            var rawDaan = rawDas_1[_i];
            var data = util_1.parseSgfPtLst(rawDaan, size).map(function (pt) {
                return { pt: pt };
            });
            var daan = {
                data: data,
                type: type,
            };
            daans.push(daan);
        }
    };
    if (qdata &&
        (qdata.ok_answers instanceof Array) &&
        (qdata.change_answers instanceof Array) &&
        (qdata.fail_answers instanceof Array)) {
        addDas(c.goodDaans, qdata.ok_answers, state_1.ShixiaColor.BLUE);
        addDas(c.varDaans, qdata.change_answers, state_1.ShixiaColor.GREEN);
        addDas(c.badDaans, qdata.fail_answers, state_1.ShixiaColor.RED);
    }
    else {
        console.error('qdata error', qdata);
        return;
    }
    c.whoPlayFirst = (qdata.blackfirst) ? config_1.VertexT.BLACK : config_1.VertexT.WHITE;
    c.bujvTimuInfo = parseBujvInfo(qdata.xds, size);
    c.luoziTimuInfo = getPts(qdata.luozis, size);
    c.permanentTriangles = getPts(qdata.signs, size);
    return c;
}
exports.buildTimuConfig = buildTimuConfig;
function processDaan(tm, da, color) {
    for (var _i = 0, _a = da.data; _i < _a.length; _i++) {
        var dpt = _a[_i];
        var diff = tm.wqp.placePtNode(dpt.pt);
        tm.wqp.switchSide();
        dpt.diff = diff;
        {
            var node = tm.wqp.qipan.state.node;
            if (node.timuData) {
                if (color !== state_1.ShixiaColor.NOCOLOR) {
                    node.timuData.color = color;
                }
                node.timuData.daans.push(da);
            }
            else {
                node.timuData = {
                    daans: [da],
                    color: color,
                };
            }
        }
    }
}
function addDaan(tm, da, color) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            tm.daans.push(da);
            processDaan(tm, da, color);
            tm.reset();
            return [2];
        });
    });
}
exports.DOING = 0;
exports.CORRECT = 1;
exports.WRONG = 2;
function resultFromShixiaColor(c) {
    if (c === state_1.ShixiaColor.BLUE) {
        return exports.CORRECT;
    }
    else {
        return exports.WRONG;
    }
}
var TLEGAL = 1;
function setupDaans(timu, tc) {
    timu.daans = [];
    for (var _i = 0, _a = [
        [tc.varDaans, state_1.ShixiaColor.GREEN],
        [tc.badDaans, state_1.ShixiaColor.RED],
        [tc.goodDaans, state_1.ShixiaColor.BLUE],
    ]; _i < _a.length; _i++) {
        var t = _a[_i];
        var daans = t[0];
        var color = t[1];
        for (var _b = 0, daans_1 = daans; _b < daans_1.length; _b++) {
            var daan = daans_1[_b];
            addDaan(timu, daan, color);
        }
    }
}
function setupTimu(timu, ctx, config) {
    timu.config = config;
    timu.wqp = new wqipan_1.WeiQipan(ctx, config, config.whoPlayFirst);
    timu.setWhoFirst(config.whoPlayFirst);
    timu.setMode("INVAL");
    setupDaans(timu, config);
}
function getResponse(node, depth) {
    if (!node.timuData || node.timuData.daans.length === 0) {
        return { result: exports.WRONG };
    }
    var goodDaans = node.timuData.daans.filter(function (da) { return (da.type === state_1.ShixiaColor.BLUE); });
    var goodOrBadDaans = (goodDaans.length > 0) ? goodDaans :
        node.timuData.daans.filter(function (da) { return (da.type === state_1.ShixiaColor.RED); });
    var N = goodOrBadDaans.length;
    if (N === 0) {
        return { result: exports.WRONG };
    }
    var daanIdx = Math.floor(Math.random() * N);
    var daan = goodOrBadDaans[daanIdx];
    var daanData = daan.data;
    if (depth > daanData.length) {
        console.error("getResponse depth > daan.length " + depth + ", " + daanData.length);
        return;
    }
    if (depth === daanData.length) {
        return {
            result: resultFromShixiaColor(daan.type)
        };
    }
    else {
        var result = (depth === daanData.length - 1) ?
            resultFromShixiaColor(daan.type) : exports.DOING;
        var daanPt = daanData[depth];
        if (!daanPt.diff) {
            console.error("getResponse no pt diff");
            return;
        }
        return {
            result: result,
            pt: daanPt.pt,
            d: daanPt.diff,
        };
    }
}
function callDoTimuCbWithResultPair(cb, rp) {
    if (rp.tag === wqipan_1.TILLEGAL) {
        cb(rp);
        return;
    }
    var ret = {
        pts: rp.pts.slice(),
        result: rp.result,
    };
    if (rp.isPair) {
        var firstLen = rp.pts.length - 1;
        cb({ pts: rp.pts.slice(0, firstLen), result: exports.DOING });
        cb(ret);
    }
    else {
        cb(ret);
    }
}
function getDoTimuCtrl(timu, cb, pts) {
    var preCheck = function (c) {
        if (timu.mode === "PLAY" && timu.ctrl === c) {
            if (!timu.needConfirm) {
                return "ERROR";
            }
            else if (timu.wqp.qipan.state.candidate) {
                return void 0;
            }
            else {
                return "NO_PT";
            }
        }
        else {
            return "ERROR";
        }
    };
    return {
        tag: "CONFIRM",
        confirm: function () {
            var preCheckRet = preCheck(this);
            if (preCheckRet)
                return preCheckRet;
            var pt = timu.wqp.qipan.state.candidate.pt;
            timu.wqp.qipan.state.candidate = void 0;
            var resultPair = timu.confirmPlayThenRender(pt, pts);
            if (resultPair) {
                callDoTimuCbWithResultPair(cb, resultPair);
            }
            else {
                console.error("confirmPlayThenRender no result");
            }
            return "OK";
        },
        adjust: function (direction) {
            var preCheckRet = preCheck(this);
            if (preCheckRet)
                return preCheckRet;
            var pt = timu.wqp.qipan.state.candidate.pt;
            if (direction === "UP") {
                if (pt.y === timu.config.y1) {
                    return "FAILED";
                }
                else {
                    pt.y--;
                }
            }
            else if (direction === "DOWN") {
                if (pt.y === timu.config.y2) {
                    return "FAILED";
                }
                else {
                    pt.y++;
                }
            }
            else if (direction === "LEFT") {
                if (pt.x === timu.config.x1) {
                    return "FAILED";
                }
                else {
                    pt.x--;
                }
            }
            else if (direction === "RIGHT") {
                if (pt.x === timu.config.x2) {
                    return "FAILED";
                }
                else {
                    pt.x++;
                }
            }
            else {
                return "ERROR";
            }
            pt.idx = void 0;
            timu.wqp.qipan.doRender();
            return "OK";
        },
        setDoConfirm: function () {
            timu.needConfirm = true;
        },
        setNoConfirm: function () {
            timu.needConfirm = false;
            timu.wqp.qipan.state.candidate = void 0;
            timu.wqp.qipan.doRender();
        }
    };
}
function setupBujvTimu(t, choices) {
    var s = t.wqp.qipan.state;
    var data = s.node.ruleData;
    data.symbolInfo.permanentSymbols = [];
    for (var _i = 0, choices_1 = choices; _i < choices_1.length; _i++) {
        var c = choices_1[_i];
        data.symbolInfo.permanentSymbols.push({
            pt: c.pt,
            text: c.name,
        });
        if (c.score === 10) {
            t.wqp.placePtNode(c.pt);
            if (s.node.timuData == void 0) {
                console.warn("bujv score-10 choice has no daan");
            }
            t.reset();
        }
    }
}
function checkPtsSamePrefix(pts, timuPts) {
    for (var i = 0; i < timuPts.length; ++i) {
        if (pts[i].x !== timuPts[i].x || pts[i].y !== timuPts[i].y) {
            return false;
        }
    }
    return true;
}
function doSyncPlay(timu, pts) {
    var size = timu.config.size;
    var luoziTimuInfo = (timu.config.luoziTimuInfo && timu.config.luoziTimuInfo.length > 0) ?
        timu.wqp.qipan.state.timuInfo : void 0;
    for (var i = timu.doTimuPts.length; i < pts.length; ++i) {
        timu.doTimuPts.push(pts[i]);
        if (luoziTimuInfo) {
            var idx = config_1.coorPt2Idx(pts[i], size);
            if (luoziTimuInfo.luoziState[idx] === false) {
                luoziTimuInfo.luoziState[idx] = true;
                luoziTimuInfo.luoziCount--;
            }
            else {
                luoziTimuInfo.luoziCount = 0;
            }
        }
        else {
            timu.wqp.placePtNode(pts[i]);
            timu.wqp.switchSide();
        }
    }
}
function genShixiaCtrl(timu, dn) {
    var ctrl = {
        tag: "SHIXIA",
        daan: dn,
        next: function () {
            if (timu.mode !== "SHIXIA") {
                console.error("shixia.next timu mode ", timu.mode);
                return;
            }
            if (timu.wqp.timu === void 0) {
                timu.wqp.nextThenRender(1);
                return;
            }
            if (timu.wqp.qipan.state.depth >= dn.data.length) {
                return;
            }
            var pt = dn.data[timu.wqp.qipan.state.depth].pt;
            timu.wqp.placePtNode(pt);
            timu.wqp.switchSide();
            timu.wqp.qipan.doRender();
        },
        prev: function () {
            if (timu.mode !== "SHIXIA") {
                console.error("shixia.prev timu mode ", timu.mode);
                return;
            }
            if (timu.wqp.timu === void 0) {
                timu.wqp.prevThenRender(1);
                return;
            }
            timu.wqp.prev();
            timu.wqp.qipan.doRender();
        },
        gotoStart: function () {
            if (timu.mode !== "SHIXIA") {
                console.error("shixia.gotoStart timu mode ", timu.mode);
                return;
            }
            timu.reset();
        },
        gotoEnd: function () {
            if (timu.mode !== "SHIXIA") {
                console.error("shixia.gotoEnd timu mode ", timu.mode);
                return;
            }
            for (var i = timu.wqp.qipan.state.depth; i < dn.data.length; ++i) {
                var pt = dn.data[i].pt;
                timu.wqp.placePtNode(pt);
                timu.wqp.switchSide();
            }
            timu.wqp.qipan.doRender();
        },
    };
    return ctrl;
}
function handleBujv(timu, pt) {
    var choices = timu.config.bujvTimuInfo;
    if (choices && choices.length > 0) {
        var size = timu.config.size;
        var result = {
            tag: TLEGAL,
            pts: [config_1.coorPt2Sgf(pt, size)],
            result: exports.WRONG,
            isPair: false,
        };
        for (var _i = 0, choices_2 = choices; _i < choices_2.length; _i++) {
            var choice = choices_2[_i];
            if (pt.x == choice.pt.x && pt.y == choice.pt.y && choice.score >= 10) {
                result.result = exports.CORRECT;
            }
        }
        return result;
    }
    else {
        return void 0;
    }
}
function handleLuozi(timu, pt, pts) {
    var size = timu.config.size;
    var idx = config_1.coorPt2Idx(pt, size);
    var s = timu.wqp.qipan.state;
    if (s.timuInfo === void 0) {
        console.error('handleLuozi timuInfo void');
        return undefined;
    }
    var luoziState = s.timuInfo.luoziState;
    if (luoziState[idx] === true || s.timuInfo.luoziCount === 0) {
        return undefined;
    }
    pts.push(pt);
    var sgfPts = pts.map(function (pt) { return config_1.coorPt2Sgf(pt, size); });
    var resultPair = {
        tag: TLEGAL,
        pts: sgfPts,
        result: exports.WRONG,
        isPair: false,
    };
    if (luoziState[idx] === false) {
        s.timuInfo.luoziCount--;
        luoziState[idx] = true;
        resultPair.result = (s.timuInfo.luoziCount === 0) ? exports.CORRECT : exports.DOING;
    }
    if (luoziState[idx] === void 0) {
        s.timuInfo.luoziCount = 0;
    }
    timu.wqp.qipan.doRender();
    return resultPair;
}
function setupLuoziInfo(timu, answer) {
    var s = timu.wqp.qipan.state;
    var luoziState = {};
    for (var _i = 0, answer_1 = answer; _i < answer_1.length; _i++) {
        var pt = answer_1[_i];
        var idx = config_1.coorPt2Idx(pt, s.config.size);
        luoziState[idx] = false;
    }
    s.timuInfo = {
        luoziState: luoziState,
        luoziCount: answer.length,
    };
}
var Timu = (function () {
    function Timu(wqp, config) {
        this.config = config;
        this.whoFirst = config_1.VertexT.BLACK;
        this.wqp = wqp;
        this.wqp.qipan.state.showHandCount = "all";
        this.setWhoFirst(config.whoPlayFirst);
        this.daans = [];
        this.doTimuPts = [];
        this.mode = "INVAL";
        this.setMode("INVAL");
        setupDaans(this, config);
        if (config.bujvTimuInfo && config.bujvTimuInfo.length > 0) {
            setupBujvTimu(this, config.bujvTimuInfo);
        }
        if (config.luoziTimuInfo && config.luoziTimuInfo.length > 0) {
            setupLuoziInfo(this, config.luoziTimuInfo);
        }
    }
    Timu.prototype.setWhoFirst = function (color) {
        this.whoFirst = color;
        this.wqp.qipan.state.whoPlay = color;
    };
    Timu.prototype.setQData = function (qdata) {
        var audioOnOff = this.wqp.qipan.state.config.audioOn;
        var newConfig = qipan_1.buildConfigFromQData(this.config.width, this.config.height, this.config.scale, this.config.isRemoteControlled, qdata);
        if (newConfig === void 0) {
            return;
        }
        var timuConfig = buildTimuConfig(newConfig, qdata);
        if (timuConfig === void 0) {
            return;
        }
        setupTimu(this, this.wqp.qipan.render.ctx, timuConfig);
        (audioOnOff !== void 0) && (this.setAudio(audioOnOff));
    };
    Timu.prototype.setMode = function (md) {
        this.mode = md;
        if (md === "PLAY" || md === "SHIXIA") {
            this.wqp.qipan.state.cursor.show = true;
        }
        else {
            this.wqp.qipan.state.cursor.show = false;
        }
        this.needConfirm = void 0;
        this.ctrl = void 0;
        this.wqp.qipan.state.candidate = void 0;
        this.wqp.qipan.state.showShixiaDaan = false;
    };
    Timu.prototype.focusDaan = function (k) {
        if (k >= this.daans.length) {
            return;
        }
        this.currDaan = {
            daan: this.daans[k],
            step: 0,
        };
        this.reset();
    };
    Timu.prototype.getSize = function () {
        return this.wqp.config.size;
    };
    Timu.prototype.setAnswer = function (rawPts) {
        var timu = this;
        timu.reset();
        var pts = util_1.parseSgfPtLst(rawPts, timu.getSize()).map(function (pt) { return { pt: pt }; });
        var da = {
            data: pts,
            type: state_1.ShixiaColor.NOCOLOR,
        };
        timu.setMode("SHIXIA");
        timu.wqp.qipan.state.cursor.show = false;
        timu.ctrl = genShixiaCtrl(timu, da);
        return timu.ctrl;
    };
    Timu.prototype.startWatchTimu = function () {
        this.setMode("WATCH");
        this.reset();
    };
    Timu.prototype.syncWatch = function (rawPts, onlySyncLatest) {
        if (onlySyncLatest === void 0) { onlySyncLatest = true; }
        if (this.mode !== "WATCH") {
            return;
        }
        if (onlySyncLatest && (rawPts.length <= this.wqp.qipan.state.depth)) {
            return;
        }
        this.reset();
        try {
            var pts = util_1.parseSgfPtLst(rawPts, this.getSize());
            var data = pts.map(function (pt) { return { pt: pt }; });
            var daan = {
                data: data,
                type: state_1.ShixiaColor.NOCOLOR,
            };
            processDaan(this, daan, state_1.ShixiaColor.NOCOLOR);
        }
        finally {
            this.wqp.qipan.doRender();
        }
    };
    Timu.prototype.syncShixia = function (data) {
        var timu = this;
        if (timu.mode !== "SHIXIA") {
            console.warn("syncShixia timu not in SHIXIA mode");
            return;
        }
        if (!!!(timu.ctrl && timu.ctrl.tag === "SHIXIA")) {
            console.warn("syncShixia timu no shixiaCtrl");
            return;
        }
        var daan = timu.ctrl.daan;
        if (data.pts.length === 0) {
            console.warn("syncShixia pts length == 0", data);
        }
        var pts = util_1.parseSgfPtLst(data.pts, this.getSize());
        {
            var wqp = timu.wqp;
            timu.ctrl.gotoStart();
            daan.data = [];
            for (var i = 0; i < pts.length; ++i) {
                if (wqp.hasPt(pts[i])) {
                    continue;
                }
                daan.data.push({
                    pt: pts[i]
                });
                wqp.placePtNode(pts[i]);
                wqp.switchSide();
            }
        }
    };
    Timu.prototype.syncPlay = function (anyData) {
        var timu = this;
        if (timu.mode !== "PLAY") {
            console.warn("syncPlay timu not in PLAY mode");
            return;
        }
        if (!((anyData.result !== void 0) &&
            (anyData.pts instanceof Array) &&
            (anyData.pts.length > 0))) {
            console.warn("syncPlay data error", anyData);
            return;
        }
        var data = anyData;
        var pts = util_1.parseSgfPtLst(data.pts, this.getSize());
        if (pts.length >= this.doTimuPts.length) {
            if (!checkPtsSamePrefix(pts, this.doTimuPts)) {
                console.error("syncPlay ", pts, this.doTimuPts);
            }
            doSyncPlay(this, pts);
        }
    };
    Timu.prototype.startDoTimuWithConfirm = function (cb, needConfirm) {
        if (needConfirm === void 0) { needConfirm = true; }
        this.doTimuPts = [];
        this.setMode("PLAY");
        this.needConfirm = needConfirm;
        var timu = this;
        this.wqp.timu = timu;
        this.startDoTimuInternal(cb, this.doTimuPts);
        var ctrl = getDoTimuCtrl(timu, cb, this.doTimuPts);
        this.ctrl = ctrl;
        return ctrl;
    };
    Timu.prototype.confirmPlayThenRender = function (pt, pts) {
        if (this.config.luoziTimuInfo) {
            return handleLuozi(this, pt, pts);
        }
        var rule = rule_1.getWeiqiRule();
        var timu = this;
        var isLegal = rule.isLegal(pt, this.wqp.qipan.state, timu.whoFirst);
        if ("Legal" !== isLegal) {
            return isLegal;
        }
        var d = timu.wqp.placePtNode(pt);
        timu.wqp.qipan.setAudioType(d);
        if (this.config.bujvTimuInfo && this.config.bujvTimuInfo.length > 0) {
            if (pts.length > 0) {
                console.error("bujv pts.length == 0");
                return void 0;
            }
            return handleBujv(this, pt);
        }
        var state = timu.wqp.qipan.state;
        var response = getResponse(state.node, state.depth);
        if (response === void 0) {
            return;
        }
        pts.push(pt);
        if (response.result !== exports.DOING) {
            timu.wqp.setTimuOnClick(void 0, "PLAY");
        }
        var isPair = false;
        if (response.d && response.pt) {
            timu.wqp.placePtNode(response.pt, response.d);
            timu.wqp.qipan.setAudioType(d);
            pts.push(response.pt);
            isPair = true;
        }
        timu.wqp.qipan.playAudio();
        timu.wqp.qipan.doRender();
        var size = timu.getSize();
        var sgfPts = pts.map(function (pt) { return config_1.coorPt2Sgf(pt, size); });
        return {
            tag: TLEGAL,
            pts: sgfPts,
            result: response.result,
            isPair: isPair,
        };
    };
    Timu.prototype.startDoTimuInternal = function (cb, pts) {
        var config = this.config;
        if (config.luoziTimuInfo && config.luoziTimuInfo.length > 0) {
            setupLuoziInfo(this, config.luoziTimuInfo);
        }
        var timu = this;
        var cbInternal = function (result) {
            if (timu.needConfirm) {
                console.error("Should not callback while confirm");
            }
            else {
                callDoTimuCbWithResultPair(cb, result);
            }
        };
        this.reset();
        this.wqp.setTimuOnClick(function (pt) {
            if (timu.mode === "PLAY" && timu.needConfirm) {
                timu.wqp.qipan.state.candidate = {
                    pt: pt,
                    color: timu.whoFirst,
                };
                timu.wqp.qipan.doRender();
                return;
            }
            else {
                var result = timu.confirmPlayThenRender(pt, pts);
                if (result) {
                    cbInternal(result);
                }
                else {
                    console.error("confirmPlayThenRender no result");
                }
            }
        }, "PLAY");
    };
    Timu.prototype.startShixia = function (cb, showDaan) {
        var _this = this;
        if (showDaan === void 0) { showDaan = false; }
        this.config.luoziTimuInfo && setupLuoziInfo(this, this.config.luoziTimuInfo);
        var rule = rule_1.getWeiqiRule();
        this.setMode("SHIXIA");
        this.reset();
        this.wqp.qipan.state.showShixiaDaan = showDaan;
        var timu = this;
        this.wqp.timu = timu;
        var size = timu.getSize();
        var daan = {
            data: [],
            type: state_1.ShixiaColor.NOCOLOR,
        };
        var otherColor = (timu.whoFirst === config_1.VertexT.BLACK) ? config_1.VertexT.WHITE : config_1.VertexT.BLACK;
        this.wqp.setTimuOnClick(function (pt) {
            var who = timu.wqp.qipan.state.whoPlay;
            var isLegal = rule.isLegal(pt, timu.wqp.qipan.state, who);
            if ("Legal" !== isLegal) {
                cb(isLegal);
                return;
            }
            daan.data = daan.data.slice(0, timu.wqp.qipan.state.depth);
            var diff = _this.wqp.placePtNode(pt);
            timu.wqp.switchSide();
            daan.data.push({
                pt: pt,
                diff: diff,
            });
            timu.wqp.qipan.setAudioType(diff);
            timu.wqp.qipan.playAudio();
            var ret = {
                pts: daan.data.map(function (d) { return config_1.coorPt2Sgf(d.pt, size); }),
                result: exports.DOING,
            };
            cb(ret);
            timu.wqp.qipan.doRender();
        }, "SHIXIA");
        this.ctrl = genShixiaCtrl(timu, daan);
        return this.ctrl;
    };
    Timu.prototype.setAudio = function (onoff) {
        this.wqp.qipan.setAudio(onoff);
    };
    Timu.prototype.reset = function () {
        this.wqp.reset(this.whoFirst);
    };
    return Timu;
}());
exports.Timu = Timu;

},{"./config":1,"./qipan":5,"./rule":7,"./state":8,"./util":10,"./wqipan":12}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
exports.parseSgfPtLst = function (raw, size, set) {
    var sgfCoor = config_1.getSgfCoor(size);
    var parseSgfPt = function (rawPt) {
        if (rawPt.length !== 2) {
            throw new Error("point length !== 2");
        }
        var lowerPt = rawPt.toLowerCase();
        var coor = function (raw) {
            var k = sgfCoor.indexOf(raw);
            if (k >= 0) {
                return k;
            }
            else {
                throw new Error("coordinate overflow " + raw + " " + sgfCoor);
            }
        };
        return {
            x: coor(lowerPt[0]),
            y: coor(lowerPt[1]),
        };
    };
    var ret = [];
    try {
        for (var _i = 0, raw_1 = raw; _i < raw_1.length; _i++) {
            var rawPt = raw_1[_i];
            var lowerRawPt = rawPt.toLowerCase();
            if (lowerRawPt === "tt") {
                ret.push("PASS");
            }
            else if (set && lowerRawPt in set) {
                throw new Error("duplicate setup");
            }
            else {
                set && (set[lowerRawPt] = true);
                ret.push(parseSgfPt(lowerRawPt));
            }
        }
    }
    catch (error) {
        console.error('parseSgfPtLst ', raw, size, set, error);
    }
    return ret;
};
function processDuplicate(rawAb, rawAw) {
    var rawAb2 = [];
    var rawAw2 = [];
    var set = {};
    for (var _i = 0, rawAw_1 = rawAw; _i < rawAw_1.length; _i++) {
        var pt = rawAw_1[_i];
        if (!set[pt]) {
            set[pt] = true;
            rawAw2.push(pt);
        }
    }
    for (var _a = 0, rawAb_1 = rawAb; _a < rawAb_1.length; _a++) {
        var pt = rawAb_1[_a];
        if (!set[pt]) {
            set[pt] = true;
            rawAb2.push(pt);
        }
    }
    return {
        rawAb2: rawAb2, rawAw2: rawAw2,
    };
}
exports.processDuplicate = processDuplicate;
function parseSetupCoor(rawAb, rawAw, size) {
    var ptSet = {};
    try {
        return {
            ab: exports.parseSgfPtLst(rawAb, size, ptSet),
            aw: exports.parseSgfPtLst(rawAw, size, ptSet),
        };
    }
    catch (e) {
        console.error(e);
        return {
            ab: [],
            aw: [],
        };
    }
}
exports.parseSetupCoor = parseSetupCoor;
var COORX = "ABCDEFGHJKLMNOPQRST";
function parseGTPCoor(gtpPt, size) {
    if (gtpPt.length > 3) {
        console.error("parseGTPCoor " + gtpPt);
        return;
    }
    var xAlpha = gtpPt[0].toUpperCase();
    var x = COORX.indexOf(xAlpha);
    if (x < 0) {
        console.error("parseGTPCoor " + gtpPt);
        return;
    }
    var y = Number(gtpPt.slice(1));
    if (y <= 0 || y > size) {
        console.error("parseGTPCoor " + gtpPt);
        return;
    }
    return {
        x: x,
        y: size - y
    };
}
exports.parseGTPCoor = parseGTPCoor;
function coorPt2Gtp(pt, size) {
    var coorx = COORX[pt.x];
    var coory = size - pt.y;
    return "" + coorx + coory;
}
exports.coorPt2Gtp = coorPt2Gtp;
function test202(text, key) {
    var s = atob(text);
    var j = 0;
    var ret = [];
    for (var i = 0; i < s.length; ++i) {
        ret.push(String.fromCharCode(s.charCodeAt(i) ^ key.charCodeAt(j)));
        j = (j + 1) % key.length;
    }
    return ret.join('');
}
exports.test202 = test202;

},{"./config":1}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
var qipan_1 = require("./qipan");
var timu_1 = require("./timu");
var debug_1 = require("./debug");
var util_1 = require("./util");
var state_1 = require("./state");
var wqipan_1 = require("./wqipan");
var game_1 = require("./game");
var render_1 = require("./render");
var pen_1 = require("./pen");
var util_2 = require("./util");
exports.parseGTPCoor = util_2.parseGTPCoor;
exports.createCanvasEl = function (className) {
    var el = document.createElement("canvas");
    if (className) {
        el.className = className;
    }
    el.style.position = "absolute";
    el.style.top = "0";
    el.style.width = "100%";
    el.style.height = "100%";
    return el;
};
var qipanDoms = [];
function triggerResize() {
    var _loop_1 = function (qd) {
        var qp = qd.qp;
        if (qp) {
            setTimeout(function () {
                var rect = qd.wrap.getBoundingClientRect();
                qd.rect = rect;
                var config = qp.state.config;
                config.width = rect.width * config.scale;
                config.height = rect.height * config.scale;
                var canvas = qd.canvas;
                canvas.width = config.width;
                canvas.height = config.height;
                config.qipanRect = void 0;
                config.qipanRect = render_1.getQipanRect(qp.state);
                qp.doRender();
            });
        }
    };
    for (var _i = 0, qipanDoms_1 = qipanDoms; _i < qipanDoms_1.length; _i++) {
        var qd = qipanDoms_1[_i];
        _loop_1(qd);
    }
}
exports.triggerResize = triggerResize;
window.onresize = triggerResize;
function attachListeners(e, qd) {
    e.addEventListener("mousemove", function (event) {
        var qp = qd.qp;
        if (qp) {
            if (qp.state.penMode.mode === pen_1.PenDrawMode.DRAW) {
                var ctx = qp.render.ctx;
                qp.state.penMode.mousemove(ctx, event.offsetX, event.offsetY, qp.state.config);
            }
            else {
                state_1.updateCursor(qp.state, qp.render, event.offsetX, event.offsetY);
                if (qp.state.cursor.show) {
                    qp.doRender();
                }
            }
        }
    });
    e.addEventListener("mouseout", function () {
        var qp = qd.qp;
        if (qp) {
            qp.state.cursor.onQipan = false;
            qp.doRender();
        }
    });
    e.addEventListener("mouseup", function (event) {
        var qp = qd.qp;
        if (qp) {
            if (qp.state.penMode.mode === pen_1.PenDrawMode.DRAW) {
                qp.state.penMode.mouseup();
            }
            else {
                qp.onTap(event.offsetX, event.offsetY, event.button);
            }
        }
    });
    e.addEventListener("mousedown", function (event) {
        var qp = qd.qp;
        if (qp) {
            if (qp.state.penMode.mode === pen_1.PenDrawMode.DRAW) {
                var ctx = qp.render.ctx;
                qp.state.penMode.mousedown(ctx, event.offsetX, event.offsetY, qp.state.config);
            }
        }
    });
    var getTouchHandler = function (type) {
        return function (event) {
            if (type === "move") {
                event.preventDefault();
            }
            var qp = qd.qp;
            var touches = event.changedTouches;
            if (qp) {
                var rect = qd.rect;
                if (qp.state.penMode.mode === pen_1.PenDrawMode.DRAW) {
                    if (touches.length > 0) {
                        var touch = touches[0];
                        var offsetX = touch.pageX - rect.left;
                        var offsetY = touch.pageY - rect.top;
                        var ctx = qp.render.ctx;
                        if (type === "move") {
                            qp.state.penMode.mousemove(ctx, offsetX, offsetY, qp.state.config);
                        }
                        else {
                            qp.state.penMode.mousedown(ctx, offsetX, offsetY, qp.state.config);
                        }
                    }
                }
            }
        };
    };
    e.addEventListener("touchstart", getTouchHandler("start"));
    e.addEventListener("touchmove", getTouchHandler("move"));
    e.addEventListener("contextmenu", function (event) {
        event.preventDefault();
    });
    e.addEventListener("touchend", function () {
        var qp = qd.qp;
        if (qp) {
            setTimeout(function () {
                qp.state.cursor.onQipan = false;
                qp.doRender();
            }, 10);
        }
    });
}
function attachAudioV2(element) {
    webAudioConfigV2.useV2 = true;
    for (var _i = 0, _a = ['eat1', 'eat2', 'place']; _i < _a.length; _i++) {
        var name_1 = _a[_i];
        var audio = new Audio();
        var url = name_1 + "Url";
        (webAudioConig[url]) && (audio.src = webAudioConig[url]);
        audio.preload = "";
        webAudioConfigV2[name_1] = audio;
        element.appendChild(audio);
    }
}
function attachAudioV2AfterSetUrl(element) {
    if (webAudioConig.eat1Url && (webAudioConig.eat1Url.indexOf("eat1") >= 0)) {
        attachAudioV2(element);
    }
    else {
        webAudioConig.needAttachV2Element = element;
    }
}
function getCanvasCtx(element, width, height, rect, loadAudioV2) {
    if (loadAudioV2 === void 0) { loadAudioV2 = true; }
    {
        for (var _i = 0, qipanDoms_2 = qipanDoms; _i < qipanDoms_2.length; _i++) {
            var dom = qipanDoms_2[_i];
            if (dom.wrap === element) {
                return dom;
            }
        }
    }
    element.innerHTML = "";
    element.classList.add("qp-wrap");
    var canvas = exports.createCanvasEl("qp-canvas");
    canvas.width = width;
    canvas.height = height;
    element.appendChild(canvas);
    if (loadAudioV2) {
        webAudioConfigV2.useV2 = true;
        attachAudioV2AfterSetUrl(element);
    }
    else {
        webAudioConfigV2.useV2 = false;
        if (webAudioConig.attached) {
            webAudioConig.audio = new Audio();
        }
        else {
            webAudioConig.attached = true;
        }
    }
    var ctxOrNull = canvas.getContext('2d');
    if (!ctxOrNull) {
        throw new Error("failed getContext");
    }
    var ctx = ctxOrNull;
    ctx.ctxType = config_1.CtxType.WEB;
    var qipanDom = {
        rect: rect,
        wrap: element,
        canvas: canvas,
        ctx: ctx,
        idx: qipanDoms.length,
    };
    ctx.updateQipan = function (qp) {
        if (qp !== qipanDom.qp) {
            qipanDom.qp = qp;
        }
    };
    attachListeners(canvas, qipanDom);
    qipanDoms.push(qipanDom);
    return qipanDom;
}
var webScale = devicePixelRatio;
function buildConfig41011(rawDaan, width, height) {
    var size = 19;
    var rawAb = ["af", "al", "am", "ao", "aq", "ar", "ba", "bd", "bj", "bl", "bn", "bp", "br",
        "bs", "ck", "cm", "cq", "cs", "dj", "dl", "do", "dr", "ei", "ek", "ep", "es", "fh",
        "fj", "fn", "fr", "gg", "gi", "gm", "gq", "gs", "hf", "hh", "hl", "hp", "hr", "hs",
        "ib", "ie", "ig", "ik", "io", "iq", "jd", "jf", "jj", "jn", "jp", "js", "kc", "ke",
        "ki", "km", "ko", "lc", "ld", "lh", "ll", "ln", "ma", "md", "mg", "mk", "mm", "mp",
        "ne", "nf", "nj", "nl", "ns", "oa", "of", "ok", "os", "pb", "pd", "pg", "ph", "pj",
        "pr", "qe", "qh", "qi", "rk", "sc", "sd", "se", "sf"];
    var rawAw = ["ac", "bc", "bo", "cn", "co", "cp", "dm", "dn", "dq", "el", "em", "en", "eq",
        "er", "fk", "fl", "fo", "fp", "fq", "ga", "gj", "gk", "go", "gp", "ha", "hi", "hj",
        "hn", "ho", "ih", "ii", "im", "in", "jg", "jh", "jl", "jm", "kf", "kg", "kk", "kl",
        "le", "lf", "lj", "lk", "me", "mi", "mj", "nc", "nh", "ni", "nq", "nr", "og", "oh",
        "oj", "oq", "pf", "pi", "qa", "qf", "qs", "rb", "re", "sb", "sl", "sm", "sr", "ss"];
    var abawWithPass = util_1.parseSetupCoor(rawAb, rawAw, size);
    var ab = wqipan_1.filterPass(abawWithPass.ab);
    var aw = wqipan_1.filterPass(abawWithPass.aw);
    var daanData = util_1.parseSgfPtLst(rawDaan, size).map(function (pt) {
        return { pt: pt };
    });
    var daan = {
        data: daanData,
        type: state_1.ShixiaColor.BLUE,
    };
    return {
        isRemoteControlled: false,
        whoPlayFirst: config_1.VertexT.BLACK,
        size: size, width: width, height: height,
        rotation: config_1.RotateDeg.deg0,
        scale: webScale,
        ab: ab, aw: aw,
        goodDaans: [daan],
        badDaans: [],
        varDaans: [],
        x1: 0, x2: 18, y1: 0, y2: 18,
    };
}
exports.buildConfig41011 = buildConfig41011;
function runWithSize(element, size) {
    var rect = element.getBoundingClientRect();
    var scale = webScale;
    var config = {
        isRemoteControlled: false,
        whoPlayFirst: config_1.VertexT.BLACK,
        size: size,
        width: rect.width * scale,
        height: rect.height * scale,
        rotation: config_1.RotateDeg.deg0,
        scale: scale,
        x1: 0, x2: size - 1,
        y1: 0, y2: size - 1,
        showCoor: true,
    };
    var qd = getCanvasCtx(element, config.width, config.height, rect);
    return new qipan_1.Qipan(qd.ctx, config);
}
exports.runWithSize = runWithSize;
function getDebug() {
    return debug_1.debug;
}
exports.getDebug = getDebug;
var getSquareBox = function (x1, x2, y1, y2, size) {
    while (x2 - x1 > y2 - y1 && y1 > 0) {
        --y1;
    }
    while (x2 - x1 > y2 - y1 && y2 < size - 1) {
        ++y2;
    }
    while (x2 - x1 < y2 - y1 && x1 > 0) {
        --x1;
    }
    while (x2 - x1 < y2 - y1 && x2 < size - 1) {
        ++x2;
    }
    return {
        x1: x1, x2: x2,
        y1: y1, y2: y2,
    };
};
function buildTimu(element, rawAb, rawAw, rawGoodDas, rawBadDas, rawVarDas, size, x1, x2, y1, y2, whoPlayFirst, shouldSquare, bujvInfo, luozis, signs) {
    if (size === void 0) { size = 19; }
    if (x1 === void 0) { x1 = 0; }
    if (x2 === void 0) { x2 = 18; }
    if (y1 === void 0) { y1 = 0; }
    if (y2 === void 0) { y2 = 18; }
    if (whoPlayFirst === void 0) { whoPlayFirst = config_1.VertexT.BLACK; }
    if (shouldSquare === void 0) { shouldSquare = false; }
    if (bujvInfo === void 0) { bujvInfo = []; }
    if (luozis === void 0) { luozis = []; }
    if (signs === void 0) { signs = []; }
    var _a = util_1.processDuplicate(rawAb, rawAw), rawAb2 = _a.rawAb2, rawAw2 = _a.rawAw2;
    var abawWithPass = util_1.parseSetupCoor(rawAb2, rawAw2, 19);
    var ab = wqipan_1.filterPass(abawWithPass.ab);
    var aw = wqipan_1.filterPass(abawWithPass.aw);
    var goodDaans = [];
    var badDaans = [];
    var varDaans = [];
    var addDas = function (daans, rawDas, type) {
        for (var _i = 0, rawDas_1 = rawDas; _i < rawDas_1.length; _i++) {
            var rawDaan = rawDas_1[_i];
            var daan = {
                data: util_1.parseSgfPtLst(rawDaan, size).map(function (pt) {
                    return { pt: pt };
                }),
                type: type,
            };
            daans.push(daan);
        }
    };
    addDas(goodDaans, rawGoodDas, state_1.ShixiaColor.BLUE);
    addDas(badDaans, rawBadDas, state_1.ShixiaColor.RED);
    addDas(varDaans, rawVarDas, state_1.ShixiaColor.GREEN);
    var box = (shouldSquare) ?
        getSquareBox(x1, x2, y1, y2, size) :
        {
            x1: x1, x2: x2, y1: y1, y2: y2
        };
    var rect = element.getBoundingClientRect();
    var scale = webScale;
    var config = {
        isRemoteControlled: false,
        whoPlayFirst: whoPlayFirst,
        size: size,
        width: rect.width * scale,
        height: rect.height * scale,
        rotation: config_1.RotateDeg.deg0,
        scale: scale,
        ab: ab,
        aw: aw,
        goodDaans: goodDaans,
        badDaans: badDaans,
        varDaans: varDaans,
        x1: box.x1, x2: box.x2,
        y1: box.y1, y2: box.y2,
    };
    if (bujvInfo.length > 0) {
        config.bujvTimuInfo = bujvInfo;
    }
    if (luozis.length > 0) {
        config.luoziTimuInfo = luozis;
    }
    if (signs.length > 0) {
        config.permanentTriangles = signs;
    }
    var qd = getCanvasCtx(element, config.width, config.height, rect, true);
    var wqp = new wqipan_1.WeiQipan(qd.ctx, config, config.whoPlayFirst);
    var tm = new timu_1.Timu(wqp, config);
    qd.qp = tm.wqp.qipan;
    return tm;
}
exports.buildTimu = buildTimu;
function buildTimu101(element, d101) {
    game_1.test123(d101);
    var bujvInfo = timu_1.parseBujvInfo(d101.xds, d101.lu);
    var luozis = timu_1.getPts(d101.luozis, d101.lu);
    var signs = timu_1.getPts(d101.signs, d101.lu);
    return buildTimu(element, d101.content[0], d101.content[1], d101.ok_answers, d101.fail_answers, d101.change_answers, d101.lu, d101.pos_x1, d101.pos_x2, d101.pos_y1, d101.pos_y2, (d101.blackfirst) ? config_1.VertexT.BLACK : config_1.VertexT.WHITE, true, bujvInfo, luozis, signs);
}
exports.buildTimu101 = buildTimu101;
function buildQipuThumbnail(element, qipu) {
    var size = qipu.lu;
    var rect = element.getBoundingClientRect();
    var scale = webScale;
    var whoPlayFirst = (qipu && qipu.blackfirst) ? config_1.VertexT.BLACK : config_1.VertexT.WHITE;
    var config = {
        isRemoteControlled: true,
        whoPlayFirst: whoPlayFirst,
        size: size, x1: 0, x2: size - 1, y1: 0, y2: size - 1,
        rotation: config_1.RotateDeg.deg0,
        width: rect.width * scale,
        height: rect.height * scale,
        scale: webScale,
    };
    var qd = getCanvasCtx(element, config.width, config.height, rect);
    var wqp = new wqipan_1.WeiQipan(qd.ctx, config);
    wqp.qipan.state.showHandCount = -1000;
    qd.qp = wqp.qipan;
    var gdata = game_1.buildInitGameData(qipu);
    game_1.placeNonPtNodeList(wqp, gdata.ab, config_1.VertexT.BLACK);
    game_1.placeNonPtNodeList(wqp, gdata.aw, config_1.VertexT.WHITE);
    wqp.qipan.state.whoPlay = gdata.whoFirst;
    var moves = (qipu.step) ? gdata.moves.slice(0, qipu.step) : gdata.moves;
    game_1.processMoves(wqp, moves);
    return wqp;
}
exports.buildQipuThumbnail = buildQipuThumbnail;
function buildTimuThumbnail(element, qdata0) {
    game_1.test123(qdata0);
    var qdata = qdata0;
    var size = qdata.lu;
    var rect = element.getBoundingClientRect();
    var scale = webScale;
    var box = getSquareBox(qdata.pos_x1, qdata.pos_x2, qdata.pos_y1, qdata.pos_y2, size);
    var config = {
        isRemoteControlled: true,
        whoPlayFirst: config_1.VertexT.BLACK,
        size: size, x1: box.x1, x2: box.x2, y1: box.y1, y2: box.y2,
        rotation: config_1.RotateDeg.deg0,
        width: rect.width * scale,
        height: rect.height * scale,
        scale: webScale,
    };
    var qd = getCanvasCtx(element, config.width, config.height, rect);
    var wqp = new wqipan_1.WeiQipan(qd.ctx, config);
    wqp.qipan.state.showHandCount = -1000;
    qd.qp = wqp.qipan;
    {
        wqp.qipan.state.whoPlace = config_1.VertexT.BLACK;
        var pts = util_1.parseSgfPtLst(qdata.content[0], size);
        for (var _i = 0, pts_1 = pts; _i < pts_1.length; _i++) {
            var pt = pts_1[_i];
            (pt !== "PASS") && wqp.placeNonPtNode(pt);
        }
        wqp.qipan.state.whoPlace = config_1.VertexT.WHITE;
        pts = util_1.parseSgfPtLst(qdata.content[1], size);
        for (var _a = 0, pts_2 = pts; _a < pts_2.length; _a++) {
            var pt = pts_2[_a];
            (pt !== "PASS") && wqp.placeNonPtNode(pt);
        }
    }
    return wqp;
}
exports.buildTimuThumbnail = buildTimuThumbnail;
function buildWeiQipan(element) {
    var size = 19;
    var rect = element.getBoundingClientRect();
    var scale = webScale;
    var config = {
        isRemoteControlled: false,
        whoPlayFirst: config_1.VertexT.BLACK,
        size: size, x1: 0, x2: 18, y1: 0, y2: 18,
        rotation: config_1.RotateDeg.deg0,
        width: rect.width * scale,
        height: rect.height * scale,
        scale: webScale,
    };
    var qd = getCanvasCtx(element, config.width, config.height, rect);
    var wqp = new wqipan_1.WeiQipan(qd.ctx, config);
    qd.qp = wqp.qipan;
    wqp.setPlaceOrPlay(function (pt) {
        console.log(pt);
    });
    return wqp;
}
exports.buildWeiQipan = buildWeiQipan;
function buildGame(element, gdata, theme) {
    var size = gdata.size;
    var rect = element.getBoundingClientRect();
    var scale = webScale;
    var config = {
        isRemoteControlled: false,
        whoPlayFirst: gdata.whoFirst,
        size: size, x1: 0, x2: size - 1, y1: 0, y2: size - 1,
        rotation: config_1.RotateDeg.deg0,
        width: rect.width * scale,
        height: rect.height * scale,
        scale: webScale,
        ab: util_1.parseSgfPtLst(gdata.ab, size),
        aw: util_1.parseSgfPtLst(gdata.aw, size),
    };
    var qd = getCanvasCtx(element, config.width, config.height, rect, true);
    var game = new game_1.Game(qd.ctx, config, gdata);
    qd.qp = game.wqp.qipan;
    if (theme !== "wood" && theme !== "kttheme") {
        theme = "wood";
    }
    game.wqp.qipan.useTheme(theme);
    return game;
}
exports.buildGame = buildGame;
function buildGame101(element, qipuData, theme) {
    if (theme === void 0) { theme = "kttheme"; }
    var data = game_1.buildInitGameData(qipuData);
    return buildGame(element, data, theme);
}
exports.buildGame101 = buildGame101;
var webAudioConig = {
    audio: new Audio(),
    attached: false,
    needAttachV2Element: void 0,
};
var webAudioConfigV2 = {
    useV2: true,
};
function setAudioURL(eat1, eat2, place) {
    webAudioConig.eat1Url = eat1;
    webAudioConig.eat2Url = eat2;
    webAudioConig.placeUrl = place;
    if (webAudioConig.needAttachV2Element) {
        var e = webAudioConig.needAttachV2Element;
        webAudioConig.needAttachV2Element = void 0;
        attachAudioV2(e);
    }
}
exports.setAudioURL = setAudioURL;
window.onload = function () {
    setTimeout(function () {
        setAudioURL('https://static2.101weiqi.com/static/media/neweat1.mp3', 'https://static2.101weiqi.com/static/media/neweat2.mp3', 'https://static2.101weiqi.com/static/media/newfirststone.mp3');
    });
};
function getAudioSrc(src) {
    if (src.indexOf('eat1') >= 0) {
        if (webAudioConig.eat1Url) {
            return webAudioConig.eat1Url;
        }
        else {
            console.error("getAudioSrc");
            return;
        }
    }
    if (src.indexOf('eat2') >= 0) {
        if (webAudioConig.eat2Url) {
            return webAudioConig.eat2Url;
        }
        else {
            console.error("getAudioSrc");
            return;
        }
    }
    if (src.indexOf('firststone') >= 0) {
        if (webAudioConig.placeUrl) {
            return webAudioConig.placeUrl;
        }
        else {
            console.error("getAudioSrc");
            return;
        }
    }
    console.error("getAudioSrc");
    return;
}
function getAudioEleV2(src) {
    if (src.indexOf('eat1') >= 0) {
        if (webAudioConfigV2.eat1) {
            return webAudioConfigV2.eat1;
        }
        else {
            console.error("getAudioEleV2");
            return void 0;
        }
    }
    if (src.indexOf('eat2') >= 0) {
        if (webAudioConfigV2.eat2) {
            return webAudioConfigV2.eat2;
        }
        else {
            console.error("getAudioEleV2");
            return void 0;
        }
    }
    if (src.indexOf('firststone') >= 0) {
        if (webAudioConfigV2.place) {
            return webAudioConfigV2.place;
        }
        else {
            console.error("getAudioEleV2");
            return void 0;
        }
    }
    console.error("getAudioEleV2");
    return void 0;
}
function getWebAudioCtx() {
    var onEndCallback = void 0;
    var ctx = {
        src: '',
        play: function () {
            if (webAudioConfigV2.useV2) {
                var audio = getAudioEleV2(ctx.src);
                if (audio === void 0) {
                    return;
                }
                audio.onended = function () {
                    onEndCallback && onEndCallback();
                };
                
                if (audio.play) {
                    audio.play().catch(error => {
                        // 当播放异常时，走异常流程
                    });
                }
            }
            else {
                var audio = webAudioConig.audio;
                if (audio) {
                    var src = getAudioSrc(ctx.src);
                    if (src === void 0) {
                        return;
                    }
                    audio.src = src;
                    audio.onended = function () {
                        onEndCallback && onEndCallback();
                    };
                    audio.play().catch(error => {
                        // 当播放异常时，走异常流程
                    });
                }
            }
        },
        onEnded: function (cb) {
            onEndCallback = cb;
        },
    };
    return ctx;
}
exports.getWebAudioCtx = getWebAudioCtx;
exports.qipanWoodTheme = {
    use: false,
    loaded: false,
    qipan: new Image(),
    black: new Image(),
    white: new Image(),
    onLoad: function () { },
};
function loadImages() {
    var prefix = location.origin;
    exports.qipanWoodTheme.qipan.src = prefix + '/static/assets/images/wood/board.png';
    exports.qipanWoodTheme.black.src = prefix + '/static/assets/images/wood/black2.png';
    exports.qipanWoodTheme.white.src = prefix + '/static/assets/images/wood/white2.png';
    var imgs = [
        exports.qipanWoodTheme.qipan,
        exports.qipanWoodTheme.black,
        exports.qipanWoodTheme.white
    ];
    var loadedCount = 0;
    for (var _i = 0, imgs_1 = imgs; _i < imgs_1.length; _i++) {
        var img = imgs_1[_i];
        img.addEventListener('load', function () {
            ++loadedCount;
            if (loadedCount === imgs.length) {
                exports.qipanWoodTheme.loaded = true;
                exports.qipanWoodTheme.onLoad();
            }
        });
    }
}
exports.loadImages = loadImages;
function useKtTheme() {
    useBgStyle("kt");
}
exports.useKtTheme = useKtTheme;
function addBgStyle(name, picUrl, cb) {
    var namekey = name + "bg";
    if (namekey in qipan_1.allBgStyles) {
        cb(name);
        return;
    }
    var img = new Image();
    img.addEventListener('load', function () {
        var style = {
            bgType: qipan_1.BgStyle.img,
            img: img,
        };
        qipan_1.allBgStyles[namekey] = style;
        cb(name);
    });
    img.src = picUrl;
}
exports.addBgStyle = addBgStyle;
function addDrawBgStyle(name, qipanColor, borderColor) {
    var namekey = name + "bg";
    if (namekey in qipan_1.allBgStyles) {
        console.error("addBgStyle existed name ", name);
        return;
    }
    var style = {
        bgType: qipan_1.BgStyle.draw,
        outerBorder: borderColor,
        qipan: qipanColor,
        symbolBg: qipanColor,
    };
    qipan_1.allBgStyles[namekey] = style;
}
exports.addDrawBgStyle = addDrawBgStyle;
function addPtStyle(name, picUrl, cb) {
    var namekey = name + "pt";
    if (namekey in qipan_1.allPtStyles) {
        cb(name);
        return;
    }
    var img = new Image();
    img.addEventListener('load', function () {
        var style = {
            ptType: qipan_1.PtStyle.img,
            img: img,
        };
        qipan_1.allPtStyles[namekey] = style;
        cb(name);
    });
    img.src = picUrl;
}
exports.addPtStyle = addPtStyle;
function usePtStyle(black, white) {
    var bkey = black + "pt";
    var wkey = white + "pt";
    if (!qipan_1.setPtStyle(bkey, config_1.VertexT.BLACK)) {
        console.warn("useBgStyle ", bkey, " failed");
    }
    if (!qipan_1.setPtStyle(wkey, config_1.VertexT.WHITE)) {
        console.warn("useBgStyle ", wkey, " failed");
    }
    triggerResize();
}
exports.usePtStyle = usePtStyle;
function useBgStyle(name) {
    var namekey = name + "bg";
    if (!qipan_1.setBgStyle(namekey)) {
        console.warn("useBgStyle ", name, " failed");
    }
    triggerResize();
}
exports.useBgStyle = useBgStyle;
function useCustomQipanColor(color) {
    var bg = qipan_1.allBgStyles['custombg'];
    bg.qipan = color;
    bg.outerBorder = color;
    useBgStyle('custom');
}
exports.useCustomQipanColor = useCustomQipanColor;
function setLineColor(color) {
    qipan_1.qipanNonPicTheme.line = color;
}
exports.setLineColor = setLineColor;

},{"./config":1,"./debug":2,"./game":3,"./pen":4,"./qipan":5,"./render":6,"./state":8,"./timu":9,"./util":10,"./wqipan":12}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
var qipan_1 = require("./qipan");
var state_1 = require("./state");
var rule_1 = require("./rule");
var util_1 = require("./util");
var render_1 = require("./render");
function filterPass(ps) {
    var ret = [];
    for (var _i = 0, ps_1 = ps; _i < ps_1.length; _i++) {
        var pt = ps_1[_i];
        if (pt === "PASS") {
            console.error("should not have PASS");
        }
        else {
            ret.push(pt);
        }
    }
    return ret;
}
exports.filterPass = filterPass;
exports.TILLEGAL = 2;
var ClickMode;
(function (ClickMode) {
    ClickMode[ClickMode["DISABLE"] = 0] = "DISABLE";
    ClickMode[ClickMode["Candidate"] = 1] = "Candidate";
    ClickMode[ClickMode["Play"] = 2] = "Play";
    ClickMode[ClickMode["Place"] = 3] = "Place";
    ClickMode[ClickMode["PlaceSymbol"] = 4] = "PlaceSymbol";
    ClickMode[ClickMode["VoteStu"] = 5] = "VoteStu";
})(ClickMode = exports.ClickMode || (exports.ClickMode = {}));
function legalPlay(pt, wqp) {
    var rule = rule_1.getWeiqiRule();
    var who = wqp.qipan.state.whoPlay;
    {
        var isLegal = rule.isLegal(pt, wqp.qipan.state, who);
        if (isLegal === "Legal") {
            wqp.placePtNode(pt);
            wqp.qipan.doRender();
        }
        return isLegal;
    }
}
function getVoteChoices(wqp) {
    var ret = {};
    if (wqp.timu && wqp.timu.config.bujvTimuInfo) {
        for (var _i = 0, _a = wqp.timu.config.bujvTimuInfo; _i < _a.length; _i++) {
            var choice = _a[_i];
            var idx = config_1.coorPt2Idx(choice.pt, wqp.config.size);
            ret[idx] = choice.name;
        }
    }
    else {
        var data = wqp.qipan.state.node.ruleData;
        for (var i = 0; i < data.symbolInfo.alaSymbols.length; ++i) {
            var pt = data.symbolInfo.alaSymbols[i];
            var idx = config_1.coorPt2Idx(pt, wqp.config.size);
            ret[idx] = render_1.ALPHABET[i % render_1.ALPHABET.length];
        }
    }
    if (Object.keys(ret).length > 0) {
        return ret;
    }
    else {
        return void 0;
    }
}
function handleVoteClick(pt, wqp) {
    var voteInfo = wqp.qipan.state.voteInfo;
    if (!voteInfo || !wqp.voteCb) {
        console.error('no voteinfo');
        return;
    }
    if (wqp.hasPt(pt)) {
        return;
    }
    var choices = getVoteChoices(wqp);
    var size = wqp.config.size;
    var choice = void 0;
    if (choices) {
        var idx = config_1.coorPt2Idx(pt, size);
        if (choices[idx]) {
            choice = choices[idx];
        }
        else {
            return;
        }
    }
    voteInfo.pt = pt;
    wqp.clickMode = (voteInfo.clickModeBackup === void 0) ?
        ClickMode.DISABLE : voteInfo.clickModeBackup;
    if (voteInfo.cursorTypeBackup !== void 0) {
        wqp.qipan.state.cursor.type = voteInfo.cursorTypeBackup;
    }
    wqp.voteCb(util_1.coorPt2Gtp(pt, size), choice);
    wqp.qipan.doRender();
}
function userPlayPt(pt, wqp) {
    var isLegal = legalPlay(pt, wqp);
    if (wqp.clickCb) {
        if (isLegal === "Legal") {
            wqp.clickCb(pt);
            wqp.switchSide();
        }
        else {
            wqp.clickCb(isLegal);
        }
    }
    else {
        console.warn("wqipan onPlayClick no callback");
    }
}
exports.userPlayPt = userPlayPt;
function onPlayClick(pt, wqp) {
    if (wqp.needConfirm) {
        if (!!!wqp.hasPt(pt)) {
            wqp.qipan.state.candidate = {
                pt: pt,
                color: wqp.getWhoPlay(),
            };
            wqp.qipan.doRender();
        }
    }
    else {
        userPlayPt(pt, wqp);
    }
}
function onClick(pt, wqp) {
    if (wqp.clickMode === ClickMode.VoteStu) {
        handleVoteClick(pt, wqp);
        return;
    }
    if (wqp.qipan.state.config.isRemoteControlled) {
        return;
    }
    if (wqp.timu) {
        if (wqp.timu.mode === "PLAY") {
            wqp.timuPlayCb && wqp.timuPlayCb(pt);
        }
        else if (wqp.timu.mode === "SHIXIA") {
            if (wqp.clickMode === ClickMode.PlaceSymbol) {
                wqp.placeSymbol(pt);
                wqp.clickCb && wqp.clickCb(pt);
            }
            else {
                wqp.timuShixiaCb && wqp.timuShixiaCb(pt);
            }
        }
        return;
    }
    if (wqp.clickMode === ClickMode.Play) {
        onPlayClick(pt, wqp);
    }
    else if (wqp.clickMode === ClickMode.Place) {
        if (wqp.clickCb) {
            wqp.placeNonPtNode(pt);
            wqp.clickCb(pt, wqp.qipan.state.whoPlace);
        }
    }
    else if (wqp.clickMode === ClickMode.PlaceSymbol) {
        wqp.placeSymbol(pt);
        wqp.clickCb && wqp.clickCb(pt);
    }
}
function getSeqFromState(seq, state) {
    var rseq = [];
    var node = state.node;
    while (node.ruleData.type === rule_1.NodeDataType.type1) {
        var d = node.ruleData;
        rseq.push(d.pt);
        node = node.parent;
    }
    for (var i = rseq.length - 1; i >= 0; --i) {
        seq.push(rseq[i]);
    }
}
function type2RuleDataRemovePt(d, pt, size) {
    var idx = config_1.coorPt2Idx(pt, size);
    var remotePt = function (pts) {
        for (var i = 0; i < pts.length; ++i) {
            if (config_1.coorPt2Idx(pts[i], size) === idx) {
                pts.splice(i, 1);
                return true;
            }
        }
        return false;
    };
    if (remotePt(d.black)) {
        return true;
    }
    return remotePt(d.white);
}
function diffVertexRemovePt(vs, pt, size) {
    var idx = config_1.coorPt2Idx(pt, size);
    for (var i = 0; i < vs.length; ++i) {
        if (vs[i].index === idx) {
            vs.splice(i, 1);
            return;
        }
    }
}
function modifyType2Node(data, pt, wqp) {
    var state = wqp.qipan.state;
    var diff = state.node.diff;
    if (state.whoPlace === void 0) {
        console.error("modifyType2Node whoPlace void");
        state.whoPlace = config_1.VertexT.BLACK;
    }
    var who = state.whoPlace;
    state_1.prevState(state);
    if (type2RuleDataRemovePt(data, pt, state.config.size)) {
        diffVertexRemovePt(diff.vs, pt, state.config.size);
    }
    else {
        if (wqp.hasPt(pt)) {
            console.error("modifyType2Node hasPt ", pt);
        }
        else {
            var pts = (who === config_1.VertexT.BLACK) ? data.black : data.white;
            pts.push(pt);
            var index = config_1.coorPt2Idx(pt, state.config.size);
            var dv = {
                index: index,
                oldColor: state.curr.vertices[index],
                color: who,
            };
            diff.vs.push(dv);
        }
    }
    state_1.nextState(state, diff);
}
function getNextColorNonType2(s) {
    var node = s.node;
    var d = node.ruleData;
    if (d.type === rule_1.NodeDataType.type0) {
        return s.config.whoPlayFirst;
    }
    else if (d.type === rule_1.NodeDataType.type1) {
        var d1 = d;
        return (d1.color === config_1.VertexT.BLACK) ? config_1.VertexT.WHITE : config_1.VertexT.BLACK;
    }
    else {
        console.error("getNextColorNonType2 ", s);
    }
    return config_1.VertexT.BLACK;
}
function addType2Node(state, nextPtColor, pt) {
    var ruleData = {
        type: rule_1.NodeDataType.type2,
        symbolInfo: rule_1.buildEmptySymbolInfo(),
        black: [],
        white: [],
        nextPtColor: nextPtColor,
    };
    if (state.whoPlace === config_1.VertexT.BLACK) {
        ruleData.black.push(pt);
    }
    else {
        ruleData.white.push(pt);
    }
    state_1.nextStateType2(state, ruleData);
}
var WeiQipan = (function () {
    function WeiQipan(ctx, config, whoPlay) {
        var wqp = this;
        this.config = config;
        this.clickCb = void 0;
        this.clickMode = ClickMode.DISABLE;
        config.showCoor = false;
        this.qipan = new qipan_1.Qipan(ctx, config);
        this.qipan.recomputeQipanRect();
        (whoPlay !== void 0) && (this.qipan.state.whoPlay = whoPlay);
        this.qipan.setPlayable(function (pt) {
            if (wqp.clickMode !== ClickMode.DISABLE) {
                onClick(pt, wqp);
            }
        });
        this.qipan.tryPlayAt2 = function (pt) {
            if (wqp.qipan.state.config.isRemoteControlled) {
                return;
            }
            if (wqp.clickMode === ClickMode.Place) {
                wqp.switchPlaceSide();
                onClick(pt, wqp);
                wqp.switchPlaceSide();
            }
        };
        this.qipan.setAudio(true);
    }
    WeiQipan.prototype.setTimuOnClick = function (cb, mode) {
        this.setClickMode(ClickMode.Play);
        if (mode === "PLAY") {
            this.timuPlayCb = cb;
        }
        else if (mode === "SHIXIA") {
            this.timuShixiaCb = cb;
        }
    };
    WeiQipan.prototype.getWhoPlay = function () {
        return this.qipan.state.whoPlay;
    };
    WeiQipan.prototype.setWhoPlay = function (blackfirst) {
        var who = (blackfirst) ? config_1.VertexT.BLACK : config_1.VertexT.WHITE;
        this.qipan.state.whoPlay = who;
    };
    WeiQipan.prototype.setPlaceOrPlay = function (cb, mode) {
        if (mode === void 0) { mode = ClickMode.Play; }
        this.timu = void 0;
        this.qipan.state.cursor.show = true;
        this.setClickMode(mode);
        this.clickCb = cb;
    };
    WeiQipan.prototype.placePtNode = function (pt, _diff) {
        var _this = this;
        var rule = rule_1.getWeiqiRule();
        var weiqiState = this.qipan.state.ruleState;
        var getRuleDiff = function () {
            var who = _this.qipan.state.whoPlay;
            return rule.buildRuleDiff(_this.qipan.state.curr, pt, who, weiqiState.currentK);
        };
        var diff = (_diff) ? _diff : getRuleDiff();
        this.nextWithPtData(diff);
        rule_1.updateAnnoCache(this.qipan.state);
        if (pt !== "PASS") {
            this.qipan.setAudioType(diff);
            this.qipan.playAudio();
        }
        this.qipan.state.cursor.onQipan = false;
        return diff;
    };
    WeiQipan.prototype.hasPt = function (pt) {
        var idx = config_1.coorPt2Idx(pt, this.config.size);
        return this.qipan.state.curr.vertices[idx] !== config_1.VertexT.EMPTY;
    };
    WeiQipan.prototype.placeNonPtNode = function (pt) {
        var state = this.qipan.state;
        var node = state.node;
        var nodeData = node.ruleData;
        if (nodeData.type === rule_1.NodeDataType.type2) {
            modifyType2Node(nodeData, pt, this);
        }
        else {
            if (this.hasPt(pt)) {
                console.error("placeNonPtNode hasPt ", pt);
            }
            else {
                var nextColor = getNextColorNonType2(state);
                addType2Node(state, nextColor, pt);
            }
        }
    };
    WeiQipan.prototype.switchSide = function () {
        var who = this.getWhoPlay();
        if (who === config_1.VertexT.BLACK) {
            this.qipan.state.whoPlay = config_1.VertexT.WHITE;
        }
        else {
            this.qipan.state.whoPlay = config_1.VertexT.BLACK;
        }
    };
    WeiQipan.prototype.switchPlaceSide = function () {
        var who = this.qipan.state.whoPlace;
        if (who === config_1.VertexT.BLACK) {
            this.qipan.state.whoPlace = config_1.VertexT.WHITE;
        }
        else {
            this.qipan.state.whoPlace = config_1.VertexT.BLACK;
        }
    };
    WeiQipan.prototype.playMove = function (pt) {
        legalPlay(pt, this);
    };
    WeiQipan.prototype.setCurrWhoPlay = function () {
        var s = this.qipan.state;
        if (s.node.ruleData) {
            if (s.node.ruleData.type === rule_1.NodeDataType.type1) {
                var nodeData = s.node.ruleData;
                s.whoPlay = (nodeData.color === config_1.VertexT.BLACK) ? config_1.VertexT.WHITE : config_1.VertexT.BLACK;
            }
            else if (s.node.ruleData.type === rule_1.NodeDataType.type2) {
                var nodeData = s.node.ruleData;
                s.whoPlay = nodeData.nextPtColor;
            }
            else {
                if (this.shixiaInfo) {
                    s.whoPlay = this.shixiaInfo.who;
                }
                else {
                    s.whoPlay = this.config.whoPlayFirst;
                }
            }
        }
        else {
            console.warn("no node ruledata warning");
            s.whoPlay = this.config.whoPlayFirst;
        }
    };
    WeiQipan.prototype.prev = function () {
        var s = this.qipan.state;
        if (s.depth > 0) {
            var nodeData = s.node.ruleData;
            if (nodeData.type === rule_1.NodeDataType.type1) {
                var weiqiState = this.qipan.state.ruleState;
                weiqiState.currentK--;
            }
            this.qipan.prev();
            this.setCurrWhoPlay();
            rule_1.updateAnnoCache(this.qipan.state);
        }
    };
    WeiQipan.prototype.nextWithPtData = function (d) {
        var sucess = this.qipan.next(d);
        if (sucess) {
            var s = this.qipan.state;
            var nodeData = s.node.ruleData;
            {
                if (nodeData.type === rule_1.NodeDataType.type1) {
                    var weiqiData = s.ruleState;
                    ++weiqiData.currentK;
                }
            }
        }
    };
    WeiQipan.prototype.gotoThenRender = function (k) {
        for (var i = 0; i < k; ++i) {
        }
        this.qipan.doRender();
    };
    WeiQipan.prototype.prevThenRender = function (k) {
        for (var i = 0; i < k; ++i) {
            this.prev();
        }
        this.qipan.doRender();
    };
    WeiQipan.prototype.nextThenRender = function (k) {
        for (var i = 0; i < k; ++i) {
            this.nextWithPtData();
        }
        this.setCurrWhoPlay();
        rule_1.updateAnnoCache(this.qipan.state);
        this.qipan.doRender();
    };
    WeiQipan.prototype.reset = function (whoFirst) {
        this.qipan.state.whoPlay = whoFirst;
        this.qipan.reset();
    };
    WeiQipan.prototype.beginShixia = function (cb) {
        if (this.shixiaInfo !== void 0) {
            console.error('wqipan already in shixia');
            return;
        }
        this.shixiaInfo = {
            stateBackup: this.qipan.state,
            clickMode: this.clickMode,
            clickCb: this.clickCb,
            who: this.getWhoPlay()
        };
        this.qipan.state = state_1.buildShixiaState(this.qipan.state, this.getWhoPlay());
        this.qipan.state.voteInfo = this.shixiaInfo.stateBackup.voteInfo;
        this.setPlaceOrPlay(cb);
        this.qipan.doRender();
    };
    WeiQipan.prototype.endShixia = function () {
        if (this.shixiaInfo) {
            this.qipan.state = this.shixiaInfo.stateBackup;
            {
                this.setClickMode(this.shixiaInfo.clickMode);
                this.clickCb = this.shixiaInfo.clickCb;
            }
            this.shixiaInfo = void 0;
            this.qipan.doRender();
        }
        else {
            console.error("endShixia");
        }
    };
    WeiQipan.prototype.isInShixia = function () {
        return (this.shixiaInfo === void 0) ? false : true;
    };
    WeiQipan.prototype.disableClick = function () {
        this.qipan.state.cursor.show = false;
        this.setClickMode(ClickMode.DISABLE);
    };
    WeiQipan.prototype.setEstimate = function (black, white) {
        var s = this.qipan.state.ruleState;
        s.hasEstimate = true;
        s.whiteEstimate = filterPass(util_1.parseSgfPtLst(white, this.config.size));
        s.blackEstimate = filterPass(util_1.parseSgfPtLst(black, this.config.size));
    };
    WeiQipan.prototype.hasEstimate = function () {
        var s = this.qipan.state.ruleState;
        return s.hasEstimate;
    };
    WeiQipan.prototype.startPlaceSymbolMode = function (type) {
        if (this.timu && this.timu.mode === "PLAY") {
            console.warn("wqp with PLAY mode timu can not startPlaceSymbol");
            return;
        }
        this.setClickMode(ClickMode.PlaceSymbol);
        var si = this.qipan.state.node.ruleData.symbolInfo;
        var size = this.config.size;
        if (type === rule_1.SymbolEnum.number) {
            for (var _i = 0, _a = si.numSymbols; _i < _a.length; _i++) {
                var pt = _a[_i];
                delete si.idx2sym[config_1.coorPt2Idx(pt, size)];
            }
            si.numSymbols = [];
        }
        else if (type === rule_1.SymbolEnum.alphabet) {
            for (var _b = 0, _c = si.alaSymbols; _b < _c.length; _b++) {
                var pt = _c[_b];
                delete si.idx2sym[config_1.coorPt2Idx(pt, size)];
            }
            si.alaSymbols = [];
        }
        this.qipan.state.cursor.type = type;
        this.qipan.state.cursor.show = true;
    };
    WeiQipan.prototype.setClickMode = function (mode) {
        this.clickMode = mode;
        if (mode !== ClickMode.PlaceSymbol && mode !== ClickMode.VoteStu) {
            this.qipan.state.cursor.type = 'pt';
        }
    };
    WeiQipan.prototype.clearSymbol = function (pt, sym) {
        var findPt = function (arr) {
            for (var i = 0; i < arr.length; ++i) {
                if (arr[i].x === pt.x && arr[i].y === pt.y) {
                    return i;
                }
            }
            throw new Error("clearSymbol pt not found ");
        };
        try {
            var si = this.qipan.state.node.ruleData.symbolInfo;
            if (sym === rule_1.SymbolEnum.number) {
                var k = findPt(si.numSymbols);
                si.numSymbols.splice(k, 1);
            }
            else if (sym === rule_1.SymbolEnum.alphabet) {
                var k = findPt(si.alaSymbols);
                si.alaSymbols.splice(k, 1);
            }
            else {
                var k = findPt(si.nonSeq);
                si.nonSeq.splice(k, 1);
                si.nonSeqSymbols.splice(k, 1);
            }
        }
        catch (error) {
            console.error('clearSymbol ', error);
        }
    };
    WeiQipan.prototype.placeSymbol = function (pt) {
        if (this.clickMode != ClickMode.PlaceSymbol && this.clickMode != ClickMode.VoteStu) {
            console.error("placeSymbol should be PlaceSymbol mode");
        }
        var s = this.qipan.state;
        var si = s.node.ruleData.symbolInfo;
        var cursorSymbol = ((this.clickMode == ClickMode.VoteStu) &&
            (this.qipan.state.voteInfo && this.qipan.state.voteInfo.cursorTypeBackup))
            ? this.qipan.state.voteInfo.cursorTypeBackup : s.cursor.type;
        if (cursorSymbol === 'pt' || cursorSymbol === 'vote') {
            console.error('wqipan placeSymbol ', cursorSymbol);
            return;
        }
        var idx = config_1.coorPt2Idx(pt, s.config.size);
        var shouldPlace = false;
        if (idx in si.idx2sym) {
            var sym = si.idx2sym[idx];
            if (sym !== cursorSymbol) {
                shouldPlace = true;
            }
            this.clearSymbol(pt, si.idx2sym[idx]);
            delete si.idx2sym[idx];
        }
        else {
            shouldPlace = true;
        }
        if (shouldPlace) {
            si.idx2sym[idx] = cursorSymbol;
            if (cursorSymbol === rule_1.SymbolEnum.number) {
                si.numSymbols.push(pt);
            }
            else if (cursorSymbol === rule_1.SymbolEnum.alphabet) {
                si.alaSymbols.push(pt);
            }
            else {
                si.nonSeq.push(pt);
                si.nonSeqSymbols.push(cursorSymbol);
            }
        }
    };
    WeiQipan.prototype.getPtSeq = function () {
        var seq = [];
        if (this.shixiaInfo) {
            getSeqFromState(seq, this.shixiaInfo.stateBackup);
            getSeqFromState(seq, this.qipan.state);
        }
        else {
            getSeqFromState(seq, this.qipan.state);
        }
        return seq;
    };
    WeiQipan.prototype.setVoteMode = function (type, cb) {
        if ((type === 'stu') && (!cb)) {
            console.error("setStuVoteMode fail void callback");
            return;
        }
        var voteInfo = this.qipan.state.voteInfo;
        if ((voteInfo) && (voteInfo.type === type)) {
            console.warn("setVoteMode error already in same voteMode ", voteInfo);
            return;
        }
        this.voteCb = cb;
        var newVoteInfo = state_1.initVoteInfo(type);
        if (type === 'stu') {
            newVoteInfo.clickModeBackup = this.clickMode;
            this.clickMode = ClickMode.VoteStu;
            newVoteInfo.cursorTypeBackup = this.qipan.state.cursor.type;
            this.qipan.state.cursor.type = 'vote';
        }
        else {
            this.exitVoteMode();
        }
        this.qipan.state.voteInfo = newVoteInfo;
    };
    WeiQipan.prototype.updateTeacherVoteMode = function (gtpPts) {
        var voteInfo = this.qipan.state.voteInfo;
        if (!voteInfo) {
            console.error('updateTeacherVoteMode');
            return;
        }
        if (voteInfo.type !== 'tea') {
            console.error('updateTeacherVoteMode ', voteInfo);
            return;
        }
        var size = this.config.size;
        voteInfo.count = {};
        var count = voteInfo.count;
        for (var _i = 0, gtpPts_1 = gtpPts; _i < gtpPts_1.length; _i++) {
            var gtpPt = gtpPts_1[_i];
            if (gtpPt in count) {
                ++(count[gtpPt].count);
            }
            else {
                var pt = util_1.parseGTPCoor(gtpPt, size);
                if (pt) {
                    count[gtpPt] = {
                        pt: pt,
                        count: 1
                    };
                }
            }
        }
    };
    WeiQipan.prototype.exitVoteMode = function () {
        var voteInfo = this.qipan.state.voteInfo;
        if (!voteInfo) {
            console.error('voteInfo void');
            return;
        }
        if (this.clickMode === ClickMode.VoteStu) {
            this.clickMode = (voteInfo.clickModeBackup === void 0)
                ? ClickMode.DISABLE : voteInfo.clickModeBackup;
            if (this.qipan.state.cursor.type === 'vote') {
                this.qipan.state.cursor.type = (voteInfo.cursorTypeBackup === void 0)
                    ? 'pt' : voteInfo.cursorTypeBackup;
            }
        }
        this.qipan.state.voteInfo = void 0;
        if (this.shixiaInfo) {
            this.shixiaInfo.stateBackup.voteInfo = void 0;
        }
        this.qipan.doRender();
    };
    WeiQipan.prototype.setTeacherVoteSelection = function (gtpPt) {
        var voteInfo = this.qipan.state.voteInfo;
        if (!voteInfo) {
            console.error('setTeacherVoteSelection');
            return;
        }
        if (voteInfo.type !== 'tea') {
            console.error('setTeacherVoteSelection ', voteInfo);
            return;
        }
        if (gtpPt) {
            var pt = util_1.parseGTPCoor(gtpPt, this.config.size);
            if (pt) {
                voteInfo.pt = pt;
            }
        }
        else {
            voteInfo.pt = void 0;
        }
        this.qipan.doRender();
    };
    return WeiQipan;
}());
exports.WeiQipan = WeiQipan;

},{"./config":1,"./qipan":5,"./render":6,"./rule":7,"./state":8,"./util":10}]},{},[11])(11)
});
