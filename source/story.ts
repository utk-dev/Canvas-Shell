class SSection {
    public storyPos: string;
    public text: string;
    constructor() {
        this.storyPos = undefined;
        this.text = undefined;
    }
}

class SLink {
    public from: number;
    public to: number;
    public button: string;
    constructor() {
        this.from = undefined;
        this.to = undefined;
        this.button = undefined;
    }
}

console.log("STORY.TS LOADED");