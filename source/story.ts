/**
 * Contains the data of an actual section of the story.
 */
class SSection {
    /** **Deprecated** Position of the section in the story. */
    public storyPos: string;

    /** Actual text in this section of the story. */
    public text: string;

    /** Constructs an empty story section */
    constructor() {
        this.storyPos = undefined;
        this.text = "";
    }
}

/**
 * Contains the data of a link between two sections
 */
class SLink {
    /** ```hwnd``` of the outgoing Primitive Shape (where this Link comes from). */
    public from: number;

    /** ```hwnd``` of the incoming Primitive Shape (where this Link goes to).*/
    public to: number;

    /** text displayed on the button representing this Link */
    public button: string;

    /** Constructs an empty story link */
    constructor() {
        this.from = undefined;
        this.to = undefined;
        this.button = "";
    }
}

// console.log("STORY.TS LOADED");