// For for editing the metadata of the story
var metaForm = id("metaForm");
var metaTitle = id("metaTitle");
var metaSummary = id("metaSummary");
var metaPrice = id("metaPrice");
/** Output Field where the generated JSON will be displayed */
var output = id("generatedJson");
/** Contains the generated JSON but in Javascript-Object form (can be converted to JSON) */
var DATA = { meta: {}, sections: [] };
/** Initializes/Resets the generated `DATA` */
function initData() {
    DATA = { meta: {}, sections: [] };
}
/** Adds meta information to the generated `DATA` */
function generateMetaData() {
    DATA.meta = {
        title: metaTitle.value,
        summary: metaSummary.value,
        price: parseFloat(metaPrice.value)
    };
}
/** class representing a CompiledLink compatible with generated JSON */
var CompiledLink = /** @class */ (function () {
    function CompiledLink() {
    }
    return CompiledLink;
}());
;
/** class representing a CompiledSection compatible with generated JSON */
var CompiledSection = /** @class */ (function () {
    function CompiledSection() {
    }
    return CompiledSection;
}());
;
/** Adds story sections to the generated `DATA` */
function generateSections() {
    var objSections = new Array();
    var objLinks = new Array();
    /** Map containing pairs (`hwnd`, `eventId`) where `hwnd` is a source node and
     *  `eventId` is the CSection to which the source node belongs)
    */
    var SourceList = new Map();
    // separate CSections and CLinks into two different Arrays
    for (var _i = 0, eventManager_1 = eventManager; _i < eventManager_1.length; _i++) {
        var item = eventManager_1[_i];
        if (item && item instanceof CSection) {
            objSections.push(item);
            if (item.has_source)
                SourceList.set(item.source, item.eventId);
        }
        else if (item && item instanceof CLink) {
            objLinks.push(item);
        }
    }
    // in each section, add the links going out from it (buttons of a section)
    for (var _a = 0, objSections_1 = objSections; _a < objSections_1.length; _a++) {
        var sec = objSections_1[_a];
        var comSection = new CompiledSection();
        comSection.is_starting = !sec.has_source;
        comSection.is_ending = (sec.no_of_sinks === 0);
        comSection.position = sec.eventId.toString();
        comSection.text = sec.storySection.text;
        comSection.links = new Array();
        for (var _b = 0, objLinks_1 = objLinks; _b < objLinks_1.length; _b++) {
            var lin = objLinks_1[_b];
            if (sec.sink.includes(lin.storyLink.from)) {
                comSection.links.push({
                    to: SourceList.get(lin.storyLink.to).toString(),
                    button: lin.storyLink.button
                });
            }
        }
        DATA.sections.push(comSection);
    }
}
/** Displays JSON on the Output Field */
function displayJson() {
    var val = JSON.stringify(DATA, null, "  ");
    output.value = val;
}
/** generates JSON based on what's on the canvas currently */
function generateJson() {
    initData();
    generateMetaData();
    generateSections();
    displayJson();
}
