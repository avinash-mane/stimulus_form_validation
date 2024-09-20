import { Controller } from '@hotwired/stimulus'

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
    
    if(this.checkOnloadValue) this.toggleDisableSubmit()
        
    this.element.querySelectorAll('input[type="checkbox"]').forEach((field)=>{
        field.addEventListener("change", this.toggleDisableSubmit.bind(this))
    })
  }

  disconnect(){
    this.element.querySelectorAll('input[type="checkbox"]').forEach((field)=>{
        field.removeEventListener("change", this.toggleDisableSubmit.bind(this))
    })
  }

  toggleDisableSubmit(){
    if(this.element.querySelectorAll('input[type="checkbox"]:checked').length){
        this.submitTargets.forEach(i=>i.classList.remove("bs-ui-disabled"))
    }else{
        this.submitTargets.forEach(i=>i.classList.add("bs-ui-disabled"))
    }
  }
}
