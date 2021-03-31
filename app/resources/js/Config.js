const Config = {
    DRAW_DEFAULT_LINE_WIDTH: 5,
    DRAW_DEFAULT_LINE_CAP: "round",
    DRAW_DEFAULT_COLOR: "#FF0000",
    DRAW_CIRCLE_RADIUS: 18,
    DRAW_DEFAULT_ERASER_WIDTH: 20,
    ARC_END_ANGLE: Math.PI+Math.PI,

    MIN_M: 10000,
    MAX_M: 99999,

    SERVER_IP_ADRESS: "ws://localhost:2567", // works with npm and vs code liveshare, needs to get changed to the appropriate ip adress for deployment
};

Object.freeze(Config);

export default Config;