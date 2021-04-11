// For for editing the metadata of the story
let metaForm = <HTMLFormElement> id("metaForm");
let metaTitle = <HTMLInputElement> id("metaTitle");
let metaSummary = <HTMLInputElement> id("metaSummary");
let metaPrice = <HTMLInputElement> id("metaPrice");

/** Output Field where the generated JSON will be displayed */
let output = <HTMLTextAreaElement> id("generatedJson");

/** Contains the generated JSON but in Javascript-Object form (can be converted to JSON) */
let DATA = { meta: {}, sections: [] };

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
class CompiledLink {
    to: string;
    button: string;
};

/** class representing a CompiledSection compatible with generated JSON */
class CompiledSection {
    is_starting: boolean;
    is_ending: boolean;
    position: string;
    text: string;
    links: Array<CompiledLink>;
};

/** Adds story sections to the generated `DATA` */
function generateSections() {
    let objSections: Array<CSection> = new Array<CSection>();
    let objLinks: Array<CLink> = new Array<CLink>();

    /** Map containing pairs (`hwnd`, `eventId`) where `hwnd` is a source node and
     *  `eventId` is the CSection to which the source node belongs) 
    */
    let SourceList: Map<Number, Number> = new Map<Number, Number>();

    // separate CSections and CLinks into two different Arrays
    for (let item of eventManager) {
        if (item && item instanceof CSection) {
            objSections.push(item);
            if (item.has_source)
                SourceList.set(item.source, item.eventId);
        } else if (item && item instanceof CLink) {
            objLinks.push(item);
        }
    }

    // in each section, add the links going out from it (buttons of a section)
    for (let sec of objSections) {
        let comSection: CompiledSection = new CompiledSection();
        comSection.is_starting = !sec.has_source;
        comSection.is_ending = (sec.no_of_sinks === 0);
        comSection.position = sec.eventId.toString();
        comSection.text = sec.storySection.text;
        comSection.links = new Array<CompiledLink>();
        for (let lin of objLinks) {
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
    let val = JSON.stringify(DATA, null, "  ");
    output.value = val;
}

/** generates JSON based on what's on the canvas currently */
function generateJson(): void {
    initData();
    generateMetaData();
    generateSections();
    displayJson();
}
