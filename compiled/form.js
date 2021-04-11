/**
 * Shorthand for document.getElementById()
 * @param val id of the element
 * @returns an HTMLElement whose id is `val`
 */
function id(val) { return document.getElementById(val); }
// Form for editing a Story Section and its elements
var CSectionForm = id("sectionForm");
var sf_id = id("sf_id");
var sf_text = id("sf_text");
var sf_source = id("sf_source");
var sf_sinks = id("sf_sinks");
// Form for editing a Story Link and its elements
var CLinkForm = id("linkForm");
var lf_id = id("lf_id");
var lf_text = id("lf_text");
/**
 * Populates the CSection form with the existing data of an object
 * @param obj CSection whose data is to be filled in the form
 */
function fillCSectionForm(obj) {
    CSectionForm.style.display = "block";
    CLinkForm.style.display = "none";
    sf_id.valueAsNumber = obj.eventId;
    sf_text.value = obj.storySection.text;
    sf_source.checked = obj.has_source;
    sf_sinks.valueAsNumber = obj.no_of_sinks;
}
/**
 * Populates the CLink form with the existing data of an object
 * @param obj CLink whose data is to be filled in the form
 */
function fillCLinkForm(obj) {
    CSectionForm.style.display = "none";
    CLinkForm.style.display = "block";
    lf_id.valueAsNumber = obj.eventId;
    lf_text.value = obj.storyLink.button;
}
/** Saves the values currently present on the CSection form */
function saveCSectionForm() {
    var i = sf_id.valueAsNumber;
    eventManager[i].storySection.text = sf_text.value;
    eventManager[i].has_source = sf_source.checked;
    eventManager[i].no_of_sinks = sf_sinks.valueAsNumber;
}
/** Saves the values currently present on the CLink form */
function saveCLinkForm() {
    var i = lf_id.valueAsNumber;
    eventManager[i].storyLink.button = lf_text.value;
}
