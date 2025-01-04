async function rivestart(canvas , src) {

    const r = new rive.Rive({
        src: src,
        // OR the path to a discoverable and public Rive asset
        // src: '/public/example.riv',
        canvas: document.getElementById(canvas),
        autoplay: true,
        // artboard: "Arboard", // Optional. If not supplied the default is selected
        stateMachines: "bumpy",
        onLoad: () => {
            r.resizeDrawingSurfaceToCanvas();
        },
    });

}