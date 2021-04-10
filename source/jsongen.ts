let metaForm = <HTMLFormElement> id("metaForm");
let metaTitle = <HTMLInputElement> id("metaTitle");
let metaSummary = <HTMLInputElement> id("metaSummary");
let metaPrice = <HTMLInputElement> id("metaPrice");
let output = <HTMLTextAreaElement> id("generatedJson");

let DATA = { meta: {}, sections: [] };

function initData() {
    DATA = { meta: {}, sections: [] };
}

function generateMetaData() {
    DATA.meta = {
        title: metaTitle.value,
        summary: metaSummary.value,
        price: parseFloat(metaPrice.value)
    };
}

class CompiledLink {
    to: string;
    button: string;
};

class CompiledSection {
    is_starting: boolean;
    is_ending: boolean;
    position: string;
    text: string;
    links: Array<CompiledLink>;
};

function generateSections() {
    let objSections: Array<CSection> = new Array<CSection>();
    let objLinks: Array<CLink> = new Array<CLink>();
    let SourceList: Map<Number, Number> = new Map<Number, Number>();

    for (let item of eventManager) {
        if (item && item instanceof CSection) {
            objSections.push(item);
            if (item.has_source)
                SourceList.set(item.source, item.eventId);
        } else if (item && item instanceof CLink) {
            objLinks.push(item);
        }
    }

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

function displayJson() {
    let val = JSON.stringify(DATA, null, "  ");
    output.value = val;
}

function generateJson(): void {
    initData();
    generateMetaData();
    generateSections();
    displayJson();
}
