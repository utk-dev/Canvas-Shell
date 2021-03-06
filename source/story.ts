class SSection {
    public storyPos: string;
    public text: string;
    constructor() {
        this.storyPos = undefined;
        this.text = "";
    }
}

class SLink {
    public from: number;
    public to: number;
    public button: string;
    constructor() {
        this.from = undefined;
        this.to = undefined;
        this.button = "";
    }
}

console.log("STORY.TS LOADED");