function id(val: string) { return document.getElementById(val); }

let CSectionForm = <HTMLFormElement> id("sectionForm");
let sf_id = <HTMLInputElement> id("sf_id");
let sf_text = <HTMLTextAreaElement> id("sf_text");
let sf_source = <HTMLInputElement> id("sf_source");
let sf_sinks = <HTMLInputElement> id("sf_sinks");

let CLinkForm = <HTMLFormElement> id("linkForm");
let lf_id = <HTMLInputElement> id("lf_id");
let lf_text = <HTMLInputElement> id("lf_text");

function fillCSectionForm(obj: CSection) {
    CSectionForm.style.display = "block";
    CLinkForm.style.display = "none";
    sf_id.valueAsNumber = obj.eventId;
    sf_text.value = obj.storySection.text;
    sf_source.checked = obj.has_source;
    sf_sinks.valueAsNumber = obj.no_of_sinks;
}

function fillCLinkForm(obj: CLink) {
    CSectionForm.style.display = "none";
    CLinkForm.style.display = "block";
    lf_id.valueAsNumber = obj.eventId;
    lf_text.value = obj.storyLink.button;
}

function saveCSectionForm() {
    let i: number = sf_id.valueAsNumber;
    eventManager[i].storySection.text = sf_text.value;
    eventManager[i].has_source = sf_source.checked;
    eventManager[i].no_of_sinks = sf_sinks.valueAsNumber;
}

function saveCLinkForm() {
    let i: number = lf_id.valueAsNumber;
    eventManager[i].storyLink.button = lf_text.value;
}