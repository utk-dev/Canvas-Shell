/**
 * Contains the data of an actual section of the story.
 */
var SSection = /** @class */ (function () {
    /** Constructs an empty story section */
    function SSection() {
        this.storyPos = undefined;
        this.text = "";
    }
    return SSection;
}());
/**
 * Contains the data of a link between two sections
 */
var SLink = /** @class */ (function () {
    /** Constructs an empty story link */
    function SLink() {
        this.from = undefined;
        this.to = undefined;
        this.button = "";
    }
    return SLink;
}());
// console.log("STORY.TS LOADED");
