# Canvas Shell

An Extensible Node Editor based on CanvasAPI

<p align="center">
<img src="https://i.ibb.co/Lv3q56z/Canvas-Shell.png">
</p>

Canvas Shell is a node-editor that allows you to visually construct tree-like structures and generate code/text from them. As an example, it has been slightly tailored for my other project [Storyteller](https://github.com/utk-dev/Storyteller "Interactive Story Reading Experience"). Some salient features of this editor are:

* Built with HTML Canvas 2D Renderer for fast performance.
* Layered Architecture - allows anyone to extend and adapt it to their own need.
* Written in Typescript - can be compiled to older versions of javascript for wider support.
* Runs statically on the client side.

### Architecture

This editor has been structured as follows:

<p align="center">
<img src="https://i.ibb.co/tBTZWtV/architecture.png" border="1">
</p>

1. **Primitive Shapes**: HTMLCanvas does not remember what is drawn on the screen. These classes encapsulate simple low-level canvasAPI shapes like rectangles and lines that know how to draw themselves on the screen and if the mouse-pointer is on them.
2. **Story Classes**: These are meta-data classes that contain additional information about each node (in the example provided in this repository, these are the classes from the Storyteller project). This data can be edited through a form that shows up whenever a node is selected.
3. **Complex Shapes**: These classes encapsulate several primitive shapes with a story class (meta-data) and contain various event handlers. All programmatic interaction with the node-editor are done through these classes.

### Usage Tips

Nodes and the links between them can be deleted by right clicking them. The example generates JSON compatible with the StorySchema of an interactive story. All nodes have one or more sockets on them. Sockets are used to connect two nodes together. Sockets are also a type of Primitive Shape which can act as a starting or ending point for a line.

All primitive shapes are stored in `canvasManager` array, while all complex shapes are stored in `eventManager` array. To iterate through all primitive shapes, for example, one can do as follows:

```typescript
for (let primitiveShape of canvasManager) {
    if (primitiveShape !== null) {
        // do something with the primitiveShape
    }
}
```

Canvas Shell follows the ImGUI pattern - An object is drawn as soon as it is instantiated. Still, if you arrive at a scenario where the UI is not updated, you can call the `requestRedraw()` function anytime to redraw everything on the screen with the latest data from the `canvasManager` array.

If you want to understand how everything works, read the code in the following order (all files have been heavily commented):

1. [source/core.ts](https://github.com/utk-dev/Canvas-Shell/blob/main/source/core.ts "Setup Code")
2. [source/primitive.ts](https://github.com/utk-dev/Canvas-Shell/blob/main/source/primitive.ts "Primitive Shapes")
3. [source/story.ts](https://github.com/utk-dev/Canvas-Shell/blob/main/source/story.ts "Meta Data")
4. [source/complex.ts](https://github.com/utk-dev/Canvas-Shell/blob/main/source/complex.ts "Complex Shapes")
5. [source/form.ts](https://github.com/utk-dev/Canvas-Shell/blob/main/source/form.ts "Form Handling")
6. [source/jsongen.ts](https://github.com/utk-dev/Canvas-Shell/blob/main/source/jsongen.ts "Generating JSON")
7. [source/event.ts](https://github.com/utk-dev/Canvas-Shell/blob/main/source/event.ts "Event Handlers")

All pull requests are welcome!
