import { Controller } from '@hotwired/stimulus'

const HIDDEN_CLASS = "bs-d-none"

export default class extends Controller {

  static targets = [ "errorText" ]
  
  connect() {
    let element = this.element.querySelector("input")
    if(element)
      element.addEventListener("input", this.validateInput.bind(this));
    else
      this.element.addEventListener("input", this.validateInput.bind(this));
  }

  validateInput(event) {
    const input = event.target;
    const { requiredError, minError, maxError, invalidError, maxlengthError, minlengthError } = event.target.dataset
    const value = input.value
    const min = parseInt(input.min);
    const max = parseInt(input.max);
    const minLength = parseInt(input.minLength);
    const maxLength = parseInt(input.maxLength);

    let errorText = ""

    if(input.required && !value) errorText = requiredError
    else if(input.type == "number"){
        //min and max attributes used only in number type
        if( min && value && value < min) errorText = minError || invalidError
        else if(max && value && value > max) errorText = maxError || invalidError
    }else if(input.type == "text"){
        //minlength and maxlength attributes used only in text type
        if(minLength > 0 && value && value.length < minLength) errorText = minlengthError || invalidError
        else if(maxLength > 0 && value && value.length > maxLength) errorText = maxlengthError || invalidError
    }

    if(!errorText && !input.checkValidity()) errorText = invalidError

    if (errorText) {
      input.classList.add("bs-border-danger");
      if(this.hasErrorTextTarget){
        this.errorTextTarget.classList.remove(HIDDEN_CLASS)
        this.errorTextTarget.innerHTML= errorText
      }
    } else {
      input.classList.remove("bs-border-danger");
      if(this.hasErrorTextTarget)
        this.errorTextTarget.classList.add(HIDDEN_CLASS)
    }
  }
}
