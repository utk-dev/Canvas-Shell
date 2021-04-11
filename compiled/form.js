function id(val) { return document.getElementById(val); }
var CSectionForm = id("sectionForm");
var sf_id = id("sf_id");
var sf_text = id("sf_text");
var sf_source = id("sf_source");
var sf_sinks = id("sf_sinks");
var CLinkForm = id("linkForm");
var lf_id = id("lf_id");
var lf_text = id("lf_text");
function fillCSectionForm(obj) {
    CSectionForm.style.display = "block";
    CLinkForm.style.display = "none";
    sf_id.valueAsNumber = obj.eventId;
    sf_text.value = obj.storySection.text;
    sf_source.checked = obj.has_source;
    sf_sinks.valueAsNumber = obj.no_of_sinks;
}
function fillCLinkForm(obj) {
    CSectionForm.style.display = "none";
    CLinkForm.style.display = "block";
    lf_id.valueAsNumber = obj.eventId;
    lf_text.value = obj.storyLink.button;
}
function saveCSectionForm() {
    var i = sf_id.valueAsNumber;
    eventManager[i].storySection.text = sf_text.value;
    eventManager[i].has_source = sf_source.checked;
    eventManager[i].no_of_sinks = sf_sinks.valueAsNumber;
}
function saveCLinkForm() {
    var i = lf_id.valueAsNumber;
    eventManager[i].storyLink.button = lf_text.value;
}
