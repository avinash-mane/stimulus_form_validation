import { Controller } from '@hotwired/stimulus'

const HIDDEN_CLASS = "bs-d-none"
const DISABLE_CLASS = "bs-ui-disabled"

export default class extends Controller {

  static values = {
    checkOnload: {
        default: true,
        type: Boolean
    }
  }

  initialize(){
    this.submitTargets =  this.element.querySelectorAll('button[type="submit"]') || this.element.querySelectorAll('input[type="submit"]')
  }

  connect(){
    if(!this.submitTarget){
      const outerElement = this.element.closest('[data-controller*="modal-form"]');
      if (outerElement) {
        this.submitTargets = outerElement.querySelectorAll('button[type="submit"]') || outerElement.querySelectorAll('input[type="submit"]')
      }
    }
    
    if(this.checkOnloadValue) setTimeout(()=>this.toggleDisableSubmit(), 1000)

    this.element.querySelectorAll('[data-controller="field-validation"]').forEach((field)=>{
      if (field.tagName.toLowerCase() === 'select') 
        field.addEventListener("change", this.toggleDisableSubmit.bind(this))
      else if(["input", "textarea"].includes(field.tagName.toLowerCase()))
        field.addEventListener("input", this.toggleDisableSubmit.bind(this))
      else{
        Array.from(field.querySelectorAll("input, textarea")).forEach(i=>{
          i.addEventListener("input", this.toggleDisableSubmit.bind(this))
        })
        Array.from(field.querySelectorAll("select")).forEach(i=>{
          i.addEventListener("change", this.toggleDisableSubmit.bind(this))
        })
      }
    })
  }

  disconnect(){
    this.element.querySelectorAll('[data-controller="field-validation"]').forEach((field)=>{
      if (field.tagName.toLowerCase() === 'select') 
        field.removeEventListener("change", this.toggleDisableSubmit.bind(this))
      else if(["input", "textarea"].includes(field.tagName.toLowerCase()))
        field.removeEventListener("input", this.toggleDisableSubmit.bind(this))
      else{
        Array.from(field.querySelectorAll("input, textarea")).forEach(i=>{
          i.removeEventListener("input", this.toggleDisableSubmit.bind(this))
        })
        Array.from(field.querySelectorAll("select")).forEach(i=>{
          i.removeEventListener("change", this.toggleDisableSubmit.bind(this))
        })
      }
    })
  }

  checkFormValidity(form) {
    const elements = form.elements;
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (element.style.display.contains('none') || element.className.contains(HIDDEN_CLASS) || element.offsetParent === null) {
        continue; // Ignore hidden elements
      }
      if (!element.checkValidity()) {
        return false; // Invalid element found
      }
    }
    return true; // All visible elements are valid
  }

  toggleDisableSubmit(){
    if(this.checkFormValidity(this.element)){
        this.submitTargets.forEach(i=>i.classList.remove(DISABLE_CLASS))
    }else{
        this.submitTargets.forEach(i=>i.classList.add(DISABLE_CLASS))
    }
  }
}
