import * as rc from "./rive_advanced.mjs";
export type { FileAsset, AudioAsset, FontAsset, ImageAsset, } from "./rive_advanced.mjs";
/**
 * Generic type for a parameterless void callback
 */
export type VoidCallback = () => void;
export type AssetLoadCallback = (asset: rc.FileAsset, bytes: Uint8Array) => Boolean;
interface SetupRiveListenersOptions {
    isTouchScrollEnabled?: boolean;
}
/**
 * Type for artboard bounds
 */
export type Bounds = rc.AABB;
export declare enum Fit {
    Cover = "cover",
    Contain = "contain",
    Fill = "fill",
    FitWidth = "fitWidth",
    FitHeight = "fitHeight",
    None = "none",
    ScaleDown = "scaleDown",
    Layout = "layout"
}
export declare enum Alignment {
    Center = "center",
    TopLeft = "topLeft",
    TopCenter = "topCenter",
    TopRight = "topRight",
    CenterLeft = "centerLeft",
    CenterRight = "centerRight",
    BottomLeft = "bottomLeft",
    BottomCenter = "bottomCenter",
    BottomRight = "bottomRight"
}
export interface LayoutParameters {
    fit?: Fit;
    alignment?: Alignment;
    layoutScaleFactor?: number;
    minX?: number;
    minY?: number;
    maxX?: number;
    maxY?: number;
}
export declare class Layout {
    private cachedRuntimeFit;
    private cachedRuntimeAlignment;
    readonly fit: Fit;
    readonly alignment: Alignment;
    readonly layoutScaleFactor: number;
    readonly minX: number;
    readonly minY: number;
    readonly maxX: number;
    readonly maxY: number;
    constructor(params?: LayoutParameters);
    static new({ fit, alignment, minX, minY, maxX, maxY, }: LayoutParameters): Layout;
    /**
     * Makes a copy of the layout, replacing any specified parameters
     */
    copyWith({ fit, alignment, layoutScaleFactor, minX, minY, maxX, maxY, }: LayoutParameters): Layout;
    runtimeFit(rive: rc.RiveCanvas): rc.Fit;
    runtimeAlignment(rive: rc.RiveCanvas): rc.Alignment;
}
export type RuntimeCallback = (rive: rc.RiveCanvas) => void;
export declare class RuntimeLoader {
    private static runtime;
    private static isLoading;
    private static callBackQueue;
    private static rive;
    private static wasmURL;
    private constructor();
    private static loadRuntime;
    static getInstance(callback: RuntimeCallback): void;
    static awaitInstance(): Promise<rc.RiveCanvas>;
    static setWasmUrl(url: string): void;
    static getWasmUrl(): string;
}
export declare enum StateMachineInputType {
    Number = 56,
    Trigger = 58,
    Boolean = 59
}
/**
 * An input for a state machine
 */
export declare class StateMachineInput {
    readonly type: StateMachineInputType;
    private runtimeInput;
    constructor(type: StateMachineInputType, runtimeInput: rc.SMIInput);
    /**
     * Returns the name of the input
     */
    get name(): string;
    /**
     * Returns the current value of the input
     */
    get value(): number | boolean;
    /**
     * Sets the value of the input
     */
    set value(value: number | boolean);
    /**
     * Fires a trigger; does nothing on Number or Boolean input types
     */
    fire(): void;
    /**
     * Deletes the input
     */
    delete(): void;
}
export declare enum RiveEventType {
    General = 128,
    OpenUrl = 131
}
/**
 * Supported event types triggered in Rive
 */
export declare enum EventType {
    Load = "load",
    LoadError = "loaderror",
    Play = "play",
    Pause = "pause",
    Stop = "stop",
    Loop = "loop",
    Draw = "draw",
    Advance = "advance",
    StateChange = "statechange",
    RiveEvent = "riveevent",
    AudioStatusChange = "audiostatuschange"
}
export type RiveEventPayload = rc.RiveEvent | rc.OpenUrlEvent;
export interface Event {
    type: EventType;
    data?: string | string[] | LoopEvent | number | RiveEventPayload | RiveFile;
}
/**
 * Looping types: one-shot, loop, and ping-pong
 */
export declare enum LoopType {
    OneShot = "oneshot",
    Loop = "loop",
    PingPong = "pingpong"
}
/**
 * Loop events are returned through onloop callbacks
 */
export interface LoopEvent {
    animation: string;
    type: LoopType;
}
/**
 * Loop events are returned through onloop callbacks
 */
export type EventCallback = (event: Event) => void;
/**
 * Event listeners registered with the event manager
 */
export interface EventListener {
    type: EventType;
    callback: EventCallback;
}
/**
 * FPS Reporting through callbacks sent to the WASM runtime
 */
export type FPSCallback = (fps: number) => void;
declare class EventManager {
    private listeners;
    constructor(listeners?: EventListener[]);
    private getListeners;
    add(listener: EventListener): void;
    /**
     * Removes a listener
     * @param listener the listener with the callback to be removed
     */
    remove(listener: EventListener): void;
    /**
     * Clears all listeners of specified type, or every listener if no type is
     * specified
     * @param type the type of listeners to clear, or all listeners if not
     * specified
     */
    removeAll(type?: EventType): void;
    fire(event: Event): void;
}
export interface Task {
    action?: VoidCallback;
    event?: Event;
}
declare class TaskQueueManager {
    private eventManager;
    private queue;
    constructor(eventManager: EventManager);
    add(task: Task): void;
    process(): void;
}
export interface RiveParameters {
    canvas: HTMLCanvasElement | OffscreenCanvas;
    src?: string;
    buffer?: ArrayBuffer;
    riveFile?: RiveFile;
    artboard?: string;
    animations?: string | string[];
    stateMachines?: string | string[];
    layout?: Layout;
    autoplay?: boolean;
    useOffscreenRenderer?: boolean;
    /**
     * Allow the runtime to automatically load assets hosted in Rive's CDN.
     * enabled by default.
     */
    enableRiveAssetCDN?: boolean;
    /**
     * Turn off Rive Listeners. This means state machines that have Listeners
     * will not be invoked, and also, no event listeners pertaining to Listeners
     * will be attached to the <canvas> element
     */
    shouldDisableRiveListeners?: boolean;
    /**
     * For Rive Listeners, allows scrolling behavior to still occur on canvas elements
     * when a touch/drag action is performed on touch-enabled devices. Otherwise,
     * scroll behavior may be prevented on touch/drag actions on the canvas by default.
     */
    isTouchScrollEnabled?: boolean;
    /**
     * Enable Rive Events to be handled by the runtime. This means any special Rive Event may have
     * a side effect that takes place implicitly.
     *
     * For example, if during the render loop an OpenUrlEvent is detected, the
     * browser may try to open the specified URL in the payload.
     *
     * This flag is false by default to prevent any unwanted behaviors from taking place.
     * This means any special Rive Event will have to be handled manually by subscribing to
     * EventType.RiveEvent
     */
    automaticallyHandleEvents?: boolean;
    onLoad?: EventCallback;
    onLoadError?: EventCallback;
    onPlay?: EventCallback;
    onPause?: EventCallback;
    onStop?: EventCallback;
    onLoop?: EventCallback;
    onStateChange?: EventCallback;
    onAdvance?: EventCallback;
    assetLoader?: AssetLoadCallback;
    /**
     * @deprecated Use `onLoad()` instead
     */
    onload?: EventCallback;
    /**
     * @deprecated Use `onLoadError()` instead
     */
    onloaderror?: EventCallback;
    /**
     * @deprecated Use `onPoad()` instead
     */
    onplay?: EventCallback;
    /**
     * @deprecated Use `onPause()` instead
     */
    onpause?: EventCallback;
    /**
     * @deprecated Use `onStop()` instead
     */
    onstop?: EventCallback;
    /**
     * @deprecated Use `onLoop()` instead
     */
    onloop?: EventCallback;
    /**
     * @deprecated Use `onStateChange()` instead
     */
    onstatechange?: EventCallback;
}
export interface RiveLoadParameters {
    src?: string;
    buffer?: ArrayBuffer;
    riveFile?: RiveFile;
    autoplay?: boolean;
    artboard?: string;
    animations?: string | string[];
    stateMachines?: string | string[];
    useOffscreenRenderer?: boolean;
    shouldDisableRiveListeners?: boolean;
}
export interface RiveResetParameters {
    artboard?: string;
    animations?: string | string[];
    stateMachines?: string | string[];
    autoplay?: boolean;
}
export interface RiveFileParameters {
    src?: string;
    buffer?: ArrayBuffer;
    assetLoader?: AssetLoadCallback;
    enableRiveAssetCDN?: boolean;
    onLoad?: EventCallback;
    onLoadError?: EventCallback;
}
export declare class RiveFile {
    private static readonly missingErrorMessage;
    private static readonly fileLoadErrorMessage;
    private src;
    private buffer;
    private runtime;
    private file;
    private assetLoader;
    private enableRiveAssetCDN;
    private eventManager;
    private referenceCount;
    constructor(params: RiveFileParameters);
    private initData;
    init(): Promise<void>;
    /**
     * Subscribe to Rive-generated events
     * @param type the type of event to subscribe to
     * @param callback callback to fire when the event occurs
     */
    on(type: EventType, callback: EventCallback): void;
    /**
     * Unsubscribes from a Rive-generated event
     * @param type the type of event to unsubscribe from
     * @param callback the callback to unsubscribe
     */
    off(type: EventType, callback: EventCallback): void;
    cleanup(): void;
    /**
     * Unsubscribes all Rive listeners from an event type, or everything if no type is
     * given
     * @param type the type of event to unsubscribe from, or all types if
     * undefined
     */
    removeAllRiveEventListeners(type?: EventType): void;
    getInstance(): rc.File;
}
export declare class Rive {
    private readonly canvas;
    private src;
    private buffer;
    private _layout;
    private renderer;
    private loaded;
    private _observed;
    /**
     * Tracks if a Rive file is loaded; we need this in addition to loaded as some
     * commands (e.g. contents) can be called as soon as the file is loaded.
     * However, playback commands need to be queued and run in order once initial
     * animations and autoplay has been sorted out. This applies to play, pause,
     * and start.
     */
    private readyForPlaying;
    private runtime;
    private artboard;
    private eventCleanup;
    private file;
    private riveFile;
    private eventManager;
    private taskQueue;
    private animator;
    private assetLoader;
    private static readonly missingErrorMessage;
    private shouldDisableRiveListeners;
    private automaticallyHandleEvents;
    private enableRiveAssetCDN;
    private _volume;
    private _artboardWidth;
    private _artboardHeight;
    private _devicePixelRatioUsed;
    private _hasZeroSize;
    private _audioEventListener;
    durations: number[];
    frameTimes: number[];
    frameCount: number;
    isTouchScrollEnabled: boolean;
    constructor(params: RiveParameters);
    static new(params: RiveParameters): Rive;
    private onSystemAudioChanged;
    private onCanvasResize;
    private init;
    /**
     * Setup Rive Listeners on the canvas
     * @param riveListenerOptions - Enables TouchEvent events on the canvas. Set to true to allow
     * touch scrolling on the canvas element on touch-enabled devices
     * i.e. { isTouchScrollEnabled: true }
     */
    setupRiveListeners(riveListenerOptions?: SetupRiveListenersOptions): void;
    /**
     * Remove Rive Listeners setup on the canvas
     */
    removeRiveListeners(): void;
    /**
     * If the instance has audio and the system audio is not ready
     * we hook the instance to the audio manager
     */
    private initializeAudio;
    private initArtboardSize;
    private initData;
    private initArtboard;
    drawFrame(): void;
    private lastRenderTime;
    private frameRequestId;
    /**
     * Used be draw to track when a second of active rendering time has passed.
     * Used for debugging purposes
     */
    private renderSecondTimer;
    /**
     * Draw rendering loop; renders animation frames at the correct time interval.
     * @param time the time at which to render a frame
     */
    private draw;
    /**
     * Align the renderer
     */
    private alignRenderer;
    get fps(): number;
    get frameTime(): string | 0;
    /**
     * Cleans up all Wasm-generated objects that need to be manually destroyed:
     * artboard instances, animation instances, state machine instances,
     * renderer instance, file and runtime.
     *
     * Once this is called, you will need to initialise a new instance of the
     * Rive class
     */
    cleanup(): void;
    /**
     * Cleans up the Renderer object. Only call this API if you no longer
     * need to render Rive content in your session.
     */
    deleteRiveRenderer(): void;
    /**
     * Cleans up any Wasm-generated objects that need to be manually destroyed:
     * artboard instances, animation instances, state machine instances.
     *
     * Once this is called, things will need to be reinitialized or bad things
     * might happen.
     */
    cleanupInstances(): void;
    /**
     * Tries to query the setup Artboard for a text run node with the given name.
     *
     * @param textRunName - Name of the text run node associated with a text object
     * @returns - TextValueRun node or undefined if the text run cannot be queried
     */
    private retrieveTextRun;
    /**
     * Returns a string from a given text run node name, or undefined if the text run
     * cannot be queried.
     *
     * @param textRunName - Name of the text run node associated with a text object
     * @returns - String value of the text run node or undefined
     */
    getTextRunValue(textRunName: string): string | undefined;
    /**
     * Sets a text value for a given text run node name if possible
     *
     * @param textRunName - Name of the text run node associated with a text object
     * @param textRunValue - String value to set on the text run node
     */
    setTextRunValue(textRunName: string, textRunValue: string): void;
    play(animationNames?: string | string[], autoplay?: true): void;
    pause(animationNames?: string | string[]): void;
    scrub(animationNames?: string | string[], value?: number): void;
    stop(animationNames?: string | string[] | undefined): void;
    /**
     * Resets the animation
     * @param artboard the name of the artboard, or default if none given
     * @param animations the names of animations for playback
     * @param stateMachines the names of state machines for playback
     * @param autoplay whether to autoplay when reset, defaults to false
     *
     */
    reset(params?: RiveResetParameters): void;
    load(params: RiveLoadParameters): void;
    set layout(layout: Layout);
    /**
     * Returns the current layout. Note that layout should be treated as
     * immutable. If you want to change the layout, create a new one use the
     * layout setter
     */
    get layout(): Layout;
    /**
     * Sets the layout bounds to the current canvas size; this is typically called
     * when the canvas is resized
     */
    resizeToCanvas(): void;
    /**
     * Accounts for devicePixelRatio as a multiplier to render the size of the canvas drawing surface.
     * Uses the size of the backing canvas to set new width/height attributes. Need to re-render
     * and resize the layout to match the new drawing surface afterwards.
     * Useful function for consumers to include in a window resize listener.
     *
     * This method will set the {@link devicePixelRatioUsed} property.
     *
     * Optionally, you can provide a {@link customDevicePixelRatio} to provide a
     * custom value.
     */
    resizeDrawingSurfaceToCanvas(customDevicePixelRatio?: number): void;
    get source(): string;
    /**
     * Returns the name of the active artboard
     */
    get activeArtboard(): string;
    get animationNames(): string[];
    /**
     * Returns a list of state machine names from the current artboard
     */
    get stateMachineNames(): string[];
    /**
     * Returns the inputs for the specified instanced state machine, or an empty
     * list if the name is invalid or the state machine is not instanced
     * @param name the state machine name
     * @returns the inputs for the named state machine
     */
    stateMachineInputs(name: string): StateMachineInput[];
    private retrieveInputAtPath;
    /**
     * Set the boolean input with the provided name at the given path with value
     * @param input the state machine input name
     * @param value the value to set the input to
     * @param path the path the input is located at an artboard level
     */
    setBooleanStateAtPath(inputName: string, value: boolean, path: string): void;
    /**
     * Set the number input with the provided name at the given path with value
     * @param input the state machine input name
     * @param value the value to set the input to
     * @param path the path the input is located at an artboard level
     */
    setNumberStateAtPath(inputName: string, value: number, path: string): void;
    /**
     * Fire the trigger with the provided name at the given path
     * @param input the state machine input name
     * @param path the path the input is located at an artboard level
     */
    fireStateAtPath(inputName: string, path: string): void;
    private retrieveTextAtPath;
    /**
     * Retrieves the text value for a specified text run at a given path
     * @param textName The name of the text run
     * @param path The path to the text run within the artboard
     * @returns The text value of the text run, or undefined if not found
     *
     * @example
     * // Get the text value for a text run named "title" at one nested artboard deep
     * const titleText = riveInstance.getTextRunValueAtPath("title", "artboard1");
     *
     * @example
     * // Get the text value for a text run named "subtitle" within a nested group two artboards deep
     * const subtitleText = riveInstance.getTextRunValueAtPath("subtitle", "group/nestedGroup");
     *
     * @remarks
     * If the text run cannot be found at the specified path, a warning will be logged to the console.
     */
    getTextRunValueAtPath(textName: string, path: string): string | undefined;
    /**
     * Sets the text value for a specified text run at a given path
     * @param textName The name of the text run
     * @param value The new text value to set
     * @param path The path to the text run within the artboard
     * @returns void
     *
     * @example
     * // Set the text value for a text run named "title" at one nested artboard deep
     * riveInstance.setTextRunValueAtPath("title", "New Title", "artboard1");
     *
     * @example
     * // Set the text value for a text run named "subtitle" within a nested group two artboards deep
     * riveInstance.setTextRunValueAtPath("subtitle", "New Subtitle", "group/nestedGroup");
     *
     * @remarks
     * If the text run cannot be found at the specified path, a warning will be logged to the console.
     */
    setTextRunValueAtPath(textName: string, value: string, path: string): void;
    get playingStateMachineNames(): string[];
    get playingAnimationNames(): string[];
    get pausedAnimationNames(): string[];
    /**
     *  Returns a list of paused machine names
     * @returns a list of state machine names that are paused
     */
    get pausedStateMachineNames(): string[];
    /**
     * @returns true if any animation is playing
     */
    get isPlaying(): boolean;
    /**
     * @returns true if all instanced animations are paused
     */
    get isPaused(): boolean;
    /**
     * @returns true if no animations are playing or paused
     */
    get isStopped(): boolean;
    /**
     * @returns the bounds of the current artboard, or undefined if the artboard
     * isn't loaded yet.
     */
    get bounds(): Bounds;
    /**
     * Subscribe to Rive-generated events
     * @param type the type of event to subscribe to
     * @param callback callback to fire when the event occurs
     */
    on(type: EventType, callback: EventCallback): void;
    /**
     * Unsubscribes from a Rive-generated event
     * @param type the type of event to unsubscribe from
     * @param callback the callback to unsubscribe
     */
    off(type: EventType, callback: EventCallback): void;
    /**
     * Unsubscribes from a Rive-generated event
     * @deprecated
     * @param callback the callback to unsubscribe from
     */
    unsubscribe(type: EventType, callback: EventCallback): void;
    /**
     * Unsubscribes all Rive listeners from an event type, or everything if no type is
     * given
     * @param type the type of event to unsubscribe from, or all types if
     * undefined
     */
    removeAllRiveEventListeners(type?: EventType): void;
    /**
     * Unsubscribes all listeners from an event type, or everything if no type is
     * given
     * @deprecated
     * @param type the type of event to unsubscribe from, or all types if
     * undefined
     */
    unsubscribeAll(type?: EventType): void;
    /**
     * Stops the rendering loop; this is different from pausing in that it doesn't
     * change the state of any animation. It stops rendering from occurring. This
     * is designed for situations such as when Rive isn't visible.
     *
     * The only way to start rendering again is to call `startRendering`.
     * Animations that are marked as playing will start from the position that
     * they would have been at if rendering had not been stopped.
     */
    stopRendering(): void;
    /**
     * Starts the rendering loop if it has been previously stopped. If the
     * renderer is already active, then this will have zero effect.
     */
    startRendering(): void;
    /**
     * Enables frames-per-second (FPS) reporting for the runtime
     * If no callback is provided, Rive will append a fixed-position div at the top-right corner of
     * the page with the FPS reading
     * @param fpsCallback - Callback from the runtime during the RAF loop that supplies the FPS value
     */
    enableFPSCounter(fpsCallback?: FPSCallback): void;
    /**
     * Disables frames-per-second (FPS) reporting for the runtime
     */
    disableFPSCounter(): void;
    /**
     * Returns the contents of a Rive file: the artboards, animations, and state machines
     */
    get contents(): RiveFileContents;
    /**
     * Getter / Setter for the volume of the artboard
     */
    get volume(): number;
    set volume(value: number);
    /**
     * The width of the artboard.
     *
     * This will return 0 if the artboard is not loaded yet and a custom
     * width has not been set.
     *
     * Do not set this value manually when using {@link resizeDrawingSurfaceToCanvas}
     * with a {@link Layout.fit} of {@link Fit.Layout}, as the artboard width is
     * automatically set.
     */
    get artboardWidth(): number;
    set artboardWidth(value: number);
    /**
     * The height of the artboard.
     *
     * This will return 0 if the artboard is not loaded yet and a custom
     * height has not been set.
     *
     * Do not set this value manually when using {@link resizeDrawingSurfaceToCanvas}
     * with a {@link Layout.fit} of {@link Fit.Layout}, as the artboard height is
     * automatically set.
     */
    get artboardHeight(): number;
    set artboardHeight(value: number);
    /**
     * Reset the artboard size to its original values.
     */
    resetArtboardSize(): void;
    /**
     * The device pixel ratio used in rendering and canvas/artboard resizing.
     *
     * This value will be overidden by the device pixel ratio used in
     * {@link resizeDrawingSurfaceToCanvas}. If you use that method, do not set this value.
     */
    get devicePixelRatioUsed(): number;
    set devicePixelRatioUsed(value: number);
}
/**
 * Contents of a state machine input
 */
interface StateMachineInputContents {
    name: string;
    type: StateMachineInputType;
    initialValue?: boolean | number;
}
/**
 * Contents of a state machine
 */
interface StateMachineContents {
    name: string;
    inputs: StateMachineInputContents[];
}
/**
 * Contents of an artboard
 */
interface ArtboardContents {
    animations: string[];
    stateMachines: StateMachineContents[];
    name: string;
}
/**
 * contents of a Rive file
 */
interface RiveFileContents {
    artboards?: ArtboardContents[];
}
export declare const Testing: {
    EventManager: typeof EventManager;
    TaskQueueManager: typeof TaskQueueManager;
};
/**
 * Decodes bytes into an audio asset.
 *
 * Be sure to call `.unref()` on the audio once it is no longer needed. This
 * allows the engine to clean it up when it is not used by any more animations.
 */
export declare const decodeAudio: (bytes: Uint8Array) => Promise<rc.Audio>;
/**
 * Decodes bytes into an image.
 *
 * Be sure to call `.unref()` on the image once it is no longer needed. This
 * allows the engine to clean it up when it is not used by any more animations.
 */
export declare const decodeImage: (bytes: Uint8Array) => Promise<rc.Image>;
/**
 * Decodes bytes into a font.
 *
 * Be sure to call `.unref()` on the font once it is no longer needed. This
 * allows the engine to clean it up when it is not used by any more animations.
 */
export declare const decodeFont: (bytes: Uint8Array) => Promise<rc.Font>;
